import Image from "next/image";
import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import { visualMedia } from "../site-data";

const screeningPreviewTitles = [
  "Twin Peaks Season 1",
  "Widow's Bay",
  "Eternal Sunshine of the Spotless Mind",
  "Just Like Heaven",
] as const;

const screeningPreviewItems = screeningPreviewTitles
  .map((title) => visualMedia.find((item) => item.title === title))
  .filter((item) => item !== undefined);

export function HomeScreening() {
  return (
    <section className="content-section screening-section" id="screening">
      <SectionHeading eyebrow="Screening" title="A few screen stories still glowing in the lobby.">
        Twin Peaks, Severance, horror, curious comedies, and the bits of
        emotional weather that kept hanging around long enough to earn their
        own shelf.
      </SectionHeading>
      <div className="feed-links" aria-label="Screening room links">
        <TrackedLink
          className="feed-link"
          href="/screening"
          trackingEvent="Screening Link Clicked"
          trackingProperties={{ destination: "/screening", source: "homepage-feed-links" }}
        >
          Visit Screening Room
        </TrackedLink>
      </div>
      <div className="media-grid" aria-label="Screening preview">
        {screeningPreviewItems.map((item, index) => (
          <article className="media-card" key={item.title}>
            <a
              className="media-image-link"
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${item.title} image source`}
            >
              <Image
                src={item.image}
                alt={`${item.title} poster or key art`}
                fill
                sizes="(max-width: 430px) 100vw, (max-width: 860px) 50vw, 25vw"
                className={`media-image${item.fit === "contain" ? " contain" : ""}`}
              />
            </a>
            <div className="media-card-copy">
              <h3>
                {item.itemUrl ? (
                  <a href={item.itemUrl} target="_blank" rel="noreferrer">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h3>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                Source
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
