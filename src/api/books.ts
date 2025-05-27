import axios from "axios";
import type { Book } from "../types/book";

const KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;
const BASE = "https://www.googleapis.com/books/v1/volumes";

// This stays outside the function
export interface BookDetails extends Book {
  description?: string;
  pageCount?: number;
  categories?: string[];
  previewLink?: string;
}

// Also stays outside
export async function getBook(id: string): Promise<BookDetails | null> {
  try {
    const { data } = await axios.get(`${BASE}/${id}`, {
      params: { key: KEY },
    });
    const v = data.volumeInfo;
    return {
      id,
      title: v.title,
      authors: v.authors ?? [],
      thumbnail: v.imageLinks?.thumbnail ?? "",
      description: v.description,
      pageCount: v.pageCount,
      categories: v.categories,
      previewLink: v.previewLink,
    };
  } catch {
    return null;
  }
}

// This is your original searchBooks function
export async function searchBooks(q: string): Promise<Book[]> {
  const { data } = await axios.get(BASE, {
    params: { q, key: KEY, maxResults: 20 },
  });

  return (
    data.items?.map((v: any) => ({
      id: v.id,
      title: v.volumeInfo.title,
      authors: v.volumeInfo.authors ?? [],
      thumbnail: v.volumeInfo.imageLinks?.thumbnail ?? "",
    })) ?? []
  );
}
