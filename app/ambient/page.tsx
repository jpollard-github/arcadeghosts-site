import type { Metadata } from "next";
import { AmbientDisplay } from "./AmbientDisplay";
import type { AmbientSignal } from "./ambient-signals";
import { normalizeAmbientTimeMode } from "./ambient-time";
import { getAmbientSceneManifest, selectAmbientSceneForSignal } from "./ambient-scenes";
import { getPublicTinyThoughts, type TinyThought, type TinyThoughtCategory } from "../lib/tiny-thoughts";
import { getPublicProjects, type SiteProject } from "../lib/projects";
import { beverlyAndLucindaPhotos, thomasJonesMissyCassPhotos } from "../site-data";
import { absoluteUrl } from "../seo";
import { writings, type WritingEntry } from "../writings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ambient",
  description:
    "A calm ambient display built from ArcadeGhosts signals: tiny thoughts, projects, writing, and cat rooms.",
  alternates: {
    canonical: "/ambient",
  },
  openGraph: {
    title: "Ambient | ArcadeGhosts",
    description:
      "A slow, haunted little display built from the signals already living inside ArcadeGhosts.",
    url: "/ambient",
  },
};

type AmbientQuery = {
  signal?: string;
  type?: string;
  time?: string;
  mood?: string;
};

function formatThoughtMeta(thought: TinyThought) {
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(thought.createdAt));

  return `${thought.category.replace(/-/g, " ")} • ${date}`;
}

function formatThoughtTitle(category: TinyThoughtCategory) {
  const titles: Record<TinyThoughtCategory, string> = {
    lesson: "Lesson Note",
    observation: "Observation",
    funny: "Passing Joke",
    opinion: "Opinion Drift",
    arcade: "Arcade Glint",
    music: "Music Drift",
    cat: "Cat Note",
    "twin-peaks": "Black Lodge Weather",
    other: "Tiny Thought",
  };

  return titles[category];
}

function trimAmbientText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

function formatProjectMeta(project: SiteProject) {
  const parts = [project.type];

  if (project.status && project.status !== "active") {
    parts.push(project.status);
  }

  return parts.join(" • ");
}

function formatWritingMeta(writing: WritingEntry) {
  return `${writing.icon} Writing`;
}

