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

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const json = await res.json() as { data: T; error?: string };
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json.data;
}

async function upload<T>(url: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${url}`, { method: 'POST', headers, body: formData });
  const json = await res.json() as { data: T; error?: string };
  if (!res.ok) throw new Error(json.error || 'Upload failed');
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

  getLicenses: () => request<import('@shared/types/index.ts').License[]>('/admin/licenses'),

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

  uploadZip: (file: File, slug: string, version: string) => {
    const fd = new FormData();
    fd.append('slug', slug);
    fd.append('version', version);
    fd.append('file', file);
    return upload<import('@shared/types/index.ts').UploadZipResponse>('/admin/upload/zip', fd);
  },

  getBanners: () =>
    request<import('@shared/types/index.ts').Banner[]>('/admin/banners'),

  createBanner: (data: import('@shared/types/index.ts').BannerFormData) =>
    request<import('@shared/types/index.ts').Banner>('/admin/banners', { method: 'POST', body: JSON.stringify(data) }),

  updateBanner: (id: number, data: Partial<import('@shared/types/index.ts').BannerFormData>) =>
    request<import('@shared/types/index.ts').Banner>(`/admin/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteBanner: (id: number) =>
    request<{ deleted: boolean }>(`/admin/banners/${id}`, { method: 'DELETE' }),
};
