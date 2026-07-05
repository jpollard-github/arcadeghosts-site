export const siteConfig = {
  name: "ArcadeGhosts",
  title: "ArcadeGhosts | Jason Pollard",
  description:
    "Jason Pollard's personal site for projects, writing, music, cats, arcade nostalgia, and curious little experiments.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://arcadeghosts.org",
  author: "Jason Pollard",
  github: "https://github.com/jpollard-github/arcadeghosts-site",
  ogImage: "/opengraph-image",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
