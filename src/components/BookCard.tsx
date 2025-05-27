import { Link } from "react-router-dom";
import type { Book } from "../types/book";
import "./BookCard.css";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link to={`/book/${book.id}`} className="card-link">
      <article className="card">
        <img src={book.thumbnail} alt={book.title} />
        <h3>{book.title}</h3>
        <p>{book.authors.join(", ")}</p>
      </article>
    </Link>
  );
}
