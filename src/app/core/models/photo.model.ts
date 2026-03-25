export interface Photo {
  id: number;
  url: string;
  tags: string;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
}

export interface SearchResult {
  photos: Photo[];
  query: string;
  count: number;
}