function buildAmbientSignals(input: {
  thoughts: TinyThought[];
  projects: Awaited<ReturnType<typeof getPublicProjects>>;
  writings: WritingEntry[];
  scenes: Awaited<ReturnType<typeof getAmbientSceneManifest>>["scenes"];
}): AmbientSignal[] {
  const thoughtSignals = input.thoughts.slice(0, 4).map((thought) => ({
    id: `thought-${thought.id}`,
    kind: "thought" as const,
    sourceLabel: "Tiny Thought",
    title: formatThoughtTitle(thought.category),
    body: trimAmbientText(thought.content, 185),
    meta: formatThoughtMeta(thought),
    href: absoluteUrl("/tiny-thoughts"),
    actionLabel: "Browse tiny thoughts",
    aside: thought.inspiredBy
      ? `Inspired by ${thought.inspiredBy}. Tiny Thoughts are the quickest pulse in the site: small scraps of weather, feeling, humor, and overheard life that never needed to become essays.`
      : "Tiny Thoughts are the quickest pulse in the site: observations, feelings, little jokes, and scraps of weather that did not need to become essays.",
  }));

  const catSignals = [
    {
      id: "cat-beverly-lucinda",
      kind: "cat" as const,
      sourceLabel: "Cat Room",
      title: "Beverly and Lucinda",
      body:
        "Tiny chaos professionals from the current crew: ping pong balls, Churu, bed visits, and suspiciously meaningful eye contact.",
      meta: "From the Beverly and Lucinda room",
      href: absoluteUrl("/cats/beverly-and-lucinda"),
      actionLabel: "Visit the current cat room",
      aside:
        "The cat rooms give Ambient some warmth on purpose. They make the screen feel inhabited instead of merely updated.",
      imageSrc: beverlyAndLucindaPhotos[5]?.src ?? beverlyAndLucindaPhotos[0]?.src,
      imageAlt: beverlyAndLucindaPhotos[5]?.alt ?? beverlyAndLucindaPhotos[0]?.alt,
    },
    {
      id: "cat-thomas-orbit",
      kind: "cat" as const,
      sourceLabel: "Memory Room",
      title: "Thomas, Jones, Missy, and Cass",
      body:
        "A longer cat orbit from 2016 to 2025, with companionship, grief, older photos, and the kind of memories that soften a room.",
      meta: "From the Thomas, Jones, Missy, and Cass room",
      href: absoluteUrl("/cats/thomas-jones-missy-cass"),
      actionLabel: "Visit the memory room",
      aside:
        "Not every signal here needs to be present-tense. Some of the best ambient material is memory with enough space around it.",
      imageSrc: thomasJonesMissyCassPhotos[41]?.src ?? thomasJonesMissyCassPhotos[0]?.src,
      imageAlt: thomasJonesMissyCassPhotos[41]?.alt ?? thomasJonesMissyCassPhotos[0]?.alt,
    },
  ];

  const projectSignals = input.projects.slice(0, 2).map((project) => ({
    id: `project-${project.id}`,
    kind: "project" as const,
    sourceLabel: "Project",
    title: project.title,
    body: trimAmbientText(project.description, 150),
    meta: formatProjectMeta(project),
    href: project.href ? absoluteUrl(project.href) : absoluteUrl("/#projects"),
    actionLabel: project.href?.startsWith("/") ? "Open project" : "Visit project",
    aside:
      project.nextAction && project.nextAction.toLowerCase() !== "none"
        ? `Next move: ${trimAmbientText(project.nextAction, 110)}`
        : "Projects give Ambient a longer heartbeat: active experiments, half-built worlds, and useful work still in motion.",
  }));

  const writingSignals = input.writings.slice(0, 2).map((writing) => ({
    id: `writing-${writing.slug}`,
    kind: "writing" as const,
    sourceLabel: "Writing",
    title: writing.title,
    body: trimAmbientText(writing.description, 145),
    meta: formatWritingMeta(writing),
    href: absoluteUrl(`/writings/${writing.slug}`),
    actionLabel: "Read piece",
    aside:
      writing.related[0]?.reason
        ? trimAmbientText(writing.related[0].reason, 135)
        : "Writings slow the room down on purpose: memory, grief, attention, comedy, and trying again tomorrow.",
  }));

  const groups = [catSignals, thoughtSignals, projectSignals, writingSignals];
  const combined: Array<
    | (typeof catSignals)[number]
    | (typeof thoughtSignals)[number]
    | (typeof projectSignals)[number]
    | (typeof writingSignals)[number]
  > = [];
  const maxLength = Math.max(...groups.map((group) => group.length));

  for (let index = 0; index < maxLength; index += 1) {
    for (const group of groups) {
      const item = group[index];

      if (item) {
        combined.push(item);
      }
    }
  }

  return combined.map((signal) => {
    const selectedScene = selectAmbientSceneForSignal(signal, input.scenes);

    if (!selectedScene) {
      return signal;
    }

    return {
      ...signal,
      imageSrc: selectedScene.imageSrc,
      imageAlt: selectedScene.imageAlt,
    };
  });
}

function selectAmbientSignals(
  signals: ReturnType<typeof buildAmbientSignals>,
  query: AmbientQuery,
) {
  const requestedType = query.type?.trim().toLowerCase();
  const typeFiltered =
    requestedType === "thought" ||
    requestedType === "tiny-thought" ||
    requestedType === "cat" ||
    requestedType === "project" ||
    requestedType === "writing"
      ? signals.filter((signal) =>
          requestedType === "tiny-thought" ? signal.kind === "thought" : signal.kind === requestedType,
        )
      : signals;

  if (!typeFiltered.length) {
    return signals;
  }

  const requestedIndex = Number.parseInt(query.signal ?? "", 10);

  if (!Number.isFinite(requestedIndex)) {
    return typeFiltered;
  }

  const normalizedIndex = Math.max(0, Math.min(typeFiltered.length - 1, requestedIndex));

  return [typeFiltered[normalizedIndex]];
}

export default async function AmbientPage({
  searchParams,
}: {
  searchParams?: Promise<AmbientQuery>;
}) {
  const [thoughts, projects, sceneManifest] = await Promise.all([
    getPublicTinyThoughts(4).catch(() => []),
    getPublicProjects().catch(() => []),
    getAmbientSceneManifest(),
  ]);
  const query = (await searchParams) ?? {};
  const forcedTimeMode = normalizeAmbientTimeMode(query.time ?? query.mood);

  const signals = selectAmbientSignals(
    buildAmbientSignals({
      thoughts,
      projects,
      writings,
      scenes: sceneManifest.scenes,
    }),
    query,
  );

  return <AmbientDisplay signals={signals} forcedTimeMode={forcedTimeMode} />;
}
