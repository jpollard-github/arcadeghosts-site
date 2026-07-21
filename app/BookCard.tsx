import Image from "next/image";
import type { ReadingBook } from "./site-content/reading";

type BookCardProps = {
  book: ReadingBook;
  sizes: string;
  priority?: boolean;
};

export function BookCard({ book, sizes, priority = false }: BookCardProps) {
  const bookLabel = `${book.title} by ${book.author}`;

  return (
    <article className="book-card">
      <a
        className="book-image-link"
        href={book.detailsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`View details for ${bookLabel}`}
      >
        {book.image ? (
          <Image
            src={book.image}
            alt={`${bookLabel} book cover`}
            fill
            priority={priority}
            sizes={sizes}
            className="book-image"
          />
        ) : (
          <span className="book-placeholder" aria-hidden="true">
            <span>{book.title}</span>
            <small>{book.author}</small>
          </span>
        )}
      </a>
      <div className="book-card-copy">
        <div>
          <h3>
            <a href={book.detailsUrl} target="_blank" rel="noreferrer">
              {book.title}
            </a>
          </h3>
          <p className="book-author">{book.author}</p>
        </div>
        {book.image && book.sourceUrl ? (
          <a
            href={book.sourceUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Image source for ${bookLabel}`}
          >
            Image source
          </a>
        ) : null}
      </div>
    </article>
  );
}
