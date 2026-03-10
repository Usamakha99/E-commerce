import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { mapProduct, mapProducts } from '../utils/dataMapper';

export const productService = {
  // Helper: extract array from API response
  _extractList(resp) {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp;
    if (Array.isArray(resp?.data)) return resp.data;
    if (Array.isArray(resp?.categories)) return resp.categories;
    return [];
  },

  // Get all categories with subcategories (sidebar). Minimal load: 1 request preferred, cache 5 min.
  _categoriesCache: null,
  _categoriesCacheTime: 0,
  _categoriesCacheTtlMs: 5 * 60 * 1000,

  // Single endpoint: all brands + all subcategories, no pagination. Cache 5 min so getAllCategories + getAllBrands share one request.
  _filtersCache: null,
  _filtersCacheTime: 0,
  _filtersCacheTtlMs: 5 * 60 * 1000,

  getBrandsAndSubcategories: async () => {
    const now = Date.now();
    if (productService._filtersCache && now - productService._filtersCacheTime < productService._filtersCacheTtlMs) {
      return productService._filtersCache;
    }
    try {
      const url = API_ENDPOINTS.filters?.brandsAndSubcategories;
      if (!url) return null;
      const res = await apiService.get(url);
      // Support multiple response shapes: { brands, subcategories } or { data: { brands, subcategories } }
      const raw = res?.data || res;
      const brands = Array.isArray(raw?.brands) ? raw.brands : Array.isArray(res?.brands) ? res.brands : [];
      const subcategories = Array.isArray(raw?.subcategories) ? raw.subcategories : Array.isArray(res?.subcategories) ? res.subcategories : [];
      productService._filtersCache = { brands, subcategories };
      productService._filtersCacheTime = Date.now();
      if (brands.length > 0 || subcategories.length > 0) {
        console.log('[Filters] GET /filters/brands-and-subcategories:', { brands: brands.length, subcategories: subcategories.length });
      }
      return productService._filtersCache;
    } catch (_e) {
      console.warn('[Filters] /filters/brands-and-subcategories failed, using fallbacks:', _e?.message || _e);
      return null;
    }
  },

  getAllCategories: async () => {
    const now = Date.now();
    if (productService._categoriesCache && now - productService._categoriesCacheTime < productService._categoriesCacheTtlMs) {
      return productService._categoriesCache;
    }

    const extractList = (r, key = 'data') => {
      if (!r) return [];
      if (Array.isArray(r?.[key])) return r[key];
      if (Array.isArray(r?.data)) return r.data;
      if (Array.isArray(r?.categories)) return r.categories;
      if (Array.isArray(r?.subcategories)) return r.subcategories;
      if (Array.isArray(r)) return r;
      return [];
    };
    const norm = (c) => ({
      id: c.id,
      title: c.title ?? c.name,
      name: c.title ?? c.name,
      productCount: c.productCount ?? c.count ?? c.product_count ?? c.productsCount ?? c.totalProducts ?? c.total_products ?? 0,
      parentId: c.parentId ?? c.categoryId ?? null,
      children: [],
    });

    try {
      let list = [];

      // Prefer single endpoint: GET /api/filters/brands-and-subcategories → { brands, subcategories } (full lists, no pagination)
      const filtersData = await productService.getBrandsAndSubcategories();
      if (filtersData?.subcategories?.length > 0) {
        const norm = (c) => ({
          id: c.id,
          title: c.title ?? c.name,
          name: c.title ?? c.name,
          productCount: c.productCount ?? c.count ?? c.product_count ?? c.productsCount ?? c.totalProducts ?? c.total_products ?? 0,
          parentId: c.parentId ?? c.categoryId ?? null,
          children: [],
        });
        const result = filtersData.subcategories.map((s) => norm(s));
        // Sort by product count descending (most products at top)
        result.sort((a, b) => (Number(b.productCount) || 0) - (Number(a.productCount) || 0));
        console.log('[Categories] From /filters/brands-and-subcategories:', { totalSubcategories: result.length });
        const out = { data: result };
        productService._categoriesCache = out;
        productService._categoriesCacheTime = Date.now();
        return out;
      }

      // Fetch ALL category pages and merge so we get all 15k+ subcategories in one load (sidebar gets full list)
      const LIMIT = 1000; // backend max
      const paginatedUrl = API_ENDPOINTS.categories.getAllWithSubcategoriesPaginated;
      try {
        const url = API_ENDPOINTS.categories.getAllWithSubcategoriesFull || API_ENDPOINTS.categories.getAllWithSubcategories;
        const res = await apiService.get(url);
        let cats = productService._extractList(res);
        const totalPages = res?.pagination?.pages ?? res?.pages ?? 1;

        // If backend returned pagination and more pages, fetch every page and merge into one list
        if (totalPages > 1 && typeof paginatedUrl === 'function') {
          for (let page = 2; page <= totalPages; page++) {
            const nextRes = await apiService.get(paginatedUrl(page, LIMIT));
            const nextList = productService._extractList(nextRes);
            if (nextList.length) cats = [...(cats || []), ...nextList];
          }
        }

        // Backend: each category in data includes subcategories array (id, title, parentId)
        list = cats?.length ? cats : [];
        if (list.length === 0 && res?.subcategories && Array.isArray(res.subcategories)) {
          const parentCats = productService._extractList({ categories: res.categories ?? res.data });
          const subs = res.subcategories;
          const byId = new Map((parentCats || []).map((c) => [c.id, { ...norm(c), parentId: null, children: [] }]));
          (subs || []).forEach((s) => {
            const parentId = s.parentId ?? s.categoryId ?? null;
            if (parentId != null && byId.has(parentId)) byId.get(parentId).children.push({ ...norm(s), parentId, children: [] });
          });
          list = Array.from(byId.values());
        }
      } catch (_e) {}
      // Fallback: GET /api/categories (all in one, no pagination)
      if (list.length === 0) {
        try {
          const res = await apiService.get(API_ENDPOINTS.categories.getAll);
          const cats = productService._extractList(res);
          list = (cats || []).map((c) => ({ ...norm(c), parentId: null, children: [] }));
        } catch (_e) {}
      }
      // 3) Last resort: build from product pages – sample many pages so 15k+ products → more subcategories/brands
      const hasAnySubs = list.some((c) => (c.children || []).length > 0);
      if (list.length === 0 || !hasAnySubs) {
        try {
          const extractListProd = (r) => {
            if (!r) return [];
            if (Array.isArray(r?.data)) return r.data;
            if (Array.isArray(r)) return r;
            return [];
          };
          const productPagesToFetch = 80; // 80 × 100 = 8000 products from 15k+ to get more unique subcategories
          const CHUNK = 10;
          const products = [];
          for (let chunkStart = 1; chunkStart <= productPagesToFetch; chunkStart += CHUNK) {
            const pageNumbers = Array.from({ length: CHUNK }, (_, i) => chunkStart + i).filter((p) => p <= productPagesToFetch);
            const chunks = await Promise.all(
              pageNumbers.map((page) => apiService.get(`/products?page=${page}&limit=100`).then(extractListProd).catch(() => []))
            );
            chunks.forEach((c) => products.push(...c));
          }
          const byId = new Map();
          products.forEach((p) => {
            const parentCat = p.category;
            const parentId = parentCat?.id ?? p.categoryId ?? null;
            const parentTitle = parentCat?.title ?? p.categoryTitle ?? p.categoryName ?? (typeof p.category === 'string' ? p.category : 'General');
            if (parentId != null && parentTitle != null) {
              const pk = String(parentId);
              if (!byId.has(pk)) byId.set(pk, { id: parentId, title: parentTitle, name: parentTitle, productCount: 0, parentId: null, children: [] });
              byId.get(pk).productCount += 1;
            }
            const sub = p.subCategory;
            if (sub?.id != null) {
              const sk = String(sub.id);
              const subParentId = sub.parentId ?? parentId ?? null;
              if (!byId.has(sk)) {
                byId.set(sk, {
                  id: sub.id,
                  title: sub.title,
                  name: sub.title,
                  productCount: 0,
                  parentId: subParentId,
                  children: [],
                });
              }
              byId.get(sk).productCount += 1;
            }
          });
          const allItems = Array.from(byId.values());
          const parents = allItems.filter((c) => c.parentId == null);
          const subs = allItems.filter((c) => c.parentId != null);
          parents.forEach((par) => {
            par.children = subs.filter((s) => s.parentId === par.id).map((s) => ({ ...s, children: [] }));
          });
          list = parents.length > 0 ? parents : allItems;
          console.log('[Categories] Built from products fallback:', { productsSampled: products.length, totalSubcategories: subs.length });
        } catch (_e3) {}
      }
      // Normalize: same shape for children (from API subcategories or our built tree)
      const mapChild = (ch, parentId) => ({
        id: ch.id,
        title: ch.title ?? ch.name,
        name: ch.title ?? ch.name,
        productCount: ch.productCount ?? ch.count ?? 0,
        parentId: ch.parentId ?? parentId,
        children: [],
      });
      let normalized = list.map((c) => {
        const rawChildren = Array.isArray(c.children) ? c.children : (c.subcategories ?? []);
        return {
          id: c.id,
          title: c.title ?? c.name,
          name: c.title ?? c.name,
          productCount: c.productCount ?? c.count ?? 0,
          parentId: c.parentId ?? null,
          children: rawChildren.map((ch) => mapChild(ch, c.id)),
        };
      });
      const hasParentId = normalized.some((c) => c.parentId != null);
      if (hasParentId && normalized.every((c) => Array.isArray(c.children) && c.children.length === 0)) {
        const byId = new Map(normalized.map((c) => [c.id, { ...c, children: [] }]));
        normalized.forEach((c) => {
          if (c.parentId != null && byId.has(c.parentId)) {
            byId.get(c.parentId).children.push(c);
          }
        });
        normalized = normalized.filter((c) => c.parentId == null);
      }
      // Sidebar: show only subcategories (e.g. Computer Monitors), never parents like General
      const generalTitle = (c) => String((c?.name ?? c?.title ?? '')).toLowerCase().trim();
      const allSubcategories = normalized.flatMap((parent) => (parent.children || []).map((ch) => ({ ...ch, children: [] })));
      let result = allSubcategories.length > 0
        ? allSubcategories
        : normalized.filter((c) => generalTitle(c) !== 'general');
      // Sort by product count descending (most products at top)
      result = [...result].sort((a, b) => (Number(b.productCount) || 0) - (Number(a.productCount) || 0));
      const totalCategories = normalized.length;
      const totalSubcategories = allSubcategories.length;
      console.log('[Categories] Loaded:', { totalCategories, totalSubcategories, sidebarShowing: result.length });
      const out = { data: result };
      productService._categoriesCache = out;
      productService._categoriesCacheTime = Date.now();
      return out;
    } catch (error) {
      throw error;
    }
  },

  // Get all products with pagination. Backend supports subCategoryId/subcategory_id, categoryId, brandId for filtering.
  getAllProducts: async (params = {}) => {
    const page = params.page || 1;
    const limit = params.limit ?? 20;
    const { page: _p, limit: _l, sort, categoryId, subCategoryId, subCategoryName, categoryName, brands, brandIds, brandNames, ...rest } = params;

    const extractList = (resp) => {
      if (!resp) return [];
      if (Array.isArray(resp)) return resp;
      if (Array.isArray(resp.data)) return resp.data;
      if (resp.success === true && Array.isArray(resp.data)) return resp.data;
      if (Array.isArray(resp.products)) return resp.products;
      if (Array.isArray(resp.result)) return resp.result;
      if (resp.result?.data && Array.isArray(resp.result.data)) return resp.result.data;
      if (typeof resp === 'object') {
        return Object.values(resp).filter((item) => item && typeof item === 'object' && item.id);
      }
      return [];
    };

    // Build URL with explicit params. Backend should filter by (subCategoryId = id OR categoryId = id) so that both subcategory and parent-category clicks work.
    const buildProductsUrl = (path, opts = {}) => {
      const p = new URLSearchParams();
      p.set('page', opts.page ?? page);
      p.set('limit', opts.limit ?? limit);
      if (opts.sort != null && opts.sort !== '') p.set('sort', opts.sort);
      if (opts.sort == null && sort != null && sort !== '') p.set('sort', sort);
      const catId = opts.categoryId ?? categoryId;
      const subId = opts.subCategoryId ?? subCategoryId;
      const categoryFilterId = catId != null && catId !== '' ? catId : subId;
      if (categoryFilterId != null && categoryFilterId !== '') {
        const idStr = String(categoryFilterId);
        p.set('categoryId', idStr);
        p.set('category_id', idStr);
        p.set('subCategoryId', idStr);
        p.set('subcategoryId', idStr);
        p.set('subcategory_id', idStr);
      }
      const subName = opts.subCategoryName ?? subCategoryName;
      if (subName != null && String(subName).trim() !== '') {
        p.set('subCategoryName', String(subName).trim());
        p.set('category', String(subName).trim());
      }
      const ids = opts.brandIds ?? brandIds;
      const names = opts.brandNames ?? brandNames;
      if (Array.isArray(ids) && ids.length > 0) {
        ids.forEach((id) => {
          const s = String(id);
          p.append('brandId', s);
          p.append('brand_id', s);
        });
        if (names != null && String(names).trim() !== '') {
          p.set('brands', String(names).trim());
          p.set('brand', String(names).trim());
        }
      } else if (opts.brands != null && String(opts.brands).trim() !== '') {
        const b = String(opts.brands).trim();
        p.set('brands', b);
        p.set('brand', b);
      } else if (brands != null && String(brands).trim() !== '') {
        const b = String(brands).trim();
        p.set('brands', b);
        p.set('brand', b);
      }
      const qs = p.toString();
      return qs ? `${path}?${qs}` : path;
    };

    const hasFilterParams = categoryId != null || subCategoryId != null || (Array.isArray(brandIds) && brandIds.length > 0) || (brands != null && String(brands).trim() !== '');

    // Use GET /api/products with query params (subCategoryId, brandId, etc.). Backend does not have GET /api/products/subcategory/:id (returns 404).
    const url = buildProductsUrl(API_ENDPOINTS.products.getAll);

    // 1) GET /api/products with pagination and filters (subCategoryId, brandId, etc.)
    try {
      const resp = await apiService.get(url);
      let list = extractList(resp);
      let pag = resp?.pagination;
      // When category or brand filter is on, do NOT replace with unfiltered list – show only filtered products (or empty).
      const hasBrandFilter = (Array.isArray(brandIds) && brandIds.length > 0) || (brands != null && String(brands).trim() !== '');
      const skipUnfilteredFallback =
        (subCategoryId != null && subCategoryId !== '') ||
        (categoryId != null && categoryId !== '') ||
        hasBrandFilter;
      if (hasFilterParams && !skipUnfilteredFallback && (!list || list.length === 0)) {
        const fallbackQs = new URLSearchParams({ page, limit });
        if (sort != null && sort !== '') fallbackQs.set('sort', sort);
        const urlNoFilter = `${API_ENDPOINTS.products.getAll}?${fallbackQs.toString()}`;
        const respFallback = await apiService.get(urlNoFilter);
        list = extractList(respFallback);
        pag = respFallback?.pagination;
      }
      const total = pag?.total ?? resp?.total ?? list?.length ?? 0;
      const pages = pag?.pages ?? (total > 0 && limit > 0 ? Math.ceil(total / limit) : 1);
      return {
        data: Array.isArray(list) ? mapProducts(list) : [],
        pagination: {
          page: pag?.page ?? page,
          limit: pag?.limit ?? limit,
          total,
          totalPages: pages,
          pages,
        },
        ...(resp?.appliedFilter && { appliedFilter: resp.appliedFilter }),
      };
    } catch (primaryErr) {
      // 2) Fallback: /products/imports when /products fails (e.g. 500)
      try {
        const importsQuery = { page, limit, status: 'completed' };
        if (sort != null && sort !== '') importsQuery.sort = sort;
        const importsUrl = `${'/products/imports'}?${new URLSearchParams(importsQuery).toString()}`;
        let productsResp = await apiService.get(importsUrl);
        let productsList = extractList(productsResp);
        if (!productsList?.length) {
          const fallbackImports = { page, limit };
          if (sort != null && sort !== '') fallbackImports.sort = sort;
          productsResp = await apiService.get(`/products/imports?${new URLSearchParams(fallbackImports).toString()}`);
          productsList = extractList(productsResp);
        }
        const mappedProducts = Array.isArray(productsList) ? mapProducts(productsList) : [];
        const total = productsResp?.pagination?.total ?? productsResp?.total ?? productsResp?.pagination?.totalCount ?? mappedProducts.length;
        const totalPages = (productsResp?.pagination?.pages ?? Math.ceil(total / limit)) || 1;
        return {
          data: mappedProducts,
          pagination: { page, limit, total, totalPages, pages: totalPages },
        };
      } catch (_e) {
        throw primaryErr;
      }
    }
  },

  /**
   * Get products filtered by subcategory. Uses GET /api/products?subCategoryId=... (backend does not have /api/products/subcategory/:id).
   */
  getProductsBySubcategory: async (subcategoryId, params = {}) => {
    return productService.getAllProducts({
      ...params,
      subCategoryId: subcategoryId,
    });
  },

  // Get single product by ID
  // Pehle GET /api/products/:id try karo; agar 404 to GET /api/products?id=X. Page 2 ke products ke liye ?id= sirf page 1 return karta hai.
  getProductById: async (id) => {
    const extractProduct = (response) => {
      if (!response) return null;
      if (Array.isArray(response)) return response.find(p => p.id == id) ?? null;
      if (response.data && Array.isArray(response.data)) return response.data.find(p => p.id == id) ?? null;
      if (response.data?.product) return response.data.product;
      if (response.data) return response.data;
      if (response.id) return response;
      if (response.product) return response.product;
      return null;
    };

    const pathUrl = API_ENDPOINTS.products.getByIdPath?.(id) ?? `/products/${id}`;
    try {
      const pathResponse = await apiService.get(pathUrl);
      const product = extractProduct(pathResponse);
      if (product) return { data: mapProduct(product) };
    } catch (pathErr) {
      if (pathErr?.response?.status !== 404) throw pathErr;
    }

    try {
      const response = await apiService.get(API_ENDPOINTS.products.getById(id));
      const product = extractProduct(response);
      return { data: product ? mapProduct(product) : null };
    } catch (error) {
      throw error;
    }
  },

  // Search products
  searchProducts: async (searchTerm, filters = {}) => {
    try {
      const params = { q: searchTerm, ...filters };
      const queryString = new URLSearchParams(params).toString();
      return await apiService.get(`${API_ENDPOINTS.products.search}?${queryString}`);
    } catch (error) {
      throw error;
    }
  },

  // Filter products
  filterProducts: async (filters) => {
    try {
      return await apiService.post(API_ENDPOINTS.products.filter, filters);
    } catch (error) {
      throw error;
    }
  },

  // Get product categories
  getCategories: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.products.categories);
    } catch (error) {
      throw error;
    }
  },

  // Get all brands for sidebar. Prefer GET /api/filters/brands-and-subcategories (full list, no pagination).
  getAllBrands: async () => {
    const extractList = (r) => {
      if (!r) return [];
      if (Array.isArray(r?.data)) return r.data;
      if (Array.isArray(r)) return r;
      return [];
    };
    const countFrom = (b) => Number(
      b.productCount ?? b.count ?? b.product_count ?? b.productsCount ?? b.total ?? b.totalProducts ?? b.total_products ?? 0
    ) || 0;
    // Only hide 0-count brands when we have at least one brand with count > 0 (so API sends counts). Else show all brands.
    const filterByCount = (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return arr;
      const hasAnyCount = arr.some((b) => (Number(b.count) || 0) > 0);
      return hasAnyCount ? arr.filter((b) => (Number(b.count) || 0) > 0) : arr;
    };
    // Sort brands: HP first, then Dell, then rest by count descending (zyada count wale top pe)
    const sortBrandsHPFirst = (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return arr;
      const isHP = (n) => /^hp\b/i.test(n) || n.toLowerCase() === 'hp';
      const isDell = (n) => /^dell\b/i.test(n) || n.toLowerCase() === 'dell';
      return [...arr].sort((a, b) => {
        const nameA = String(a.name ?? a.title ?? '').trim();
        const nameB = String(b.name ?? b.title ?? '').trim();
        const countA = Number(a.count) || 0;
        const countB = Number(b.count) || 0;
        const priority = (n) => (isHP(n) ? 0 : isDell(n) ? 1 : 2); // HP=0, Dell=1, rest=2
        const pA = priority(nameA);
        const pB = priority(nameB);
        if (pA !== pB) return pA - pB;
        return countB - countA; // same group: higher count first
      });
    };
    try {
      const filtersData = await productService.getBrandsAndSubcategories();
      if (filtersData?.brands?.length > 0) {
        const brands = filtersData.brands.map((b) => ({
          id: b.id,
          name: b.title ?? b.name ?? b.brandTitle ?? String(b.id ?? ''),
          count: countFrom(b),
        })).filter((b) => b.name);
        const filtered = filterByCount(brands);
        return { data: sortBrandsHPFirst(filtered), total: filtered.length };
      }
    } catch (_e) {}
    try {
      if (API_ENDPOINTS.brands?.getAll) {
        const res = await apiService.get(API_ENDPOINTS.brands.getAll);
        const list = extractList(res);
        if (list.length > 0) {
          const brands = list.map((b) => ({
            id: b.id,
            name: b.title ?? b.name ?? b.brandTitle ?? String(b.id ?? ''),
            count: countFrom(b),
          })).filter((b) => b.name);
          const filtered = filterByCount(brands);
          const hasAnyCount = filtered.some((b) => b.count > 0);
          if (hasAnyCount) {
            return { data: sortBrandsHPFirst(filtered.sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0))) };
          }
          return { data: sortBrandsHPFirst(filtered) };
        }
      }
    } catch (_e) {}
    // Fallback: build from product pages so 15k+ products → full brand list (sample many pages)
    const brandMap = new Map();
    const extractListProd = (r) => {
      if (!r) return [];
      if (Array.isArray(r?.data)) return r.data;
      if (Array.isArray(r)) return r;
      return [];
    };
    const BRAND_PAGES = 80; // 80 × 100 = 8000 products to get more unique brands
    const CHUNK = 10;
    for (let chunkStart = 1; chunkStart <= BRAND_PAGES; chunkStart += CHUNK) {
      const pageNumbers = Array.from({ length: CHUNK }, (_, i) => chunkStart + i).filter((p) => p <= BRAND_PAGES);
      const chunks = await Promise.all(
        pageNumbers.map((page) => apiService.get(`/products?page=${page}&limit=100`).then(extractListProd).catch(() => []))
      );
      chunks.flat().forEach((p) => {
        const name = p.brand?.title ?? p.brandTitle ?? p.brandName ?? (typeof p.brand === 'string' ? p.brand : null) ?? 'Unknown';
        const n = String(name);
        if (n) brandMap.set(n, (brandMap.get(n) || 0) + 1);
      });
    }
    const data = Array.from(brandMap.entries()).map(([name, count], i) => ({ id: name || `brand-${i}`, name, count: Number(count) }));
    const filtered = filterByCount(data);
    const byCount = filtered.sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0));
    console.log('[Brands] Built from products fallback:', { totalBrands: byCount.length });
    return { data: sortBrandsHPFirst(byCount) };
  },

  getCategoriesCount: async () => {
    try {
      const res = await apiService.get(API_ENDPOINTS.categories.getCount);
      return { count: res?.count ?? res?.data?.count ?? 0 };
    } catch (_e) { return { count: 0 }; }
  },
  getBrandsCount: async () => {
    try {
      const res = await apiService.get(API_ENDPOINTS.brands.getCount);
      return { count: res?.count ?? res?.data?.count ?? 0 };
    } catch (_e) { return { count: 0 }; }
  },
  getProductsCount: async () => {
    try {
      const res = await apiService.get(API_ENDPOINTS.products.getCount);
      return { total: Number(res?.total ?? res?.data?.total ?? 0) || 0, pages: res?.pages, per_page: res?.per_page };
    } catch (_e) { return { total: 0 }; }
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    try {
      return await apiService.get(API_ENDPOINTS.reviews.getByProduct(productId));
    } catch (error) {
      throw error;
    }
  },
};

export default productService;


