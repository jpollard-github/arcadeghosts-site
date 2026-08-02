import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "../../SectionHeading";
import { VisualMediaCard } from "../../VisualMediaCard";
import { visualMedia } from "../../site-data";

export const metadata: Metadata = {
  title: "Screening",
  description:
    "Twin Peaks, Severance, horror, curious comedies, memory-loop movies, and other screen stories that stuck with Jason Pollard.",
  alternates: {
    canonical: "/screening",
  },
  openGraph: {
    title: "Screening",
    description:
      "Twin Peaks, Severance, horror, curious comedies, memory-loop movies, and other screen obsessions.",
    url: "/screening",
  },
};

export default function ScreeningPage() {
  return (
    <main className="collection-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <Link className="back-link" href="/">
        Back Home
      </Link>
      <section className="content-section media-section collection-section">
        <SectionHeading eyebrow="Screening" title="Stories that keep following me around.">
          This room is less about reviews and more about the stories, moods,
          and curious signals that keep circling back through my life.
        </SectionHeading>
        <div className="media-intro-panel">
          <p className="media-intro-lead">
            Some of these are comfort objects. Some feel like secret maps. Some
            just leave a residue I still recognize later.
          </p>
          <p>
            Twin Peaks, Severance, horror, curious comedies, memory loops,
            longing, dread, tenderness, fluorescent weirdness. This is the
            shelf of screen stories that stayed loud enough to become part of
            the site&apos;s atmosphere.
          </p>
        </div>
        <div className="media-grid">
          {visualMedia.map((item, index) => (
            <VisualMediaCard
              item={item}
              key={item.title}
              priority={index < 3}
              showComment
              sizes="(max-width: 430px) 100vw, (max-width: 560px) 50vw, (max-width: 980px) 33vw, 25vw"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
