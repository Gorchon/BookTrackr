import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBook } from "../api/books";
import type { BookDetails } from "../api/books";
import "./BookDetails.css";

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetails | null>(null);

  useEffect(() => {
    if (!id) return;
    getBook(id).then(setBook);
  }, [id]);

  if (!book) return <p style={{ padding: "2rem" }}>Loading…</p>;

  return (
    <section className="details-wrapper">
      <img src={book.thumbnail} alt={book.title} className="cover" />

      <div className="meta">
        <h2>{book.title}</h2>
        <p className="authors">{book.authors.join(", ")}</p>

        <div className="badges">
          {book.pageCount && <span>{book.pageCount} pp</span>}
          {book.categories?.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>

        {book.description && (
          <p
            className="description"
            dangerouslySetInnerHTML={{ __html: book.description }}
          />
        )}

        {book.previewLink && (
          <a
            className="button"
            href={book.previewLink}
            target="_blank"
            rel="noreferrer"
          >
            Preview on Google Books →
          </a>
        )}

        <Link className="back-link" to="..">
          ← Back
        </Link>
      </div>
    </section>
  );
}
