import { useEffect, useState } from "react";
import { searchBooks } from "../api/books";
import type { Book } from "../types/book";
import BookCard from "../components/BookCard";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  // Grab a default list (feel free to change the query)
  useEffect(() => {
    (async () => {
      const trending = await searchBooks("best seller fiction");
      setBooks(trending);
    })();
  }, []);

  return (
    <section>
      <h2>Trending Books</h2>
      <div className="grid">
        {books.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </section>
  );
}
