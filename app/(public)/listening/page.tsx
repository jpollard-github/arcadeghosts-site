import type { Metadata } from "next";
import Link from "next/link";
import { AlbumCard } from "../../AlbumCard";
import { SectionHeading } from "../../SectionHeading";
import { listeningAlbums } from "../../site-data";

export const metadata: Metadata = {
  title: "Listening",
  description:
    "Favorite albums and artists Jason Pollard keeps coming back to in the ArcadeGhosts listening room.",
  alternates: {
    canonical: "/listening",
  },
  openGraph: {
    title: "Listening",
    description:
      "Favorite albums and artists Jason Pollard keeps coming back to in the ArcadeGhosts listening room.",
    url: "/listening",
  },
};

export default function ListeningPage() {
  return (
    <main className="collection-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <Link className="back-link" href="/">
        Back Home
      </Link>
      <section className="content-section listening-section collection-section">
        <SectionHeading eyebrow="Listening" title="Albums I keep coming back to.">
          Not a ranking, a genre map, or a complete collection. Just albums that stayed with me.
        </SectionHeading>
        <div className="listening-grid" aria-label="Listening albums">
          {listeningAlbums.map((album, index) => (
            <AlbumCard
              album={album}
              key={`${album.artist}-${album.title}`}
              priority={index < 6}
              sizes="(max-width: 560px) 50vw, (max-width: 860px) 33vw, (max-width: 1100px) 25vw, 17vw"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
