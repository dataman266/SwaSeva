// ─── Swaseva API client ───────────────────────────────────────────────────────
// Single source of truth for all backend calls. Handles token lifecycle.

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const KEYS = {
  access:  'swaseva_auth_token',
  refresh: 'swaseva_refresh_token',
  phone:   'swaseva_otp_phone',
} as const;

// ─── Token helpers ────────────────────────────────────────────────────────────

export const auth = {
  getAccess:  ()    => localStorage.getItem(KEYS.access),
  getRefresh: ()    => localStorage.getItem(KEYS.refresh),
  setTokens:  (a: string, r: string) => {
    localStorage.setItem(KEYS.access,  a);
    localStorage.setItem(KEYS.refresh, r);
  },
  clear: () => {
    localStorage.removeItem(KEYS.access);
    localStorage.removeItem(KEYS.refresh);
    localStorage.removeItem(KEYS.phone);
  },
  setPhone:  (p: string) => localStorage.setItem(KEYS.phone, p),
  getPhone:  ()          => localStorage.getItem(KEYS.phone) ?? '',
};

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function req<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = auth.getAccess();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined ?? {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return req<T>(path, options, false);
    auth.clear();
    window.dispatchEvent(new Event('swaseva:unauthenticated'));
    throw new ApiError(401, 'Session expired');
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, body?.message ?? 'Request failed');
  }

  return body as T;
}

async function tryRefresh(): Promise<boolean> {
  const rt = auth.getRefresh();
  if (!rt) return false;
  try {
    const body = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    }).then(r => r.json());
    if (body?.data?.accessToken) {
      auth.setTokens(body.data.accessToken, body.data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// ─── Response envelope types ──────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  message: string;
}

// ─── Domain types (mirror backend) ───────────────────────────────────────────

export interface ApiUser {
  id: string;
  phone: string;
  email?: string;
  name_en?: string;
  name_mr?: string;
  avatarUrl?: string;
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
  roles: Array<{ role: string }>;
  kyc?: { status: string } | null;
}

export interface ApiTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiProduct {
  id: string;
  name_en: string;
  name_mr?: string;
  pricePerUnit: string;
  unit: string;
  quantityAvailable: string;
  district?: string;
  taluka?: string;
  village?: string;
  images: string[];
  status: string;
  viewsCount: number;
  category: { id: string; name_en: string; name_mr?: string; slug: string };
  seller: { id: string; name_en?: string; name_mr?: string; district?: string };
}

export interface ApiMarketPrice {
  id: string;
  commodity_en: string;
  commodity_mr?: string;
  market: string;
  district: string;
  minPrice: string;
  maxPrice: string;
  modalPrice: string;
  unit: string;
  recordedAt: string;
  category: { name_en: string; name_mr?: string };
}

export interface ApiCategory {
  id: string;
  name_en: string;
  name_mr?: string;
  slug: string;
  iconUrl?: string;
  sortOrder: number;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  deliveryAddress?: string;
  deliveryDistrict?: string;
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: string;
    pricePerUnit: string;
    totalPrice: string;
    product: { name_en: string; name_mr?: string; images: string[] };
  }>;
}

export interface ApiCartItem {
  id: string;
  quantity: string;
  product: ApiProduct;
}

export interface ApiUserStats {
  totalListings: number;
  activeListings: number;
  totalOrders: number;
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export const authApi = {
  sendOtp: (phone: string) =>
    req<ApiResponse<{ message: string; otp?: string }>>('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, otp: string) =>
    req<ApiResponse<{ isNewUser: boolean; tokens?: ApiTokens }>>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),

  register: (data: {
    phone: string;
    name_en: string;
    name_mr?: string;
    state?: string;
    district?: string;
    taluka?: string;
    village?: string;
    primaryRole?: string;
  }) =>
    req<ApiResponse<{ user: ApiUser; tokens: ApiTokens }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Products endpoints ───────────────────────────────────────────────────────

export const productsApi = {
  list: (params?: { page?: number; limit?: number; categoryId?: string; district?: string; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page)       qs.set('page',       String(params.page));
    if (params?.limit)      qs.set('limit',      String(params.limit));
    if (params?.categoryId) qs.set('categoryId', params.categoryId);
    if (params?.district)   qs.set('district',   params.district);
    if (params?.search)     qs.set('search',     params.search);
    return req<PaginatedResponse<ApiProduct>>(`/products?${qs}`);
  },

  get: (id: string) =>
    req<ApiResponse<ApiProduct>>(`/products/${id}`),

  create: (data: {
    name_en: string;
    name_mr?: string;
    description_en?: string;
    categoryId: string;
    pricePerUnit: number;
    unit: string;
    quantityAvailable: number;
    district?: string;
    taluka?: string;
    village?: string;
    images?: string[];
  }) =>
    req<ApiResponse<ApiProduct>>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  myListings: (params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page)  qs.set('page',  String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return req<PaginatedResponse<ApiProduct>>(`/products/my-listings?${qs}`);
  },
};

// ─── Categories endpoints ─────────────────────────────────────────────────────

export const categoriesApi = {
  list: () => req<ApiResponse<ApiCategory[]>>('/categories'),
};

// ─── Market prices endpoints ──────────────────────────────────────────────────

export const marketPricesApi = {
  list: (params?: { district?: string; categoryId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.district)   qs.set('district',   params.district);
    if (params?.categoryId) qs.set('categoryId', params.categoryId);
    return req<ApiResponse<ApiMarketPrice[]>>(`/market-prices?${qs}`);
  },
};

// ─── Users endpoints ──────────────────────────────────────────────────────────

export const usersApi = {
  me: () => req<ApiResponse<ApiUser>>('/users/me'),

  stats: () => req<ApiResponse<ApiUserStats>>('/users/me/stats'),

  updateProfile: (data: {
    name_en?: string;
    name_mr?: string;
    state?: string;
    district?: string;
    taluka?: string;
    village?: string;
  }) =>
    req<ApiResponse<ApiUser>>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ─── Orders endpoints ─────────────────────────────────────────────────────────

export const ordersApi = {
  bought: (params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page)  qs.set('page',  String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return req<PaginatedResponse<ApiOrder>>(`/orders/bought?${qs}`);
  },

  sold: (params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page)  qs.set('page',  String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return req<PaginatedResponse<ApiOrder>>(`/orders/sold?${qs}`);
  },

  get: (id: string) => req<ApiResponse<ApiOrder>>(`/orders/${id}`),

  create: (data: {
    items: Array<{ productId: string; quantity: number }>;
    deliveryAddress?: string;
    deliveryDistrict?: string;
    deliveryTaluka?: string;
    notes?: string;
  }) =>
    req<ApiResponse<ApiOrder>>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Cart endpoints ───────────────────────────────────────────────────────────

export const cartApi = {
  get: () => req<ApiResponse<{ items: ApiCartItem[]; total: string }>>('/cart'),

  add: (productId: string, quantity: number) =>
    req<ApiResponse<ApiCartItem>>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  remove: (itemId: string) =>
    req<void>(`/cart/items/${itemId}`, { method: 'DELETE' }),

  clear: () => req<void>('/cart', { method: 'DELETE' }),
};

// ─── Analytics endpoints ──────────────────────────────────────────────────────

export const analyticsApi = {
  seller: () => req<ApiResponse<{
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: string;
    recentOrders: ApiOrder[];
  }>>('/analytics/seller'),

  buyer: () => req<ApiResponse<{
    totalOrders: number;
    pendingOrders: number;
    totalSpent: string;
  }>>('/analytics/buyer'),
};
