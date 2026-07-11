export type AmbientSignalKind = "thought" | "cat" | "project" | "writing";

export type AmbientSignal = {
  id: string;
  kind: AmbientSignalKind;
  sourceLabel: string;
  title: string;
  body: string;
  meta: string;
  href: string;
  actionLabel: string;
  aside: string;
  imageSrc?: string;
  imageAlt?: string;
};

const ambientSignalBaseDwellMs: Record<AmbientSignalKind, number> = {
  thought: 17000,
  cat: 22000,
  project: 21000,
  writing: 23000,
};

function normalizeAmbientTextLength(value: string) {
  return value.replace(/\s+/g, " ").trim().length;
}

export function getAmbientSignalDwellMs(signal: Pick<AmbientSignal, "kind" | "body">) {
  const base = ambientSignalBaseDwellMs[signal.kind];

  if (signal.kind !== "thought") {
    return base;
  }

  const normalizedLength = normalizeAmbientTextLength(signal.body);
  const extraReadingMs = Math.min(7000, Math.max(0, normalizedLength - 72) * 38);

  return base + extraReadingMs;
}
