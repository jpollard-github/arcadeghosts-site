import { promises as fs } from "node:fs";
import path from "node:path";

export const ambientSceneCategories = [
  "misty-forests",
  "moonlit-lakes",
  "night-skies",
  "cozy-desks",
  "arcade-glow",
  "crt-reflections",
  "rain-on-windows",
  "vinyl-headphones",
  "books-notebooks",
  "cat-silhouettes",
  "city-streets",
  "warm-lamps-shadows",
] as const;

export type AmbientSceneCategory = (typeof ambientSceneCategories)[number];
export type AmbientSceneBrightness = "dark" | "medium" | "light";
export type AmbientSceneTextOverlaySuitability = "excellent" | "good" | "poor";
export type AmbientScenePreferredUse = "background" | "side-panel" | "full-bleed";

export type AmbientScene = {
  id: string;
  category: AmbientSceneCategory;
  title: string;
  path: string;
  moodTags: string[];
  brightness: AmbientSceneBrightness;
  textOverlaySuitability: AmbientSceneTextOverlaySuitability;
  preferredUse: AmbientScenePreferredUse;
  weight: number;
  notes: string;
};

export type AmbientSceneCategorySummary = {
  id: AmbientSceneCategory;
  title: string;
  targetCount: number;
  description: string;
};

export type AmbientSceneManifest = {
  version: 1;
  library: "ambient-scene-library";
  lastUpdatedAt: string;
  categories: AmbientSceneCategorySummary[];
  scenes: AmbientScene[];
};

export type AmbientSceneCapableSignal = {
  id: string;
  kind: "thought" | "cat" | "writing";
  imageSrc?: string;
};

const ambientSceneManifestPath = path.join(process.cwd(), "public", "ambient", "scenes", "manifest.json");

const signalCategoryPreferences: Record<AmbientSceneCapableSignal["kind"], AmbientSceneCategory[]> = {
  thought: ["misty-forests", "moonlit-lakes", "night-skies", "warm-lamps-shadows", "rain-on-windows"],
  cat: ["cat-silhouettes", "warm-lamps-shadows"],
  writing: ["books-notebooks", "warm-lamps-shadows", "moonlit-lakes", "rain-on-windows", "night-skies"],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAmbientSceneCategory(value: unknown): value is AmbientSceneCategory {
  return typeof value === "string" && ambientSceneCategories.includes(value as AmbientSceneCategory);
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
}

function normalizeScene(scene: unknown): AmbientScene | null {
  if (!isRecord(scene)) {
    return null;
  }

  const id = typeof scene.id === "string" ? scene.id.trim() : "";
  const category = scene.category;
  const title = typeof scene.title === "string" ? scene.title.trim() : "";
  const scenePath = typeof scene.path === "string" ? scene.path.trim() : "";
  const brightness = scene.brightness;
  const textOverlaySuitability = scene.textOverlaySuitability;
  const preferredUse = scene.preferredUse;
  const weight = typeof scene.weight === "number" && Number.isFinite(scene.weight) ? scene.weight : 0;
  const notes = typeof scene.notes === "string" ? scene.notes.trim() : "";

  if (
    !id ||
    !isAmbientSceneCategory(category) ||
    !title ||
    !scenePath ||
    (brightness !== "dark" && brightness !== "medium" && brightness !== "light") ||
    (textOverlaySuitability !== "excellent" &&
      textOverlaySuitability !== "good" &&
      textOverlaySuitability !== "poor") ||
    (preferredUse !== "background" && preferredUse !== "side-panel" && preferredUse !== "full-bleed") ||
    weight <= 0
  ) {
    return null;
  }

  return {
    id,
    category,
    title,
    path: scenePath,
    moodTags: normalizeStringArray(scene.moodTags),
    brightness,
    textOverlaySuitability,
    preferredUse,
    weight,
    notes,
  };
}

export function normalizeAmbientSceneManifest(input: unknown): AmbientSceneManifest {
  if (!isRecord(input)) {
    return createEmptyAmbientSceneManifest();
  }

  const normalizedCategories = Array.isArray(input.categories)
    ? input.categories
        .map((entry) => {
          if (!isRecord(entry) || !isAmbientSceneCategory(entry.id)) {
            return null;
          }

          const title = typeof entry.title === "string" ? entry.title.trim() : "";
          const targetCount =
            typeof entry.targetCount === "number" && Number.isFinite(entry.targetCount) ? Math.max(0, entry.targetCount) : 0;
          const description = typeof entry.description === "string" ? entry.description.trim() : "";

          if (!title) {
            return null;
          }

          return {
            id: entry.id,
            title,
            targetCount,
            description,
          } satisfies AmbientSceneCategorySummary;
        })
        .filter((entry): entry is AmbientSceneCategorySummary => entry !== null)
    : defaultAmbientSceneCategories;

  const normalizedScenes = Array.isArray(input.scenes)
    ? input.scenes.map(normalizeScene).filter((scene): scene is AmbientScene => scene !== null)
    : [];

  return {
    version: 1,
    library: "ambient-scene-library",
    lastUpdatedAt: typeof input.lastUpdatedAt === "string" ? input.lastUpdatedAt : new Date(0).toISOString(),
    categories: normalizedCategories.length > 0 ? normalizedCategories : defaultAmbientSceneCategories,
    scenes: normalizedScenes,
  };
}

export function createEmptyAmbientSceneManifest(): AmbientSceneManifest {
  return {
    version: 1,
    library: "ambient-scene-library",
    lastUpdatedAt: new Date(0).toISOString(),
    categories: defaultAmbientSceneCategories,
    scenes: [],
  };
}

export async function getAmbientSceneManifest() {
  try {
    const raw = await fs.readFile(ambientSceneManifestPath, "utf8");
    return normalizeAmbientSceneManifest(JSON.parse(raw));
  } catch {
    return createEmptyAmbientSceneManifest();
  }
}

function toRelativeScenePath(scenePath: string) {
  return scenePath.startsWith("/") ? scenePath : `/${scenePath.replace(/^\/+/, "")}`;
}

function createStableIndex(key: string, length: number) {
  let hash = 0;

  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
  }

  return length > 0 ? hash % length : 0;
}

