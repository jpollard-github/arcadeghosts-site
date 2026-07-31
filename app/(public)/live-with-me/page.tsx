import type { Metadata } from "next";
import Link from "next/link";
import {
  liveWithMeContent,
  liveWithMeMailto,
  type LiveWithMeParagraph,
} from "../../site-content/live-with-me";

const { metadata: pageMetadata } = liveWithMeContent;

export const metadata: Metadata = {
  title: {
    absolute: pageMetadata.title,
  },
  description: pageMetadata.description,
  alternates: {
    canonical: "/live-with-me",
  },
  openGraph: {
    title: pageMetadata.title,
    description: pageMetadata.description,
    url: "/live-with-me",
  },
  twitter: {
    card: "summary_large_image",
    title: pageMetadata.title,
    description: pageMetadata.description,
  },
};

function LiveWithMeParagraph({
  paragraph,
}: {
  paragraph: LiveWithMeParagraph;
}) {
  if (typeof paragraph === "string") {
    return <p>{paragraph}</p>;
  }

  return (
    <p>
      {paragraph.map((part, index) =>
        typeof part === "string" ? (
          part
        ) : (
          <Link href={part.href} key={`${part.href}-${index}`}>
            {part.text}
          </Link>
        ),
      )}
    </p>
  );
}

export default function LiveWithMePage() {
  const { hero, sections, closing } = liveWithMeContent;

  return (
    <main className="live-with-me-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <div className="live-with-me-shell">
        <Link className="back-link live-with-me-back-link" href="/">
          Back Home
        </Link>

        <article className="live-with-me-letter" aria-labelledby="live-with-me-title">
          <header className="live-with-me-hero">
            <p className="eyebrow">{hero.eyebrow}</p>
            <p className="live-with-me-signal">{hero.signal}</p>
            <h1 id="live-with-me-title">{hero.heading}</h1>
            <p className="live-with-me-deck">{hero.deck}</p>

            <div className="live-with-me-introduction">
              {hero.introduction.map((paragraph, index) => (
                <LiveWithMeParagraph paragraph={paragraph} key={index} />
              ))}
            </div>

            <aside
              className="live-with-me-note"
              aria-label="A small clarification"
            >
              <span aria-hidden="true" />
              <p>{hero.note}</p>
            </aside>
          </header>

          <div className="live-with-me-sections">
            {sections.map((section, index) => (
              <section
                className={[
                  "live-with-me-section",
                  section.treatment === "practical"
                    ? "live-with-me-section-practical"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                id={section.id}
                key={section.id}
                aria-labelledby={`${section.id}-heading`}
              >
                <div className="live-with-me-section-heading">
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 id={`${section.id}-heading`}>{section.heading}</h2>
                </div>
                <div className="live-with-me-section-copy">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <LiveWithMeParagraph
                      paragraph={paragraph}
                      key={paragraphIndex}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section
            className="live-with-me-closing"
            aria-labelledby="live-with-me-closing-heading"
          >
            <p className="live-with-me-closing-signal">The porch light is on.</p>
            <h2 id="live-with-me-closing-heading">{closing.heading}</h2>
            <div className="live-with-me-closing-copy">
              {closing.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="live-with-me-actions">
              <a className="live-with-me-primary-cta" href={liveWithMeMailto}>
                {closing.primaryCta}
              </a>
              <Link href="/cats/beverly-and-lucinda">{closing.catCta}</Link>
              <Link href="/">{closing.homeCta}</Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
