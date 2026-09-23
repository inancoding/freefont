import type { LicenseType } from './common.js';

export interface License {
  id: string;
  name: string;
  nameEn: string | null;
  nameZh: string | null;
  type: LicenseType;
  url: string | null;
  summary: string | null;
  permissions: string[];
  limitations: string[];
}
