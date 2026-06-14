import Image from "next/image";
import { writings } from "./writings";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Arcade", href: "#arcade" },
  { label: "Movies & TV Shows", href: "#movies-tv" },
  { label: "Writing", href: "#writing" },
  { label: "Music", href: "#music" },
  { label: "Cats", href: "#cats" },
  { label: "Contact", href: "#contact" },
];

const projects = [
  {
    title: "Between Two Lodges",
    eyebrow: "Browser game",
    description:
      "A moody, original text adventure about coffee, woods, clues, dreams, and the kind of hallway that knows your name.",
    href: "/games/between-two-lodges/index.html",
    cta: "Play",
  },
];

const arcadeGames = [
  {
    title: "Galaga",
    image: "/images/arcade/galaga.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Galaga",
  },
  {
    title: "Ms. Pac-Man",
    image: "/images/arcade/ms-pac-man.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Ms._Pac-Man",
  },
  {
    title: "Mr. Do's Castle",
    image: "/images/arcade/mr-dos-castle.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Mr._Do%27s_Castle",
  },
  {
    title: "Track and Field",
    image: "/images/arcade/track-and-field.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Track_%26_Field_(video_game)",
  },
  {
    title: "Hyper Sports",
    image: "/images/arcade/hyper-sports.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Hyper_Sports",
  },
  {
    title: "Donkey Kong",
    image: "/images/arcade/donkey-kong.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Donkey_Kong_(arcade_game)",
  },
  {
    title: "Donkey Kong 3",
    image: "/images/arcade/donkey-kong-3.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Donkey_Kong_3",
  },
  {
    title: "Robotron: 2084",
    image: "/images/arcade/robotron-2084.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Robotron:_2084",
  },
  {
    title: "Tron",
    image: "/images/arcade/tron.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Tron_(video_game)",
  },
  {
    title: "Major Havoc",
    image: "/images/arcade/major-havoc.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Major_Havoc",
  },
  {
    title: "Dragon's Lair",
    image: "/images/arcade/dragons-lair.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Dragon%27s_Lair_(1983_video_game)",
  },
  {
    title: "Karate Champ",
    image: "/images/arcade/karate-champ.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Karate_Champ",
  },
  {
    title: "Vs. Excitebike",
    image: "/images/arcade/vs-excitebike.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Vs._Excitebike",
  },
];

const visualMedia = [
  {
    title: "Twin Peaks Season 1",
    image: "/images/movies-tv/twin-peaks-season-1.jpg",
    sourceUrl: "https://watch.plex.tv/en-GB/show/twin-peaks/season/1",
  },
  {
    title: "Twin Peaks Season 2",
    image: "/images/movies-tv/twin-peaks-season-2.jpg",
    sourceUrl: "https://watch.plex.tv/show/twin-peaks/season/2",
  },
  {
    title: "Twin Peaks Season 3",
    image: "/images/movies-tv/twin-peaks-season-3.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Twin_Peaks:_The_Return",
  },
  {
    title: "Severance",
    image: "/images/movies-tv/severance.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Severance_(TV_series)",
    fit: "contain",
  },
  {
    title: "Widow's Bay",
    image: "/images/movies-tv/widows-bay.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Widow%27s_Bay",
    fit: "contain",
  },
  {
    title: "A Nightmare on Elm Street",
    image: "/images/movies-tv/nightmare-on-elm-street.jpg",
    itemUrl: "https://letterboxd.com/film/a-nightmare-on-elm-street/",
    sourceUrl: "https://en.wikipedia.org/wiki/A_Nightmare_on_Elm_Street",
  },
  {
    title: "Total Recall (1990)",
    image: "/images/movies-tv/total-recall-1990.jpg",
    itemUrl: "https://letterboxd.com/film/total-recall-1990/",
    sourceUrl: "https://en.wikipedia.org/wiki/Total_Recall_(1990_film)",
  },
  {
    title: "Pump Up the Volume",
    image: "/images/movies-tv/pump-up-the-volume.jpg",
    itemUrl: "https://letterboxd.com/film/pump-up-the-volume/",
    sourceUrl: "https://en.wikipedia.org/wiki/Pump_Up_the_Volume_(film)",
  },
  {
    title: "Deuce Bigalow",
    image: "/images/movies-tv/deuce-bigalow.jpg",
    itemUrl: "https://letterboxd.com/film/deuce-bigalow-male-gigolo/",
    sourceUrl: "https://en.wikipedia.org/wiki/Deuce_Bigalow:_Male_Gigolo",
  },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    image: "/images/movies-tv/eternal-sunshine.png",
    itemUrl: "https://letterboxd.com/film/eternal-sunshine-of-the-spotless-mind/",
    sourceUrl: "https://en.wikipedia.org/wiki/Eternal_Sunshine_of_the_Spotless_Mind",
  },
  {
    title: "Donnie Darko",
    image: "/images/movies-tv/donnie-darko.jpg",
    itemUrl: "https://letterboxd.com/film/donnie-darko/",
    sourceUrl: "https://en.wikipedia.org/wiki/Donnie_Darko",
  },
  {
    title: "Groundhog Day",
    image: "/images/movies-tv/groundhog-day.jpg",
    itemUrl: "https://letterboxd.com/film/groundhog-day/",
    sourceUrl: "https://en.wikipedia.org/wiki/Groundhog_Day_(film)",
  },
  {
    title: "The Game",
    image: "/images/movies-tv/the-game.jpg",
    itemUrl: "https://letterboxd.com/film/the-game/",
    sourceUrl: "https://en.wikipedia.org/wiki/The_Game_(1997_film)",
  },
  {
    title: "MXC: Most Extreme Elimination Challenge",
    image: "/images/movies-tv/mxc.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Most_Extreme_Elimination_Challenge",
    fit: "contain",
  },
  {
    title: "Just Like Heaven",
    image: "/images/movies-tv/just-like-heaven.jpg",
    itemUrl: "https://letterboxd.com/film/just-like-heaven-2005/",
    sourceUrl: "https://en.wikipedia.org/wiki/Just_like_Heaven_(2005_film)",
  },
  {
    title: "Return to Me",
    image: "/images/movies-tv/return-to-me.jpg",
    itemUrl: "https://letterboxd.com/film/return-to-me/",
    sourceUrl: "https://en.wikipedia.org/wiki/Return_to_Me",
  },
  {
    title: "Limitless",
    image: "/images/movies-tv/limitless.jpg",
    itemUrl: "https://letterboxd.com/film/limitless/",
    sourceUrl: "https://en.wikipedia.org/wiki/Limitless_(film)",
  },
];

