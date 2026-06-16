import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "../SectionHeading";
import { music } from "../music-data";

export const metadata: Metadata = {
  title: "Music, Playlists, and Music League",
  description:
    "Jason Pollard's listening room: synths, late-night tenderness, Spotify playlists, Music League, and songs for fluorescent weather.",
  alternates: {
    canonical: "/music",
  },
  openGraph: {
    title: "Music, Playlists, and Music League",
    description:
      "Synths, late-night tenderness, Spotify playlists, Music League, and songs for fluorescent weather.",
    url: "/music",
  },
};

export default function MusicPage() {
  return (
    <main className="collection-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <Link className="back-link" href="/#about">
        Back Home
      </Link>
      <section className="content-section music-section collection-section">
        <SectionHeading eyebrow="Music" title="Songs for fluorescent weather.">
          Synths, small rituals, late-night tenderness, and melodies that look
          directly at the void before asking whether it wants fries.
        </SectionHeading>
        <div className="tape-row">
          {music.map((playlist) => (
            <article className="tape" key={playlist.title}>
              <h3>{playlist.title}</h3>
              <iframe
                title={`${playlist.title} Spotify playlist`}
                src={playlist.embedUrl}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </article>
          ))}
        </div>
        <div className="music-league">
          <div>
            <h3>Music League</h3>
            <p>Music Leagues I&apos;ve either run or participated in.</p>
          </div>
          <div className="music-league-card">
            <a
              className="music-league-link"
              href="https://app.musicleague.com/user/8e855be976294ae0aedf7a0820572ffb/"
              target="_blank"
              rel="noreferrer"
              aria-label="Open Jason's Music League profile"
            >
              <Image
                src="/images/music-league.png"
                alt="Music League"
                fill
                sizes="(max-width: 860px) 100vw, 520px"
                className="music-league-image"
              />
            </a>
            <a
              className="music-league-profile"
              href="https://app.musicleague.com/user/8e855be976294ae0aedf7a0820572ffb/"
              target="_blank"
              rel="noreferrer"
            >
              View Profile
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
