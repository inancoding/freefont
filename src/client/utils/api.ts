const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json() as { data: T; error?: string };
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json.data;
}

export const api = {
  getFonts: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') qs.set(k, String(v));
    }
    return request<{ data: import('@shared/types/index.ts').FontListItem[]; total: number; page: number; pageSize: number }>(
      `/fonts?${qs}`
    );
  },

  getFont: (slug: string) => request<import('@shared/types/index.ts').Font>(`/fonts/${slug}`),

  getDownloadUrls: (slug: string) =>
    request<import('@shared/types/index.ts').DownloadUrls>(`/fonts/${slug}/download-urls`),

  getRecommendFonts: (slug: string) =>
    request<import('@shared/types/index.ts').FontListItem[]>(`/fonts/${slug}/recommend`),

  recordDownload: (slug: string) =>
    request<void>(`/fonts/${slug}/download`, { method: 'POST' }),

  getLicenses: () => request<import('@shared/types/index.ts').License[]>('/licenses'),

  getLicense: (id: string) => request<import('@shared/types/index.ts').License>(`/licenses/${id}`),

  getBanners: () => request<import('@shared/types/index.ts').Banner[]>('/banners'),
};
