import type { License } from './license.js';

export interface Font {
  id: number;
  slug: string;
  nameZh: string | null;
  nameEn: string | null;
  vendor: string;
  version: string;
  licenseId: string;
  description: string | null;
  content: string | null;
  category: string | null;
  officialUrl: string | null;
  coverPath: string | null;
  previewPath: string | null;
  fileSize: number | null;
  glyphCount: number | null;
  sha256: string | null;
  downloadUrl: string | null;
  cloudDriveUrl: string | null;
  status: 'draft' | 'published';
  addedAt: string;
  updatedAt: string | null;
  downloadCount: number;
  languages: string[];
  formats: string[];
  weights: string[];
  tags: string[];
  license?: License;
}

export type FontListItem = Omit<Font, 'content'>;

export interface FontFormData {
  slug: string;
  nameZh?: string;
  nameEn?: string;
  vendor: string;
  version: string;
  licenseId: string;
  description?: string;
  content?: string;
  category?: string;
  officialUrl?: string;
  coverPath?: string;
  previewPath?: string;
  fileSize?: number;
  glyphCount?: number;
  sha256?: string;
  downloadUrl?: string;
  cloudDriveUrl?: string;
  status?: 'draft' | 'published';
  languages?: string[];
  formats?: string[];
  weights?: string[];
  tags?: string[];
}