function sortScenesByWeight(scenes: AmbientScene[]) {
  return [...scenes].sort((left, right) => {
    if (right.weight !== left.weight) {
      return right.weight - left.weight;
    }

    return left.id.localeCompare(right.id);
  });
}

export function selectAmbientSceneForSignal(signal: AmbientSceneCapableSignal, scenes: AmbientScene[]) {
  if (signal.imageSrc || scenes.length === 0) {
    return null;
  }

  const preferredCategories = signalCategoryPreferences[signal.kind];
  const overlayFriendlyScenes = scenes.filter((scene) => scene.textOverlaySuitability !== "poor");
  const categoryMatches = overlayFriendlyScenes.filter((scene) => preferredCategories.includes(scene.category));
  const brightnessMatches = categoryMatches.filter((scene) => scene.brightness !== "light");
  const candidateScenes =
    brightnessMatches.length > 0
      ? brightnessMatches
      : categoryMatches.length > 0
        ? categoryMatches
        : overlayFriendlyScenes.length > 0
          ? overlayFriendlyScenes
          : scenes;

  const rankedScenes = sortScenesByWeight(candidateScenes);
  const selectedScene = rankedScenes[createStableIndex(signal.id, rankedScenes.length)];

  return selectedScene
    ? {
        imageSrc: toRelativeScenePath(selectedScene.path),
        imageAlt: selectedScene.title,
        scene: selectedScene,
      }
    : null;
}

const defaultAmbientSceneCategories: AmbientSceneCategorySummary[] = [
  {
    id: "misty-forests",
    title: "Misty Forests",
    targetCount: 4,
    description: "Quiet tree lines, damp fog, and low-contrast woodland depth that leaves room for reflective text.",
  },
  {
    id: "moonlit-lakes",
    title: "Moonlit Lakes",
    targetCount: 4,
    description: "Still water, moon paths, and soft shore silhouettes for slower memory and writing states.",
  },
  {
    id: "night-skies",
    title: "Night Skies",
    targetCount: 5,
    description: "Stars, dark gradients, and spacious celestial scenes that keep the room feeling open instead of busy.",
  },
  {
    id: "cozy-desks",
    title: "Cozy Desks",
    targetCount: 4,
    description: "Coffee, keyboards, lamps, and notebook corners that pair well with text-heavy signals.",
  },
  {
    id: "arcade-glow",
    title: "Arcade Glow",
    targetCount: 4,
    description: "Subtle cabinet rows, neon spill, and warm-magenta atmosphere without turning into a loud game poster.",
  },
  {
    id: "crt-reflections",
    title: "CRT Reflections",
    targetCount: 4,
    description: "Monitor glass, scanline mood, and dim reflections suited to haunted and tech-adjacent signals.",
  },
  {
    id: "rain-on-windows",
    title: "Rain On Windows",
    targetCount: 4,
    description: "Soft bokeh, wet glass, and urban weather for contemplative and low-stimulation states.",
  },
  {
    id: "vinyl-headphones",
    title: "Vinyl & Headphones",
    targetCount: 4,
    description: "Warm listening-room scenes that support music-adjacent cards without demanding too much attention.",
  },
  {
    id: "books-notebooks",
    title: "Books & Notebooks",
    targetCount: 4,
    description: "Paper, pens, and desk-night reading imagery that complements writing and thought states.",
  },
  {
    id: "cat-silhouettes",
    title: "Quiet Cat Silhouettes",
    targetCount: 4,
    description: "Indirect cat presence for non-cat cards when a touch of life helps without competing with the real cat rooms.",
  },
  {
    id: "city-streets",
    title: "Atmospheric City Streets",
    targetCount: 4,
    description: "Wet pavement, distant lights, and empty-night walking energy that stays calm enough for text overlays.",
  },
  {
    id: "warm-lamps-shadows",
    title: "Warm Lamps & Shadows",
    targetCount: 4,
    description: "Lamplight, corners, and negative space meant to make text-heavy Ambient cards feel inhabited.",
  },
];
