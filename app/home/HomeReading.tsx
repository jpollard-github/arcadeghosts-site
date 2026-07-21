import { BookCard } from "../BookCard";
import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import { readingBooks } from "../site-data";

export const readingPreviewTitles = [
  "Way of the Peaceful Warrior",
  "Misery",
  "Grover and the Everything in the Whole Wide World Museum",
  "The Book of Adventure Games",
  "Being and Nothingness",
] as const;

const readingPreviewBooks = readingPreviewTitles
  .map((title) => readingBooks.find((book) => book.title === title))
  .filter((book) => book !== undefined);

export function HomeReading() {
  return (
    <section className="content-section reading-section">
      <SectionHeading
        id="reading"
        eyebrow="Reading"
        title="A few books still rustling in the stacks."
      >
        Novels, philosophy, psychology, old reference books, and peculiar manuals that left a mark.
      </SectionHeading>
      <div className="feed-links" aria-label="Reading room links">
        <TrackedLink
          className="feed-link"
          href="/reading"
          trackingEvent="Reading Link Clicked"
          trackingProperties={{ destination: "/reading", source: "homepage-feed-links" }}
        >
          Visit Reading Room
        </TrackedLink>
      </div>
      <div className="reading-grid reading-preview" aria-label="Reading preview">
        {readingPreviewBooks.map((book, index) => (
          <BookCard
            book={book}
            key={`${book.author}-${book.title}`}
            priority={index < 3}
            sizes="(max-width: 560px) 50vw, (max-width: 860px) 33vw, (max-width: 1100px) 25vw, 20vw"
          />
        ))}
      </div>
    </section>
  );
}
