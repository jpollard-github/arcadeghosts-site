import type { Metadata } from "next";
import { AmbientDisplay } from "./AmbientDisplay";
import { getPublicNowItems } from "../lib/now";
import { getPublicTinyThoughts, type TinyThought } from "../lib/tiny-thoughts";
import { beverlyAndLucindaPhotos, thomasJonesMissyCassPhotos } from "../site-data";
import { absoluteUrl } from "../seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ambient",
  description:
    "A calm ambient display built from ArcadeGhosts signals: now cards, tiny thoughts, and cat rooms.",
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
};

function formatThoughtMeta(thought: TinyThought) {
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(thought.createdAt));

  return `${thought.category.replace(/-/g, " ")} • ${date}`;
}

function buildAmbientSignals(input: {
  nowItems: Awaited<ReturnType<typeof getPublicNowItems>>;
  thoughts: TinyThought[];
}) {
  const nowSignals = input.nowItems.slice(0, 3).map((item) => ({
    id: `now-${item.id}`,
    kind: "now" as const,
    sourceLabel: item.label,
    title: item.title,
    body: item.text,
    meta: "From the public Now stack",
    href: absoluteUrl("/#now"),
    actionLabel: "Open the now room",
    aside:
      "These are the practical little currents already glowing inside ArcadeGhosts: what is being built, practiced, and kept alive in public.",
  }));

  const thoughtSignals = input.thoughts.slice(0, 4).map((thought) => ({
    id: `thought-${thought.id}`,
    kind: "thought" as const,
    sourceLabel: "Tiny Thought",
    title: thought.content.length > 72 ? `${thought.content.slice(0, 69).trimEnd()}...` : thought.content,
    body: thought.inspiredBy
      ? `Inspired by ${thought.inspiredBy}.`
      : "A short signal from the counter: small enough to stay light, alive enough to keep.",
    meta: formatThoughtMeta(thought),
    href: absoluteUrl("/tiny-thoughts"),
    actionLabel: "Browse tiny thoughts",
    aside:
      "Tiny Thoughts are the quickest pulse in the whole site: observations, feelings, little jokes, and scraps of weather that did not need to become essays.",
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

  const groups = [catSignals, nowSignals, thoughtSignals];
  const combined: Array<(typeof catSignals)[number] | (typeof nowSignals)[number] | (typeof thoughtSignals)[number]> = [];
  const maxLength = Math.max(...groups.map((group) => group.length));

  for (let index = 0; index < maxLength; index += 1) {
    for (const group of groups) {
      const item = group[index];

      if (item) {
        combined.push(item);
      }
    }
  }

  return combined;
}

function selectAmbientSignals(
  signals: ReturnType<typeof buildAmbientSignals>,
  query: AmbientQuery,
) {
  const requestedType = query.type?.trim().toLowerCase();
  const typeFiltered =
    requestedType === "now" || requestedType === "thought" || requestedType === "tiny-thought" || requestedType === "cat"
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
  const [nowItems, thoughts] = await Promise.all([
    getPublicNowItems(),
    getPublicTinyThoughts(4).catch(() => []),
  ]);
  const query = (await searchParams) ?? {};

  const signals = selectAmbientSignals(
    buildAmbientSignals({
      nowItems,
      thoughts,
    }),
    query,
  );

  return <AmbientDisplay signals={signals} />;
}
