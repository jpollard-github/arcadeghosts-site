import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { readingPreviewTitles } from "../../app/home/HomeReading";
import { readingBooks } from "../../app/site-content/reading";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");

const expectedBooks = [
  ["Dan Millman", "Way of the Peaceful Warrior"],
  ["Ayn Rand", "The Fountainhead"],
  ["Ayn Rand", "Atlas Shrugged"],
  ["Alexandre Dumas", "The Count of Monte Cristo"],
  ["Stephen King", "Misery"],
  ["Reverend Wing F. Fing", "Fuck Yes!"],
  ["Michael Brooks", "Instant Rapport"],
  ["Anthony Robbins", "Unlimited Power"],
  ["Jean Hugard", "Card Manipulations"],
  ["William L. Livingston", "Have Fun at Work"],
  ["Norman Stiles and Daniel Wilcox", "Grover and the Everything in the Whole Wide World Museum"],
  ["Rudy Rucker", "The Fourth Dimension"],
  ["Ayn Rand", "Introduction to Objectivist Epistemology"],
  ["Arthur Schopenhauer", "The World as Will and Representation"],
  ["Don Turnbull (editor)", "Fiend Folio"],
  ["Paula Taylor", "The Kids’ Whole Future Catalog"],
  ["Kim Schuette", "The Book of Adventure Games"],
  ["Joel Whitburn", "Top Pop Albums, 1955–1996"],
  ["Dan Millman", "The Life You Were Born to Live"],
  ["Dr. John Lewis Lund", "How to Hug a Porcupine"],
  ["Allen Newell", "Unified Theories of Cognition"],
  ["Falcon Travis", "The Spy’s Guidebook"],
  ["Henry Miller", "Tropic of Cancer"],
  ["George Orwell", "1984"],
  ["Miguel de Cervantes", "Don Quixote"],
  ["Joseph Heller", "Catch-22"],
  ["Kurt Vonnegut", "Breakfast of Champions"],
  ["Kurt Vonnegut", "Mother Night"],
  ["Judy Blume", "Tiger Eyes"],
  ["Immanuel Kant", "Critique of Pure Reason"],
  ["Jean-Paul Sartre", "Being and Nothingness"],
  ["G. W. F. Hegel", "Science of Logic"],
] as const;

function assertWebUrl(value: string, label: string) {
  const url = new URL(value);
  assert.ok(url.protocol === "http:" || url.protocol === "https:", `${label} must use http or https`);
}

test("reading books preserve the complete curated order", () => {
  assert.equal(readingBooks.length, 32);
  assert.deepEqual(
    readingBooks.map(({ author, title }) => [author, title]),
    expectedBooks,
  );
});

test("reading books use unique pairs, valid links, and sourced local covers", () => {
  const pairs = new Set<string>();
  const images = new Set<string>();
  const forbiddenFields = new Set([
    "classification",
    "dateRead",
    "genre",
    "genres",
    "rating",
    "review",
    "status",
  ]);

  for (const book of readingBooks) {
    const pair = `${book.author}\u0000${book.title}`;
    assert.ok(!pairs.has(pair), `duplicate author/title pair: ${book.author} — ${book.title}`);
    pairs.add(pair);

    assert.ok(book.author.trim(), "author must not be blank");
    assert.ok(book.title.trim(), "title must not be blank");
    assertWebUrl(book.detailsUrl, `${book.title} detailsUrl`);

    if (book.image) {
      assert.ok(!images.has(book.image), `duplicate image: ${book.image}`);
      images.add(book.image);
      assert.ok(book.image.startsWith("/images/reading/"));
      assert.ok(book.image.endsWith(".webp"));
      assert.ok(
        existsSync(path.join(repositoryRoot, "public", book.image)),
        `${book.title} image does not exist beneath public/`,
      );
      assert.ok(book.sourceUrl, `${book.title} must provide a sourceUrl for its image`);
      assertWebUrl(book.sourceUrl, `${book.title} sourceUrl`);
    } else {
      assert.equal(book.sourceUrl, undefined, `${book.title} placeholder must not have a fake sourceUrl`);
    }

    assert.deepEqual(
      Object.keys(book).filter((field) => forbiddenFields.has(field)),
      [],
      `${book.title} must not introduce classification, status, date, or review fields`,
    );
  }
});

test("homepage reading preview titles resolve in their curated order", () => {
  assert.equal(readingPreviewTitles.length, 5);
  assert.deepEqual(
    readingPreviewTitles.map((title) => readingBooks.find((book) => book.title === title)?.title),
    [...readingPreviewTitles],
  );
});