const music = [
  {
    title: "Reflective Resilience",
    embedUrl:
      "https://open.spotify.com/embed/playlist/01pnqPSqX1p0Wlr2nAvTX6?utm_source=generator&si=715ecc7f74494f58",
  },
  {
    title: "Arcode Ghosts After Midnight",
    embedUrl:
      "https://open.spotify.com/embed/playlist/5Ugcnm2Tsfea7Ww5gQpnu8?utm_source=generator&si=d94d276e65cb4555",
  },
  {
    title: "Love Me Tomorrow Radio",
    embedUrl:
      "https://open.spotify.com/embed/playlist/37i9dQZF1E8N7ryesPcRvq?utm_source=generator&si=4cbb222de7e2480e",
  },
  {
    title: "The Mountain Radio",
    embedUrl:
      "https://open.spotify.com/embed/playlist/37i9dQZF1E8EjBVdMRkm5J?utm_source=generator&si=f0f017613a7c4e1d",
  },
];

const catPhotos = Array.from({ length: 23 }, (_, index) => {
  const photoNumber = index + 1;

  return {
    src: `/images/beverly-and-lucinda/BeverlyAndLucinda%20-%20${photoNumber}.jpeg`,
    alt: `Beverly and Lucinda photo ${photoNumber}`,
  };
});

const thomasPhotos = Array.from({ length: 269 }, (_, index) => {
  const photoNumber = index + 1;

  return {
    src: `/images/thomas/ThomasJonesMissyCass%20-%20${photoNumber}.jpeg`,
    alt: `Thomas, Jones, Missy, and Cass photo ${photoNumber}`,
  };
});

