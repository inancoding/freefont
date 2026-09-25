export interface Banner {
  id: number;
  title: string;
  description: string | null;
  imagePath: string;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface BannerFormData {
  title: string;
  description?: string;
  imagePath: string;
  linkUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}
