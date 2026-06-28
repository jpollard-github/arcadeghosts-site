import { getPublicProjects } from "../../../app/lib/projects";
import { writings } from "../../../app/writings";

export type SiteSurface = {
  id: string;
  label: string;
  path: string;
  area: "public" | "admin";
  tags: string[];
  category?: RouteCategory;
  journeyEligible?: boolean;
};

export type RouteCategory =
  | "orientation"
  | "identity"
  | "business"
  | "media"
  | "play"
  | "warmth"
  | "writing"
  | "utility"
  | "projects"
  | "errors"
  | "workflow";

export type RouteCatalogEntry = SiteSurface & {
  category: RouteCategory;
  journeyEligible: boolean;
};

export const basePublicRouteCatalog: RouteCatalogEntry[] = [
  { id: "home", label: "Homepage", path: "/", area: "public", tags: ["software", "writing", "curious", "projects"], category: "orientation", journeyEligible: true },
  { id: "about", label: "About", path: "/about", area: "public", tags: ["thoughtful", "identity", "curious"], category: "identity", journeyEligible: true },
  { id: "work-with-me", label: "Work With Me", path: "/work-with-me", area: "public", tags: ["software", "clear", "trust", "projects"], category: "business", journeyEligible: true },
  { id: "music", label: "Music", path: "/music", area: "public", tags: ["music", "concerts", "listening"], category: "media", journeyEligible: true },
  { id: "arcade", label: "Arcade", path: "/arcade", area: "public", tags: ["retro", "arcades", "games"], category: "play", journeyEligible: true },
  { id: "movies-tv", label: "Movies & TV", path: "/movies-tv", area: "public", tags: ["movies", "television", "weird"], category: "media", journeyEligible: true },
  { id: "twin-peaks-self", label: "Twin Peaks Self", path: "/twin-peaks-self", area: "public", tags: ["twin", "peaks", "thoughtful"], category: "media", journeyEligible: true },
  { id: "games-between-two-lodges", label: "Between Two Lodges", path: "/games/between-two-lodges", area: "public", tags: ["games", "twin", "peaks"], category: "play", journeyEligible: true },
  { id: "cats-beverly", label: "Beverly And Lucinda", path: "/cats/beverly-and-lucinda", area: "public", tags: ["cats", "warmth", "home"], category: "warmth", journeyEligible: true },
  { id: "cats-thomas", label: "Thomas Jones Missy Cass", path: "/cats/thomas-jones-missy-cass", area: "public", tags: ["cats", "warmth", "home"], category: "warmth", journeyEligible: true },
  { id: "writings", label: "Writings", path: "/writings", area: "public", tags: ["writing", "thoughtful", "curiosity"], category: "writing", journeyEligible: true },
  { id: "tiny-thoughts", label: "Tiny Thoughts", path: "/tiny-thoughts", area: "public", tags: ["writing", "small", "signals"], category: "writing", journeyEligible: true },
  { id: "search", label: "Search", path: "/search", area: "public", tags: ["find", "orientation", "curiosity"], category: "utility", journeyEligible: true },
  { id: "updates", label: "Updates", path: "/updates", area: "public", tags: ["recent", "changes", "projects"], category: "orientation", journeyEligible: true },
  { id: "build-log", label: "Build Log", path: "/build-log", area: "public", tags: ["building", "projects", "software"], category: "projects", journeyEligible: true },
  { id: "error-preview-not-found", label: "404 Preview", path: "/error-preview/not-found", area: "public", tags: ["errors", "tone", "surreal"], category: "errors", journeyEligible: false },
  { id: "error-preview-server-error", label: "500 Preview", path: "/error-preview/server-error", area: "public", tags: ["errors", "tone", "surreal"], category: "errors", journeyEligible: false },
];

