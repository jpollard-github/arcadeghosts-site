import type { Metadata } from "next";
import Link from "next/link";
import { BookCard } from "../../BookCard";
import { SectionHeading } from "../../SectionHeading";
import { readingBooks } from "../../site-data";

const description =
  "Books that stayed with Jason Pollard, from novels and philosophy to psychology, reference books, and peculiar manuals.";

export const metadata: Metadata = {
  title: "Reading",
  description,
  alternates: {
    canonical: "/reading",
  },
  openGraph: {
    title: "Reading",
    description,
    url: "/reading",
  },
};

export default function ReadingPage() {
  return (
    <main className="collection-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <Link className="back-link" href="/">
        Back Home
      </Link>
      <section className="content-section reading-section collection-section">
        <SectionHeading eyebrow="Reading" title="Books I keep carrying with me.">
          Not a ranking, syllabus, or complete library. Just books that stayed in the signal.
        </SectionHeading>
        <div className="reading-grid" aria-label="Reading books">
          {readingBooks.map((book, index) => (
            <BookCard
              book={book}
              key={`${book.author}-${book.title}`}
              priority={index < 5}
              sizes="(max-width: 560px) 50vw, (max-width: 860px) 33vw, (max-width: 1100px) 25vw, 20vw"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
