import type { Font, FontListItem } from './font.js';
import type { License } from './license.js';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FontListParams {
  search?: string;
  category?: string;
  language?: string;
  license?: string;
  tag?: string;
  sort?: 'added_at' | 'download_count' | 'name';
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface DownloadUrls {
  githubRaw: string;
  jsdelivr: string;
  cloudDrive?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

export interface UploadImageResponse {
  path: string;
  url: string;
}

export interface UploadZipResponse {
  downloadUrls: DownloadUrls;
  sha256: string;
  fileSize: number;
}

export type { Font, FontListItem, FontListItem as FontList, License };