export const adminRouteCatalog: RouteCatalogEntry[] = [
  { id: "admin-home", label: "Admin Dashboard", path: "/admin", area: "admin", tags: ["admin", "control", "orientation"], category: "workflow", journeyEligible: false },
  { id: "admin-content-inbox", label: "Content Inbox", path: "/admin/content-inbox", area: "admin", tags: ["writing", "capture", "workflow"], category: "workflow", journeyEligible: false },
  { id: "admin-projects", label: "Projects Admin", path: "/admin/projects", area: "admin", tags: ["projects", "editing", "software"], category: "workflow", journeyEligible: false },
  { id: "admin-now", label: "Now Admin", path: "/admin/now", area: "admin", tags: ["current", "editing", "signals"], category: "workflow", journeyEligible: false },
  { id: "admin-tiny-thoughts", label: "Tiny Thoughts Admin", path: "/admin/tiny-thoughts", area: "admin", tags: ["writing", "editing", "thoughts"], category: "workflow", journeyEligible: false },
  { id: "admin-writing-drafts", label: "Writing Drafts Admin", path: "/admin/writing-drafts", area: "admin", tags: ["writing", "drafts", "editing"], category: "workflow", journeyEligible: false },
  { id: "admin-home-spotlight", label: "Home Spotlight Admin", path: "/admin/home-spotlight", area: "admin", tags: ["homepage", "editing", "curation"], category: "workflow", journeyEligible: false },
  { id: "admin-social-quest-log", label: "Social Quest Log Admin", path: "/admin/social-quest-log", area: "admin", tags: ["social", "tracking", "workflow"], category: "workflow", journeyEligible: false },
  { id: "admin-context-refresh", label: "Context Refresh Admin", path: "/admin/context-refresh", area: "admin", tags: ["memory", "context", "ai"], category: "workflow", journeyEligible: false },
  { id: "admin-guestbook", label: "Guestbook Admin", path: "/admin/guestbook", area: "admin", tags: ["guestbook", "review", "community"], category: "workflow", journeyEligible: false },
  { id: "admin-error-previews", label: "Error Previews Admin", path: "/admin/error-previews", area: "admin", tags: ["errors", "quality", "review"], category: "workflow", journeyEligible: false },
  { id: "admin-side-hustle", label: "Side Hustle Admin", path: "/admin/side-hustle", area: "admin", tags: ["work", "offers", "editing"], category: "workflow", journeyEligible: false },
  { id: "admin-vercel", label: "Vercel Control Room", path: "/admin/vercel", area: "admin", tags: ["analytics", "deployment", "control"], category: "workflow", journeyEligible: false },
];

export const basePublicSurfaces: SiteSurface[] = basePublicRouteCatalog.map(toSiteSurface);

export const adminSurfaces: SiteSurface[] = adminRouteCatalog.map(toSiteSurface);

export async function getPublicPersonaSurfaces() {
  const dynamicSurfaces = [
    ...getWritingDetailSurfaces(),
    ...(await getInternalProjectSurfaces()),
  ];

  return dedupeSurfaces([...basePublicSurfaces, ...dynamicSurfaces]);
}

export async function getPersonaRouteCatalog() {
  const dynamicEntries = [
    ...getWritingDetailSurfaces(),
    ...(await getInternalProjectSurfaces()),
  ];

  return dedupeSurfaces([...basePublicRouteCatalog, ...adminRouteCatalog, ...dynamicEntries]) as RouteCatalogEntry[];
}

export function getStaticPersonaRouteCatalog() {
  return [...basePublicRouteCatalog, ...adminRouteCatalog];
}

function getWritingDetailSurfaces(): RouteCatalogEntry[] {
  return writings.map((writing) => ({
    id: `writing-${writing.slug}`,
    label: `Writing: ${writing.title}`,
    path: `/writings/${writing.slug}`,
    area: "public" as const,
    tags: ["writing", "essay", "thoughtful", "detail"],
    category: "writing" as const,
    journeyEligible: true,
  }));
}

async function getInternalProjectSurfaces(): Promise<RouteCatalogEntry[]> {
  const projects = await getPublicProjects().catch(() => []);

  return projects
    .filter((project) => project.href.startsWith("/"))
    .map((project) => ({
      id: `project-${project.id}`,
      label: `Project: ${project.title}`,
      path: project.href,
      area: "public" as const,
      tags: ["projects", "detail", "software", "discovery"],
      category: "projects" as const,
      journeyEligible: true,
    }));
}

function toSiteSurface(entry: RouteCatalogEntry): SiteSurface {
  return {
    id: entry.id,
    label: entry.label,
    path: entry.path,
    area: entry.area,
    tags: entry.tags,
    category: entry.category,
    journeyEligible: entry.journeyEligible,
  };
}

function dedupeSurfaces(surfaces: SiteSurface[]) {
  const seen = new Set<string>();

  return surfaces.filter((surface) => {
    const key = `${surface.area}:${surface.path}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
