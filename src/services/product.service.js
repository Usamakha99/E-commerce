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
      productCount: c.productCount ?? c.count ?? c.product_count ?? 0,
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
          productCount: c.productCount ?? c.count ?? c.product_count ?? 0,
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

  // Get all products with pagination (20 per page). Uses GET /api/products?page=&limit=20.
  getAllProducts: async (params = {}) => {
    const page = params.page || 1;
    const limit = params.limit ?? 20;
    const { page: _p, limit: _l, ...rest } = params;

    const buildUrl = (path, queryObj) => {
      const qs = new URLSearchParams(queryObj).toString();
      return qs ? `${path}?${qs}` : path;
    };

    const extractList = (resp) => {
      if (!resp) return [];
      if (Array.isArray(resp)) return resp;
      if (Array.isArray(resp.data)) return resp.data;
      if (resp.success === true && Array.isArray(resp.data)) return resp.data;
      if (Array.isArray(resp.result)) return resp.result;
      if (resp.result?.data && Array.isArray(resp.result.data)) return resp.result.data;
      if (typeof resp === 'object') {
        return Object.values(resp).filter((item) => item && typeof item === 'object' && item.id);
      }
      return [];
    };

    // 1) Prefer primary GET /api/products with pagination shape: { success, data, pagination: { page, limit, total, pages } }
    try {
      const resp = await apiService.get(buildUrl(API_ENDPOINTS.products.getAll, { page, limit, ...rest }));
      const list = extractList(resp);
      const pag = resp?.pagination;
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
      };
    } catch (primaryErr) {
      // 2) Fallback: /products/imports when /products fails (e.g. 500)
      try {
        let productsResp = await apiService.get(buildUrl('/products/imports', { status: 'completed', page, limit, ...rest }));
        let productsList = extractList(productsResp);
        if (!productsList?.length) {
          productsResp = await apiService.get(buildUrl('/products/imports', { page, limit }));
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

  // Get single product by ID
  getProductById: async (id) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.products.getById(id));
      
      // Handle null/undefined response
      if (!response) {
        return { data: null };
      }
      
      let product = null;
      
      // Check if response is an array (backend returns all products)
      if (Array.isArray(response)) {
        // Find the specific product by ID
        product = response.find(p => p.id == id);
      } 
      // Check if response.data is an array
      else if (response.data && Array.isArray(response.data)) {
        product = response.data.find(p => p.id == id);
      }
      // Single product in response.data
      else if (response.data) {
        product = response.data;
      } 
      // Direct product object
      else if (response.id) {
        product = response;
      } 
      // Product in response.product
      else if (response.product) {
        product = response.product;
      }
      
      // Map to standardized format
      const mappedProduct = product ? mapProduct(product) : null;
      
      return {
        data: mappedProduct
      };
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
    try {
      const filtersData = await productService.getBrandsAndSubcategories();
      if (filtersData?.brands?.length > 0) {
        const brands = filtersData.brands.map((b) => ({
          id: b.id,
          name: b.title ?? b.name ?? b.brandTitle ?? String(b.id ?? ''),
          count: countFrom(b),
        })).filter((b) => b.name).sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0));
        return { data: brands, total: brands.length };
      }
    } catch (_e) {}
    try {
      if (API_ENDPOINTS.brands?.getAll) {
        const res = await apiService.get(API_ENDPOINTS.brands.getAll);
        const list = extractList(res);
        if (list.length > 0) {
          const brands = list.map((b) => ({
            name: b.title ?? b.name ?? b.brandTitle ?? String(b.id ?? ''),
            count: countFrom(b),
          })).filter((b) => b.name);
          const hasAnyCount = brands.some((b) => b.count > 0);
          if (hasAnyCount) {
            return { data: brands.sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0)) };
          }
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
    const data = Array.from(brandMap.entries()).map(([name, count]) => ({ name, count: Number(count) })).sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0));
    console.log('[Brands] Built from products fallback:', { totalBrands: data.length });
    return { data };
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


