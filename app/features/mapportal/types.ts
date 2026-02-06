export interface MapPortalCategory {
  id: number;
  name: string;
}

export interface MapPortalDocument {
  id: number;
  title: string;
  description: string;
  coverImage: string | null;
  province: string;
  amphoe: string;
  district: string;
  latitude: number;
  longitude: number;
  year: number | null;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  category: MapPortalCategory;
}
