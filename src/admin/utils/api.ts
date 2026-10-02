const API_BASE = '/api';
let token: string | null = localStorage.getItem('admin_token');

export function setToken(t: string | null) {
  token = t;
  if (t) localStorage.setItem('admin_token', t);
  else localStorage.removeItem('admin_token');
}

export function getToken() {
  return token;
}

export function isTokenExpired(): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return true;
    const payload = JSON.parse(atob(parts[1]!));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

async function handleUnauthorized(res: Response) {
  if (res.status === 401) {
    setToken(null);
    window.location.href = '/admin/login';
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!res.ok) {
    await handleUnauthorized(res);
    const json = await res.json() as { error?: string };
    throw new Error(json.error || 'Request failed');
  }
  const json = await res.json() as { data: T };
  return json.data;
}

async function upload<T>(url: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${url}`, { method: 'POST', headers, body: formData });
  if (!res.ok) {
    await handleUnauthorized(res);
    const json = await res.json() as { error?: string };
    throw new Error(json.error || 'Upload failed');
  }
  const json = await res.json() as { data: T };
  return json.data;
}

export const adminApi = {
  login: (username: string, password: string) =>
    request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getFonts: (page = 1, pageSize = 50) =>
    request<{ data: import('@shared/types/index.ts').FontListItem[]; total: number }>(`/admin/fonts?page=${page}&pageSize=${pageSize}`),

  getFont: (slug: string) => request<import('@shared/types/index.ts').Font>(`/admin/fonts/${slug}`),

  createFont: (data: import('@shared/types/index.ts').FontFormData) =>
    request<import('@shared/types/index.ts').Font>('/admin/fonts', { method: 'POST', body: JSON.stringify(data) }),

  updateFont: (slug: string, data: Partial<import('@shared/types/index.ts').FontFormData>) =>
    request<import('@shared/types/index.ts').Font>(`/admin/fonts/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteFont: (slug: string) => request<{ deleted: boolean }>(`/admin/fonts/${slug}`, { method: 'DELETE' }),

  getLicenses: (page = 1, pageSize = 20) =>
    request<{ data: import('@shared/types/index.ts').License[]; total: number }>(`/admin/licenses?page=${page}&pageSize=${pageSize}`),

  createLicense: (data: import('@shared/types/index.ts').License) =>
    request<import('@shared/types/index.ts').License>('/admin/licenses', { method: 'POST', body: JSON.stringify(data) }),

  updateLicense: (id: string, data: Partial<import('@shared/types/index.ts').License>) =>
    request<import('@shared/types/index.ts').License>(`/admin/licenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  uploadImage: (file: File, subfolder?: string) => {
    const fd = new FormData();
    if (subfolder) fd.append('subfolder', subfolder);
    fd.append('file', file);
    return upload<import('@shared/types/index.ts').UploadImageResponse>('/admin/upload/image', fd);
  },

  fetchImage: (url: string, subfolder?: string) => {
    return request<import('@shared/types/index.ts').UploadImageResponse>('/admin/upload/fetch-image', {
      method: 'POST',
      body: JSON.stringify({ url, subfolder }),
    });
  },

  uploadZip: (file: File, slug: string, version: string) => {
    const fd = new FormData();
    fd.append('slug', slug);
    fd.append('version', version);
    fd.append('file', file);
    return upload<import('@shared/types/index.ts').UploadZipResponse>('/admin/upload/zip', fd);
  },

  getBanners: (page = 1, pageSize = 20) =>
    request<{ data: import('@shared/types/index.ts').Banner[]; total: number }>(`/admin/banners?page=${page}&pageSize=${pageSize}`),

  createBanner: (data: import('@shared/types/index.ts').BannerFormData) =>
    request<import('@shared/types/index.ts').Banner>('/admin/banners', { method: 'POST', body: JSON.stringify(data) }),

  updateBanner: (id: number, data: Partial<import('@shared/types/index.ts').BannerFormData>) =>
    request<import('@shared/types/index.ts').Banner>(`/admin/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteBanner: (id: number) =>
    request<{ deleted: boolean }>(`/admin/banners/${id}`, { method: 'DELETE' }),

  getResources: () =>
    request<Array<{ path: string; url: string; folder: string; filename: string; size: number; modifiedAt: string }>>('/admin/resources'),

  getUnusedResources: () =>
    request<Array<{ path: string; url: string; folder: string; filename: string; size: number; modifiedAt: string }>>('/admin/resources/unused'),

  deleteUnusedResources: () =>
    request<{ deleted: number; total: number }>('/admin/resources/unused', { method: 'DELETE' }),

  deleteResource: (folder: string, filename: string) =>
    request<{ deleted: boolean }>(`/admin/resources/${folder}/${filename}`, { method: 'DELETE' }),
};
