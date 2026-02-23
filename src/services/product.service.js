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

  // Get all categories with subcategories (for sidebar). Prefer /categories/list + /subcategories/list so subcategories show.
  getAllCategories: async () => {
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
      // 1) Prefer GET /categories/list + GET /subcategories/list (so we get subcategories like "Computer Monitors")
      if (API_ENDPOINTS.categories?.list && API_ENDPOINTS.subcategories?.list) {
        try {
          const [catRes, subRes] = await Promise.all([
            apiService.get(API_ENDPOINTS.categories.list),
            apiService.get(API_ENDPOINTS.subcategories.list),
          ]);
          const cats = extractList(catRes);
          const subs = extractList(subRes);
          if (cats.length > 0 || subs.length > 0) {
            const byId = new Map((cats || []).map((c) => [c.id, { ...norm(c), parentId: null, children: [] }]));
            (subs || []).forEach((s) => {
              const parentId = s.categoryId ?? s.parentId ?? s.category_id ?? s.parent_id ?? null;
              const child = { ...norm(s), parentId, children: [] };
              if (parentId != null && byId.has(parentId)) {
                byId.get(parentId).children.push(child);
              } else {
                byId.set(s.id, { ...child, children: [] });
              }
            });
            list = Array.from(byId.values());
          }
        } catch (_e) {}
      }
      // 2) Try GET /categories?includeSubcategories=true (may have nested subcategories)
      if (list.length === 0) {
        try {
          const res = await apiService.get(API_ENDPOINTS.categories.getAllWithSubcategories);
          list = productService._extractList(res);
          if (list.length === 0 && res?.subcategories && Array.isArray(res.subcategories)) {
            const cats = productService._extractList({ categories: res.categories ?? res.data });
            const subs = res.subcategories;
            const byId = new Map((cats || []).map((c) => [c.id, { ...norm(c), parentId: null, children: [] }]));
            (subs || []).forEach((s) => {
              const parentId = s.parentId ?? s.categoryId ?? null;
              if (parentId != null && byId.has(parentId)) byId.get(parentId).children.push({ ...norm(s), parentId, children: [] });
            });
            list = Array.from(byId.values());
          }
        } catch (_e) {}
      }
      // 3) Fallback: GET /categories only – then try to attach subcategories from GET /subcategories/list
      if (list.length === 0 || list.every((c) => (c.children || []).length === 0)) {
        try {
          const res = await apiService.get(API_ENDPOINTS.categories.getAll);
          const cats = productService._extractList(res);
          if (cats.length > 0 && API_ENDPOINTS.subcategories?.list) {
            try {
              const subRes = await apiService.get(API_ENDPOINTS.subcategories.list);
              const subs = extractList(subRes);
              const byId = new Map(cats.map((c) => [c.id, { ...norm(c), parentId: null, children: [] }]));
              subs.forEach((s) => {
                const parentId = s.categoryId ?? s.parentId ?? null;
                if (parentId != null && byId.has(parentId)) byId.get(parentId).children.push({ ...norm(s), parentId, children: [] });
              });
              list = Array.from(byId.values());
            } catch (_e2) {}
          }
          if (list.length === 0) list = cats.map((c) => ({ ...norm(c), parentId: null, children: [] }));
        } catch (_e) {}
      }
      // 4) If no list or no subcategories yet, build from products (parent + subCategory from each product)
      const hasAnySubs = list.some((c) => (c.children || []).length > 0);
      if (list.length === 0 || !hasAnySubs) {
        try {
          const extractListProd = (r) => {
            if (!r) return [];
            if (Array.isArray(r?.data)) return r.data;
            if (Array.isArray(r)) return r;
            return [];
          };
          const pages = await Promise.all([1, 2, 3, 4, 5].map((page) =>
            apiService.get(`/products?page=${page}&limit=100`).then(extractListProd).catch(() => [])
          ));
          const products = pages.flat();
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
      const result = allSubcategories.length > 0
        ? allSubcategories
        : normalized.filter((c) => generalTitle(c) !== 'general');
      return { data: result };
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

  // Get all brands for sidebar with correct product count (use GET /brands if counts present, else build from products)
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
            return { data: brands.sort((a, b) => a.name.localeCompare(b.name)) };
          }
        }
      }
    } catch (_e) {}
    // Fallback: build from product pages so count = actual number of products per brand
    const brandMap = new Map();
    for (let page = 1; page <= 5; page++) {
      try {
        const resp = await apiService.get(`/products?page=${page}&limit=100`);
        const list = extractList(resp);
        list.forEach((p) => {
          const name = p.brand?.title ?? p.brandTitle ?? p.brandName ?? (typeof p.brand === 'string' ? p.brand : null) ?? 'Unknown';
          const n = String(name);
          brandMap.set(n, (brandMap.get(n) || 0) + 1);
        });
      } catch (_err) { break; }
    }
    const data = Array.from(brandMap.entries()).map(([name, count]) => ({ name, count: Number(count) })).sort((a, b) => a.name.localeCompare(b.name));
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


