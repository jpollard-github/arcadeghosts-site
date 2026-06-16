import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Guestbook } from "./Guestbook";
import { SectionHeading } from "./SectionHeading";
import { SignalBooth } from "./SignalBooth";
import { TinyThoughts } from "./TinyThoughts";
import { getPublicNowItems } from "./lib/now";
import { getPublicProjects } from "./lib/projects";
import { absoluteUrl, siteConfig } from "./seo";
import {
  arcadeGames,
  beverlyAndLucindaPhotos,
  thomasJonesMissyCassPhotos,
  visualMedia,
} from "./site-data";
import { writings } from "./writings";

const navItems = [
  { label: "Now", href: "#now" },
  { label: "Projects", href: "#projects" },
  { label: "Writing", href: "#writing" },
  { label: "Fun & Games", href: "#fun-and-games" },
  { label: "About", href: "#about" },
  { label: "Music", href: "/music" },
  { label: "Cats", href: "#cats" },
  { label: "Guestbook", href: "#guestbook" },
];

const githubRepoUrl = "https://github.com/jpollard-github/personal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jason Pollard's Projects, Writing, Music, Cats, and Arcade Ghosts",
  description:
    "ArcadeGhosts is Jason Pollard's personal site for software projects, essays, music signals, cat photos, arcade nostalgia, and strange little experiments.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ArcadeGhosts | Jason Pollard",
    description:
      "Software projects, essays, music signals, cat photos, arcade nostalgia, and strange little experiments.",
    url: "/",
  },
};

const funAndGamesCards = [
  {
    eyebrow: "Interactive",
    title: "Signal Booth",
    text: "A random oracle for people who communicate through arcade glow, cats, songs, road trips, odd films, and late-night notes.",
    href: "#signal-booth",
    cta: "Try it",
  },
  {
    eyebrow: "Reflection",
    title: "The Lodges Within",
    text: "A Twin Peaks-inspired self-guided journey for naming the room you are in and leaving with one usable next step.",
    href: "/twin-peaks-self",
    cta: "Enter",
  },
  {
    eyebrow: "Game",
    title: "Between Two Lodges",
    text: "A browser text adventure about coffee, woods, clues, dreams, recurring witnesses, and alternate endings.",
    href: "/games/between-two-lodges/",
    cta: "Play",
  },
];

const aboutCards = [
  {
    eyebrow: "Field Guide",
    title: "Arcade Room",
    text: `${arcadeGames.length} favorite cabinets and the quarter-light nostalgia that still hums behind the projects.`,
    href: "/arcade",
    cta: "Open",
  },
  {
    eyebrow: "Taste Map",
    title: "Movies & TV",
    text: `${visualMedia.length} screen signals: Twin Peaks, Severance, horror, memory loops, strange comedies, and other resonant static.`,
    href: "/movies-tv",
    cta: "Browse",
  },
  {
    eyebrow: "Listening Room",
    title: "Music",
    text: "Synths, late-night tenderness, Music League, and songs for fluorescent weather.",
    href: "/music",
    cta: "Listen",
  },
];

const projectStatusLabels = new Map([
  ["active", "Active"],
  ["planning", "Planning"],
  ["paused", "Paused"],
  ["shipped", "Shipped"],
  ["archived", "Archived"],
]);

function projectCta(href: string) {
  if (!href) {
    return "";
  }

  try {
    const url = new URL(href);

    return url.hostname === "github.com" ? "View Repo" : "Visit";
  } catch {
    return href.startsWith("/games/") ? "Play" : "Open";
  }
}

