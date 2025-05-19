import axios from "axios";
import type { Book } from "../types/book";

const KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;
const BASE = "https://www.googleapis.com/books/v1/volumes";

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
