export const publicCacheTags = {
  projects: "arcadeghosts-public-projects",
  tinyThoughts: "arcadeghosts-public-tiny-thoughts",
} as const;

export const publicCacheKeyPrefixes = {
  projects: "arcadeghosts-public-projects-v1",
  tinyThoughts: "arcadeghosts-public-tiny-thoughts-v1",
} as const;

export const publicCacheRevalidateSeconds = {
  projects: 3600,
  tinyThoughts: 900,
} as const;
