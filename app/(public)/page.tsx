import type { Metadata } from "next";
import { HomeAbout } from "../home/HomeAbout";
import { HomeCats } from "../home/HomeCats";
import { HomeFunAndGames } from "../home/HomeFunAndGames";
import { HomeHero } from "../home/HomeHero";
import { HomeScreening } from "../home/HomeScreening";
import { HomeTinyThoughts } from "../home/HomeTinyThoughts";
import { HomeWriting } from "../home/HomeWriting";
import { serializeJsonLd } from "../lib/json-ld";
import { absoluteUrl, siteConfig } from "../seo";
import { writings } from "../writings";

export const metadata: Metadata = {
  title: "Jason Pollard's Writing, Cats, and Arcade Ghosts",
  description:
    "ArcadeGhosts is Jason Pollard's personal site for essays, cat photos, arcade nostalgia, and curious little experiments.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ArcadeGhosts | Jason Pollard",
    description:
      "Essays, cat photos, arcade nostalgia, and curious little experiments.",
    url: "/",
  },
};

export default function Home() {
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
      {
        "@type": "Blog",
        "@id": absoluteUrl("/#writing-list"),
        name: "ArcadeGhosts writing",
        blogPost: writings.map((writing) => ({
          "@type": "BlogPosting",
          headline: writing.title,
          description: writing.description,
          url: absoluteUrl(`/writings/${writing.slug}`),
          author: {
            "@id": absoluteUrl("/#jason-pollard"),
          },
        })),
      },
    ],
  };

  return (
    <main className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <HomeHero />
      <HomeWriting />
      <HomeTinyThoughts />
      <HomeFunAndGames />
      <HomeScreening />
      <HomeCats />
      <HomeAbout />
    </main>
  );
}
