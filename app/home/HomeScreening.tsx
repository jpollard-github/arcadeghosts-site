import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import { VisualMediaCard } from "../VisualMediaCard";
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
          <VisualMediaCard
            item={item}
            key={item.title}
            priority={index < 3}
            sizes="(max-width: 430px) 100vw, (max-width: 860px) 50vw, 25vw"
          />
        ))}
      </div>
    </section>
  );
}
