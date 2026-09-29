export const CATEGORIES = ['黑体', '宋体', '楷体', '圆体', '手写体', '书法体', '卡通体', '复古体', '创意体', '英文'] as const;
export type Category = typeof CATEGORIES[number];

export const LANGUAGES = ['简体中文', '繁体中文', '英文', '日文', '韩文'] as const;
export type Language = typeof LANGUAGES[number];

export const LICENSE_TYPES = ['open-source', 'vendor', 'custom'] as const;
export type LicenseType = typeof LICENSE_TYPES[number];

export const SORT_OPTIONS = ['added_at', 'download_count', 'name'] as const;
export type SortOption = typeof SORT_OPTIONS[number];

export const ORDER_OPTIONS = ['asc', 'desc'] as const;
export type OrderOption = typeof ORDER_OPTIONS[number];
