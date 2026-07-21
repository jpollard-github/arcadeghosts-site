import { AlbumCard } from "../AlbumCard";
import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import { listeningAlbums } from "../site-data";

const listeningPreviewAlbums = listeningAlbums.slice(0, 6);

export function HomeListening() {
  return (
    <section className="content-section listening-section">
      <SectionHeading
        id="listening"
        eyebrow="Listening"
        title="A few albums still humming through the walls."
      >
        Old favorites, newer discoveries, and records that kept leaving a signal behind.
      </SectionHeading>
      <div className="feed-links" aria-label="Listening room links">
        <TrackedLink
          className="feed-link"
          href="/listening"
          trackingEvent="Listening Link Clicked"
          trackingProperties={{ destination: "/listening", source: "homepage-feed-links" }}
        >
          Visit Listening Room
        </TrackedLink>
      </div>
      <div className="listening-grid listening-preview" aria-label="Listening preview">
        {listeningPreviewAlbums.map((album) => (
          <AlbumCard
            album={album}
            key={`${album.artist}-${album.title}`}
            priority
            sizes="(max-width: 560px) 50vw, (max-width: 860px) 33vw, (max-width: 1100px) 25vw, 17vw"
          />
        ))}
      </div>
    </section>
  );
}