const contactLinks = [
  { label: "Email", href: "mailto:jason@arcadeghosts.org" },
  {
    label: "GitHub",
    href: "https://github.com/jpollard-github/personal",
    target: "_blank",
  },
  {
    label: "Newsletter",
    href: "https://www.reddit.com/r/twinpeaks/",
    target: "_blank",
  },
];

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main>
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
          <a className="brand" href="#top" aria-label="Home">
            <span className="brand-mark" />
            <span>Night Kitchen</span>
          </a>
          <div className="nav-links">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">Jason&apos;s site / emotional roadside attraction</p>
          <h1>Warm dispatches from the neon forest.</h1>
          <p className="hero-copy">
            I make useful things with a strange little heartbeat: software,
            essays, songs, jokes with tiny fangs, and maps back to myself.
          </p>
          <div className="hero-actions" aria-label="Primary links">
            <a className="button primary" href="#projects">
              See Projects
            </a>
            <a className="button secondary" href="#contact">
              Send a Signal
            </a>
          </div>
        </div>
      </section>

      <section className="intro-band" aria-label="Site mood">
        <p>
          Equal parts diner coffee, haunted jukebox, field guide, and hopeful
          note found in a jacket pocket.
        </p>
      </section>

      <section className="content-section about" id="about">
        <div className="about-copy">
          <p className="eyebrow">About</p>
          <h2>Welcome to ArcadeGhosts.</h2>
          <p>
            I&apos;m Jason, a software developer, cat dad, music enthusiast,
            arcade wanderer, and lifelong collector of strange ideas.
          </p>
          <p>
            I built this site because social media profiles never seem to capture
            the things that actually matter. The interesting parts of life happen
            somewhere between a late-night conversation, a favorite song, a
            forgotten arcade cabinet, a weird dream, and a moment when you
            suddenly understand something about yourself.
          </p>
          <p>
            I live in North Carolina&apos;s Triad region and spend a lot of time
            exploring the intersection of technology, creativity, nostalgia, and
            personal growth. Some of my favorite things include classic arcades,
            80s music, horror movies, artificial intelligence, trivia nights, road
            trips, coding projects, and stories that leave you wondering what was
            real and what wasn&apos;t.
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
          <p>...then you&apos;ll probably feel at home here.</p>

          <h3>A few things that have shaped me:</h3>
          <ul className="about-list">
            <li>Exploring ideas through AI and technology</li>
            <li>Growing up around academics, archaeology, and curiosity</li>
            <li>Countless hours spent in arcades and game rooms</li>
            <li>
              Music ranging from Queen and Jefferson Starship to synthwave and
              modern discoveries
            </li>
            <li>
              The realization that life becomes much more interesting when you
              stop trying to fit into the wrong crowd
            </li>
          </ul>

          <p>
            You&apos;ll find photos, projects, music, arcade adventures, thoughts,
            experiments, and whatever else captures my attention.
          </p>

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

          <p>ArcadeGhosts is ultimately an experiment.</p>
          <p>Can a website still help people find each other?</p>
          <p>
            Can a collection of interests, stories, music, photos, and ideas
            attract the right conversations?
          </p>
          <p>I don&apos;t know.</p>
          <p>But if something here feels familiar, reach out.</p>
          <p>Maybe you&apos;re one of my people.</p>
        </div>
      </section>

      <section className="content-section" id="projects">
        <SectionHeading eyebrow="Projects" title="Things with knobs and souls.">
          A few editable placeholders for work that can be practical, poetic, or
          charmingly suspicious of false binaries.
        </SectionHeading>
        <div className="card-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <p className="card-eyebrow">{project.eyebrow}</p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {"href" in project ? (
                <a className="project-link" href={project.href}>
                  {project.cta}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="content-section arcade-section" id="arcade">
        <SectionHeading eyebrow="Arcade" title="Quarter-light favorites.">
          I would spend hours in arcades, following cabinet glow from one
          obsession to the next. I even skipped art class upstairs from my
          favorite childhood arcade in Plattsburgh, NY, because sometimes the
          real curriculum was vector beams, joysticks, and the sound of another
          coin dropping.
        </SectionHeading>
        <div className="arcade-grid">
          {arcadeGames.map((game) => (
            <article className="arcade-card" key={game.title}>
              <a
                className="arcade-image-link"
                href={game.sourceUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${game.title} image source`}
              >
                <Image
                  src={game.image}
                  alt={`${game.title} arcade artwork`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 980px) 33vw, 20vw"
                  className="arcade-image"
                />
              </a>
              <div className="arcade-card-copy">
                <h3>{game.title}</h3>
                <a href={game.sourceUrl} target="_blank" rel="noreferrer">
                  Source
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section media-section" id="movies-tv">
        <SectionHeading eyebrow="Movies & TV" title="Movies & TV Shows.">
          Visual media that resonated.
        </SectionHeading>
        <div className="media-grid">
          {visualMedia.map((item) => (
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
                  sizes="(max-width: 640px) 50vw, (max-width: 980px) 33vw, 20vw"
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

      <section className="content-section music-section" id="music">
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

      <section className="content-section cats-section" id="cats">
        <SectionHeading eyebrow="Cats" title="Beverly and Lucinda from 2025 to current">
          Beverly and Lucinda are beloved tiny chaos professionals who chase
          ping pong balls, get in the bed with me, eat lots of Churu, and
          practice suspiciously meaningful eye contact.
        </SectionHeading>
        <div className="cat-gallery" aria-label="Photos of Beverly and Lucinda">
          {catPhotos.map((photo) => (
            <figure className="cat-photo" key={photo.src}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                className="cat-photo-image"
              />
            </figure>
          ))}
        </div>
        <div className="cat-subsection">
          <h3>Thomas, Jones, Missy, and Cass from 2016 to 2025</h3>
          <p>
            Thomas was my buddy was 17 years and passed in 2025. Missy looks
            like Thomas and both Missy and Jones were rehomed in 2024. Jones
            died unexpectly shortly therafter. Cass belonged to my ex but got
            along with Thomas.
          </p>
          <div
            className="cat-gallery"
            aria-label="Photos of Thomas, Jones, Missy, and Cass"
          >
            {thomasPhotos.map((photo) => (
              <figure className="cat-photo" key={photo.src}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                  className="cat-photo-image"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Leave a message at the counter.</h2>
          <p>
            For collaborations, kind notes, strange ideas, playlists, and
            carefully scoped existential questions.
          </p>
        </div>
        <div className="contact-links">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.target}
              rel={link.target === "_blank" ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
