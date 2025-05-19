import { useState } from "react";
import { searchBooks } from "../api/books";
import type { Book } from "../types/book";
import BookCard from "../components/BookCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setResults(await searchBooks(query));
  };

  return (
    <section>
      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author..."
        />
        <button>Search</button>
      </form>

      <div className="grid">
        {results.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </section>
  );
}
