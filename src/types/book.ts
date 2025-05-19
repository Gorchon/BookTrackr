export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  rating?: number; // user-added
  review?: string; // user-added
}