function formatProjectDate(value: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default async function Home() {
  const [nowItems, projects] = await Promise.all([
    getPublicNowItems(),
    getPublicProjects(),
  ]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": absoluteUrl("/#jason-pollard"),
        name: siteConfig.author,
        url: siteConfig.url,
        sameAs: ["https://github.com/jpollard-github"],
        knowsAbout: [
          "Software development",
          "Artificial intelligence",
          "Arcade games",
          "Writing",
          "Music",
          "Cats",
          "Twin Peaks",
        ],
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        author: {
          "@id": absoluteUrl("/#jason-pollard"),
        },
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <section className="hero" id="top">
        <Image
          src="/images/neon-forest-diner.png"
          alt="A neon-lit diner at the edge of a misty evergreen forest at night"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-scrim" />
        <nav className="nav" aria-label="Main navigation">
          <div className="nav-links">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <a
            className="github-nav-link"
            href={githubRepoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open GitHub repository"
            title="GitHub repository"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.87c.68 0 1.36.09 2 .26 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
              />
            </svg>
          </a>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">Jason Pollard / living portfolio</p>
          <h1>Useful tools with a strange little heartbeat.</h1>
          <p className="hero-copy">
            I&apos;m a software developer building thoughtful products,
            self-reflection systems, writing spaces, games, and small signals
            from the neon forest.
          </p>
          <div className="hero-actions" aria-label="Primary links">
            <a className="button primary" href="#now">
              What&apos;s Now
            </a>
            <a className="button secondary" href="#projects">
              See Projects
            </a>
          </div>
        </div>
      </section>

      <section className="intro-band" aria-label="Site mood">
        <p>
          A living portfolio for software, writing, experiments, personal
          mythology, and the kind of ideas that keep tapping on the glass.{" "}
          <Link
            className="admin-cup-link"
            href="/admin"
            aria-label="Open admin dashboard"
            title="Admin dashboard"
          >
            ☕
          </Link>
        </p>
      </section>

      <section className="content-section now-section" id="now">
        <SectionHeading eyebrow="Now" title="What I&apos;m building and thinking about.">
          The current shape of the work: active projects, ideas that are still
          glowing, and the next practical moves that keep the whole thing alive.
        </SectionHeading>
        <div className="now-grid">
          {nowItems.map((item) => (
            <article className="now-card" key={item.title}>
              <p className="card-eyebrow">{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" id="projects">
        <SectionHeading eyebrow="Projects" title="Shipped, active, paused, and becoming.">
          The workbench: products, games, tools, and experiments with visible
          status so the site feels current instead of frozen in amber.
        </SectionHeading>
        <div className="card-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              {project.imageUrl ? (
                <div className="project-image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageUrl}
                    alt={`${project.title} project image`}
                    className="project-image"
                  />
                </div>
              ) : null}
              <div className="project-card-meta">
                <p className="card-eyebrow">{project.type}</p>
                <span>{projectStatusLabels.get(project.status) ?? project.status}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.lastUpdatedAt ? (
                <p className="project-updated">
                  Last updated {formatProjectDate(project.lastUpdatedAt)}
                </p>
              ) : null}
              {project.href ? (
                <a
                  className="project-link"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {projectCta(project.href)}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" id="writing">
        <SectionHeading eyebrow="Writing" title="Essays from the booth by the window.">
          Notes on technology, identity, attention, grief, comedy, and the
          suspiciously heroic act of trying again tomorrow.
        </SectionHeading>
        <div className="list-panel">
          {writings.map((writing) => (
            <a href={`/writings/${writing.slug}`} key={writing.slug}>
              <span className="writing-icon" aria-hidden="true">
                {writing.icon}
              </span>
              <span>
                <span>{writing.title}</span>
                <small>{writing.description}</small>
              </span>
              <span aria-hidden="true">Read</span>
            </a>
          ))}
        </div>
      </section>

      <section className="content-section tiny-thought-section" id="tiny-thoughts">
        <SectionHeading eyebrow="Tiny Thoughts" title="Short signals from the counter.">
          Quick observations, lessons learned, funny experiences, opinions, and
          small notes that do not need to become full essays.
        </SectionHeading>
        <TinyThoughts />
      </section>

      <section className="content-section fun-games-section" id="fun-and-games">
        <SectionHeading eyebrow="Fun and Games" title="Oracles, rooms, and playable static.">
          The playful side of the site: interactive toys, symbolic journeys, and
          game-shaped paths through the neon forest.
        </SectionHeading>
        <div className="section-link-grid fun-games-grid">
          {funAndGamesCards.map((card) => (
            <a className="section-link-card" href={card.href} key={card.title}>
              <span className="card-eyebrow">{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <span>{card.cta}</span>
            </a>
          ))}
        </div>
        <section className="signal-booth-section" id="signal-booth">
          <SectionHeading eyebrow="Signal Booth" title="A random oracle for your people.">
            Two hundred signals pulled from the site&apos;s obsessions: arcade
            glow, cats, songs, road trips, comeback stories, weird films, AI
            tools, and late-night notes that might know where they belong.
          </SectionHeading>
          <SignalBooth />
        </section>
      </section>

      <section className="content-section about" id="about">
        <div className="about-copy">
          <p className="eyebrow">About</p>
          <h2>Who I am and how I think.</h2>
          <p>
            I&apos;m Jason Pollard, a software developer, cat dad, music
            enthusiast, arcade wanderer, and lifelong collector of strange ideas.
            I build tools and experiments that are practical enough to use and
            personal enough to remember.
          </p>
          <p>
            I live in North Carolina&apos;s Triad region and spend a lot of time
            exploring the intersection of technology, creativity, nostalgia,
            personal growth, AI, writing, games, and stories that leave you
            wondering what was real and what wasn&apos;t.
          </p>
          <p>
            ArcadeGhosts exists because social profiles rarely capture the parts
            that matter: late-night conversations, favorite songs, forgotten
            arcade cabinets, weird dreams, cat rituals, and sudden
            self-understanding.
          </p>

          <h3>If you&apos;re the type of person who enjoys:</h3>
          <ul className="about-list">
            <li>The strange atmosphere of Twin Peaks</li>
            <li>Finding hidden meaning in songs and films</li>
            <li>Losing track of time in an old arcade</li>
            <li>Deep conversations that skip the small talk</li>
            <li>Learning for the sheer joy of learning</li>
            <li>Cats</li>
            <li>Building things just because they&apos;re interesting</li>
            <li>The feeling of discovering your people</li>
          </ul>

          <h3>Some places on the internet that resonate with me:</h3>
          <div className="resonance-links">
            <a href="https://welcometotwinpeaks.com" target="_blank" rel="noreferrer">
              Twin Peaks fans
            </a>
            <a href="https://nightride.fm/" target="_blank" rel="noreferrer">
              Synthwave and retro culture
            </a>
            <a href="https://rateyourmusic.com" target="_blank" rel="noreferrer">
              Music discovery
            </a>
            <a href="https://www.arcade-museum.com" target="_blank" rel="noreferrer">
              Arcade history and preservation
            </a>
            <a href="https://longreads.com" target="_blank" rel="noreferrer">
              Curious minds and long-form ideas
            </a>
            <a href="https://www.are.na" target="_blank" rel="noreferrer">
              Weird, beautiful internet projects
            </a>
          </div>

          <p>
            ArcadeGhosts is ultimately an experiment in whether a collection of
            interests, stories, projects, music, photos, and ideas can attract
            the right conversations. If something here feels familiar, reach out.
          </p>

          <div className="section-link-grid about-card-grid">
            {aboutCards.map((card) => (
              <a className="section-link-card" href={card.href} key={card.title}>
                <span className="card-eyebrow">{card.eyebrow}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span>{card.cta}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section cats-section" id="cats">
        <SectionHeading eyebrow="Cats" title="Cat rooms, no endless hallway.">
          The cat galleries have moved into their own rooms so the homepage can
          breathe again.
        </SectionHeading>
        <div className="section-link-grid">
          <a className="section-link-card" href="/cats/beverly-and-lucinda">
            <span className="card-eyebrow">
              {beverlyAndLucindaPhotos.length} photos
            </span>
            <h3>Beverly and Lucinda</h3>
            <p>
              Tiny chaos professionals from 2025 to current: ping pong balls,
              Churu, bed visits, and meaningful eye contact.
            </p>
            <span>Visit</span>
          </a>
          <a className="section-link-card" href="/cats/thomas-jones-missy-cass">
            <span className="card-eyebrow">
              {thomasJonesMissyCassPhotos.length} photos
            </span>
            <h3>Thomas, Jones, Missy, and Cass</h3>
            <p>
              A larger memory room from 2016 to 2025, with Thomas and the
              little orbit of cats around him.
            </p>
            <span>Visit</span>
          </a>
        </div>
      </section>

      <section className="content-section guestbook-section" id="guestbook">
        <SectionHeading eyebrow="Guestbook" title="Leave a signal for the wall.">
          Music recommendations, arcade memories, cat stories, Twin Peaks notes,
          site thoughts, and any other small transmission that feels like it
          belongs in the neon forest.
        </SectionHeading>
        <Guestbook />
      </section>
    </main>
  );
}
