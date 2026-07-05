import { readFile } from "node:fs/promises";
import path from "node:path";
import { arcadeGames, beverlyAndLucindaPhotos, thomasJonesMissyCassPhotos, visualMedia } from "../site-data";
import { getPublicProjects } from "./projects";
import type { SearchEntry } from "./search-shared";
import { getPublicTinyThoughts } from "./tiny-thoughts";
import { writings } from "../writings";

const staticEntries: SearchEntry[] = [
  {
    id: "page-tiny-thoughts",
    type: "page",
    title: "Tiny Thoughts",
    description: "A fuller archive of short signals, observations, and counter notes.",
    href: "/tiny-thoughts",
    eyebrow: "Short-form archive",
    cta: "Open tiny thoughts",
    priority: 91,
    searchText:
      "tiny thoughts short signals observations opinions funny notes archive counter signals short form",
  },
  {
    id: "page-music",
    type: "page",
    title: "Music",
    description: "Playlists, Music League, synth weather, and listening history.",
    href: "/music",
    eyebrow: "Listening room",
    cta: "Enter music room",
    priority: 88,
    searchText:
      "music playlists music league synth listening room spotify songs albums artists genres fluorescent weather",
  },
  {
    id: "page-agents",
    type: "page",
    title: "The Five Agents",
    description: "Jason Pollard's advisory council for execution, truth, building, voice, and alignment.",
    href: "/agents",
    eyebrow: "Advisory council",
    cta: "Meet the five agents",
    priority: 83,
    searchText:
      "five agents advisory council energizer bunny widow handyman comic sans shepherd execution strategy truth telling builder copywriting alignment personas",
  },
  {
    id: "page-movies-tv",
    type: "page",
    title: "Movies & TV",
    description: "Twin Peaks, Severance, horror, curious comedies, and screen signals.",
    href: "/movies-tv",
    eyebrow: "Taste map",
    cta: "Browse screen signals",
    priority: 82,
    searchText: `movies tv television severance twin peaks horror comedy screen signals ${visualMedia
      .map((item) => item.title)
      .join(" ")}`,
  },
  {
    id: "page-arcade",
    type: "page",
    title: "Arcade Room",
    description: "Favorite cabinets, quarter-light nostalgia, and arcade history signals.",
    href: "/arcade",
    eyebrow: "Field guide",
    cta: "Open arcade room",
    priority: 79,
    searchText: `arcade games cabinets nostalgia retro quarter history ${arcadeGames.join(" ")}`,
  },
  {
    id: "page-lodges",
    type: "page",
    title: "The Lodges Within",
    description: "A Twin Peaks-inspired self-reflection journey through symbolic rooms.",
    href: "/twin-peaks-self",
    eyebrow: "Reflection tool",
    cta: "Enter the lodges",
    priority: 90,
    searchText:
      "twin peaks reflection self reflection symbolic rooms black lodge white lodge prompts mythology psyche",
  },
  {
    id: "page-terminal",
    type: "page",
    title: "Terminal",
    description: "A green-screen command room with shortcuts into projects, about, music, cats, arcade, and contact.",
    href: "/terminal",
    eyebrow: "Fun and games",
    cta: "Open terminal",
    priority: 77,
    searchText:
      "terminal green screen command line projects about music cats arcade contact old computer neon personal signal",
  },
  {
    id: "page-between-two-lodges",
    type: "page",
    title: "Between Two Lodges",
    description: "A browser text adventure about coffee, clues, dreams, and curious woods.",
    href: "/games/between-two-lodges",
    eyebrow: "Game",
    cta: "Play the game",
    priority: 86,
    searchText:
      "between two lodges game text adventure coffee clues woods dreams twin peaks inspired browser game",
  },
  {
    id: "page-cats-current",
    type: "page",
    title: "Beverly and Lucinda",
    description: "Current cat-room photos, ping pong balls, Churu, and tiny chaos.",
    href: "/cats/beverly-and-lucinda",
    eyebrow: "Cat room",
    cta: "Visit cat room",
    priority: 72,
    searchText: `cats beverly lucinda photos current ping pong balls churu chaos ${beverlyAndLucindaPhotos
      .map((photo) => photo.alt)
      .join(" ")}`,
  },
  {
    id: "page-cats-memory",
    type: "page",
    title: "Thomas, Jones, Missy, and Cass",
    description: "A cat memory room spanning 2016 to 2025.",
    href: "/cats/thomas-jones-missy-cass",
    eyebrow: "Cat memory room",
    cta: "Visit memory room",
    priority: 72,
    searchText: `cats thomas jones missy cass memory grief photos 2016 2025 ${thomasJonesMissyCassPhotos
      .map((photo) => photo.alt)
      .join(" ")}`,
  },
];

function summarizeText(value: string, maxLength = 220) {
  const compact = value.replace(/\s+/g, " ").trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 3).trimEnd()}...`;
}

async function getWritingBody(slug: string) {
  try {
    const markdown = await readFile(
      path.join(process.cwd(), "public", "writings", `${slug}.md`),
      "utf8",
    );

    return markdown
      .replace(/^\*\*(.+?)\*\*\s*/m, "")
      .replace(/[*_>#-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "";
  }
}

export async function getSearchEntries() {
  const [projects, tinyThoughts, writingBodies] = await Promise.all([
    getPublicProjects(),
    getPublicTinyThoughts(60).catch(() => []),
    Promise.all(writings.map((writing) => getWritingBody(writing.slug))),
  ]);

  const writingEntries = writings.map((writing, index) => ({
    id: `writing-${writing.slug}`,
    type: "writing" as const,
    title: writing.title,
    description: writing.description,
    href: `/writings/${writing.slug}`,
    eyebrow: "Writing",
    cta: "Read writing",
    priority: 92 - index,
    searchText: `${writing.title} ${writing.description} ${writing.related
      .map((item) => `${item.title} ${item.description} ${item.reason ?? ""}`)
      .join(" ")} ${writingBodies[index] ?? ""}`,
  }));

  const projectEntries = projects.map((project, index) => ({
    id: `project-${project.id}`,
    type: "project" as const,
    title: project.title,
    description: project.description,
    href: project.href,
    eyebrow: `${project.type} / ${project.status}`,
    cta: project.href.startsWith("http") ? "Open project" : "Visit project",
    priority: 84 - index,
    searchText: `${project.title} ${project.type} ${project.status} ${project.description} ${project.phase} ${project.nextAction} ${project.blockers}`,
  }));

  const tinyThoughtEntries = tinyThoughts.map((thought, index) => ({
    id: `tiny-thought-${thought.id}`,
    type: "tiny-thought" as const,
    title: summarizeText(thought.content, 88),
    description: summarizeText(thought.content, 180),
    href: `/tiny-thoughts#tiny-thought-${thought.id}`,
    eyebrow: `Tiny Thought / ${thought.category}`,
    cta: "Jump to signal",
    priority: 70 - Math.min(index, 20),
    searchText: `${thought.content} ${thought.category} ${thought.inspiredBy} ${thought.attachments
      .map((attachment) => attachment.url)
      .join(" ")}`,
  }));

  return [...writingEntries, ...projectEntries, ...staticEntries, ...tinyThoughtEntries];
}
