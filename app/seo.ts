export const siteConfig = {
  name: "ArcadeGhosts",
  title: "ArcadeGhosts | Jason Pollard",
  socialTitle: "A personal signal from the neon woods.",
  description:
    "Writing, tiny thoughts, games, music, movies, books, cats, and pieces of whatever Jason Pollard is trying to understand.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://arcadeghosts.org",
  author: "Jason Pollard",
  github: "https://github.com/jpollard-github/arcadeghosts-site",
  ogImage: "/opengraph-image",
};

export const defaultOgImageAlt = `${siteConfig.name} by ${siteConfig.author}: ${siteConfig.socialTitle}`;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
