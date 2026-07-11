import { randomUUID } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import { musicInsights } from "../music-insights-data";
import { arcadeGames, visualMedia } from "../site-data";
import { writings } from "../writings";
import { getSiteSql } from "./database";
import { getContextRefreshProjects, projectPriorityOptions } from "./projects";
import {
  toTinyThought,
  type TinyThoughtRow,
} from "./tiny-thoughts";

export const contextRefreshVariants = [
  "concise",
  "full",
  "project",
  "dating-social",
  "dev-technical",
] as const;

export type ContextRefreshVariant = (typeof contextRefreshVariants)[number];

export type ContextRefreshExport = {
  id: string;
  filename: string;
  variant: ContextRefreshVariant;
  redacted: boolean;
  content: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  savedAt: string;
};

export type ContextRefreshExportRow = {
  id: string;
  filename: string;
  variant: ContextRefreshVariant;
  redacted: boolean;
  content: string;
  word_count: number;
  created_at: string;
  updated_at: string;
  saved_at: string | null;
};

export type ContextRefreshProfile = {
  id: string;
  name: string;
  preferredName: string;
  region: string;
  siteName: string;
  githubRepo: string;
  identitySummary: string;
  memoryCore: string[];
  longTermGoals: string[];
  currentPriorities: string[];
  activeSocialContext: string[];
  creativeThemes: string[];
  conversationPreferences: string[];
  additionalContext: string[];
  updatedAt: string;
};

export type ContextRefreshProfileRow = {
  id: string;
  name: string;
  preferred_name: string;
  region: string;
  site_name: string;
  github_repo: string;
  identity_summary: string;
  memory_core: string;
  long_term_goals: string;
  current_priorities: string;
  active_social_context: string;
  creative_themes: string;
  conversation_preferences: string;
  additional_context: string;
  updated_at: string;
};

export type ContextRefreshProfileInput = Omit<
  ContextRefreshProfile,
  "id" | "updatedAt"
>;

type TinyThoughtForExport = {
  category: string;
  content: string;
  inspiredByCategory: string;
  inspiredBy: string;
  createdAt: string;
};

const DEFAULT_CONTEXT_REFRESH_PROFILE_ID = "default";

const variantLabels: Record<ContextRefreshVariant, string> = {
  concise: "Export concise context",
  full: "Export full context",
  project: "Export project-specific context",
  "dating-social": "Export dating/social context",
  "dev-technical": "Export dev/technical context",
};

export const defaultContextRefreshProfile: ContextRefreshProfile = {
  id: DEFAULT_CONTEXT_REFRESH_PROFILE_ID,
  name: "Jason Pollard",
  preferredName: "Jason",
  region: "North Carolina Triad region",
  siteName: "ArcadeGhosts",
  githubRepo: "https://github.com/jpollard-github/arcadeghosts-site",
  identitySummary:
    "Software developer, ArcadeGhosts creator, writer, and curious generalist who likes building useful weird things.",
  memoryCore: [
    "Software developer",
    "Creator of ArcadeGhosts",
    "Writer and creative builder",
    "Values meaningful connection over shallow networking",
    "Prefers direct, practical advice",
    "Interested in psychology and self-reflection",
    "Enjoys Twin Peaks, arcade culture, cats, and 80s music",
    "Thomas died in 2025",
    "Often balances multiple simultaneous projects",
  ],
  longTermGoals: [
    "Build the ArcadeGhosts ecosystem into a durable creative home",
    "Develop writing projects that combine memory, myth, and personal reflection",
    "Keep making useful software and playful web experiments",
    "Improve social and dating life through real connection, not performance",
  ],
  currentPriorities: ["Build", "Write", "Socialize"],
  activeSocialContext: [
    "Recurring locations include Empourium and Fair Witness",
    "Prefers meaningful conversations over high-volume networking",
  ],
  creativeThemes: ["Connection", "Identity", "Nostalgia", "Resilience"],
  conversationPreferences: [
    "Be warm, practical, and direct",
    "Preserve Jason's voice in writing and messages",
    "Ask clarifying questions when stakes are personal or details are missing",
    "Avoid startup-theater language and generic motivational filler",
  ],
  additionalContext: [
    "Use current-state context rather than overfocusing on old timelines",
    "Project knowledge and notes can live outside ChatGPT memory when they get too detailed",
  ],
  updatedAt: "",
};

const redactionNote =
  "Sensitive details are intentionally omitted or generalized: exact addresses, passwords, private names, financial details, medical details, API keys, and anything that should not be pasted into a chat.";

export function countContextRefreshWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function isContextRefreshVariant(
  value: string,
): value is ContextRefreshVariant {
  return contextRefreshVariants.includes(value as ContextRefreshVariant);
}

export function normalizeContextRefreshContent(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function normalizeContextRefreshField(value: unknown, maxLength = 600) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function splitStoredLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeContextRefreshLineList(
  value: unknown,
  {
    maxItems = 12,
    maxLength = 240,
  }: {
    maxItems?: number;
    maxLength?: number;
  } = {},
) {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeContextRefreshField(item, maxLength))
      .filter(Boolean)
      .slice(0, maxItems);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((item) => normalizeContextRefreshField(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function linesToStorage(value: string[]) {
  return value.join("\n");
}

function withFallback(value: string[], fallback: string[]) {
  return value.length ? value : fallback;
}

export function normalizeContextRefreshProfileInput(
  value: unknown,
): ContextRefreshProfileInput {
  const source =
    value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    name:
      normalizeContextRefreshField(source.name, 120) ||
      defaultContextRefreshProfile.name,
    preferredName:
      normalizeContextRefreshField(source.preferredName, 120) ||
      defaultContextRefreshProfile.preferredName,
    region:
      normalizeContextRefreshField(source.region, 160) ||
      defaultContextRefreshProfile.region,
    siteName:
      normalizeContextRefreshField(source.siteName, 120) ||
      defaultContextRefreshProfile.siteName,
    githubRepo:
      normalizeContextRefreshField(source.githubRepo, 240) ||
      defaultContextRefreshProfile.githubRepo,
    identitySummary:
      normalizeContextRefreshField(source.identitySummary, 320) ||
      defaultContextRefreshProfile.identitySummary,
    memoryCore: withFallback(
      normalizeContextRefreshLineList(source.memoryCore, {
        maxItems: 12,
        maxLength: 180,
      }),
      defaultContextRefreshProfile.memoryCore,
    ),
    longTermGoals: withFallback(
      normalizeContextRefreshLineList(source.longTermGoals, {
        maxItems: 10,
        maxLength: 220,
      }),
      defaultContextRefreshProfile.longTermGoals,
    ),
    currentPriorities: withFallback(
      normalizeContextRefreshLineList(source.currentPriorities, {
        maxItems: 10,
        maxLength: 180,
      }),
      defaultContextRefreshProfile.currentPriorities,
    ),
    activeSocialContext: normalizeContextRefreshLineList(
      source.activeSocialContext,
      {
        maxItems: 10,
        maxLength: 220,
      },
    ),
    creativeThemes: withFallback(
      normalizeContextRefreshLineList(source.creativeThemes, {
        maxItems: 10,
        maxLength: 120,
      }),
      defaultContextRefreshProfile.creativeThemes,
    ),
    conversationPreferences: withFallback(
      normalizeContextRefreshLineList(source.conversationPreferences, {
        maxItems: 10,
        maxLength: 220,
      }),
      defaultContextRefreshProfile.conversationPreferences,
    ),
    additionalContext: normalizeContextRefreshLineList(source.additionalContext, {
      maxItems: 12,
      maxLength: 240,
    }),
  };
}

export function contextRefreshFilename(date = new Date()) {
  const stamp = date
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replace(/[:]/g, "-");

  return `${stamp}_ChatGPTContextRefresh.md`;
}

export function toContextRefreshExport(
  row: ContextRefreshExportRow,
): ContextRefreshExport {
  return {
    id: row.id,
    filename: row.filename,
    variant: row.variant,
    redacted: row.redacted,
    content: row.content,
    wordCount: row.word_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    savedAt: row.saved_at ?? "",
  };
}

export function toContextRefreshProfile(
  row: ContextRefreshProfileRow,
): ContextRefreshProfile {
  return {
    id: row.id,
    name: row.name,
    preferredName: row.preferred_name,
    region: row.region,
    siteName: row.site_name,
    githubRepo: row.github_repo,
    identitySummary: row.identity_summary,
    memoryCore: withFallback(
      splitStoredLines(row.memory_core),
      defaultContextRefreshProfile.memoryCore,
    ),
    longTermGoals: withFallback(
      splitStoredLines(row.long_term_goals),
      defaultContextRefreshProfile.longTermGoals,
    ),
    currentPriorities: withFallback(
      splitStoredLines(row.current_priorities),
      defaultContextRefreshProfile.currentPriorities,
    ),
    activeSocialContext: splitStoredLines(row.active_social_context),
    creativeThemes: withFallback(
      splitStoredLines(row.creative_themes),
      defaultContextRefreshProfile.creativeThemes,
    ),
    conversationPreferences: withFallback(
      splitStoredLines(row.conversation_preferences),
      defaultContextRefreshProfile.conversationPreferences,
    ),
    additionalContext: splitStoredLines(row.additional_context),
    updatedAt: row.updated_at,
  };
}

async function seedDefaultContextRefreshProfile() {
  const sql = getSiteSql();
  const profile = defaultContextRefreshProfile;

  await sql`
    INSERT INTO context_refresh_profiles (
      id,
      name,
      preferred_name,
      region,
      site_name,
      github_repo,
      identity_summary,
      memory_core,
      long_term_goals,
      current_priorities,
      active_social_context,
      creative_themes,
      conversation_preferences,
      additional_context
    )
    VALUES (
      ${profile.id},
      ${profile.name},
      ${profile.preferredName},
      ${profile.region},
      ${profile.siteName},
      ${profile.githubRepo},
      ${profile.identitySummary},
      ${linesToStorage(profile.memoryCore)},
      ${linesToStorage(profile.longTermGoals)},
      ${linesToStorage(profile.currentPriorities)},
      ${linesToStorage(profile.activeSocialContext)},
      ${linesToStorage(profile.creativeThemes)},
      ${linesToStorage(profile.conversationPreferences)},
      ${linesToStorage(profile.additionalContext)}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function getContextRefreshProfile() {
  await seedDefaultContextRefreshProfile();
  const sql = getSiteSql();
  const rows = await sql`
    SELECT
      id,
      name,
      preferred_name,
      region,
      site_name,
      github_repo,
      identity_summary,
      memory_core,
      long_term_goals,
      current_priorities,
      active_social_context,
      creative_themes,
      conversation_preferences,
      additional_context,
      updated_at
    FROM context_refresh_profiles
    WHERE id = ${DEFAULT_CONTEXT_REFRESH_PROFILE_ID}
    LIMIT 1
  `;

  if (!rows.length) {
    return defaultContextRefreshProfile;
  }

  return toContextRefreshProfile((rows as ContextRefreshProfileRow[])[0]);
}

export async function saveContextRefreshProfile(value: unknown) {
  const sql = getSiteSql();
  const profile = normalizeContextRefreshProfileInput(value);
  const rows = await sql`
    INSERT INTO context_refresh_profiles (
      id,
      name,
      preferred_name,
      region,
      site_name,
      github_repo,
      identity_summary,
      memory_core,
      long_term_goals,
      current_priorities,
      active_social_context,
      creative_themes,
      conversation_preferences,
      additional_context,
      updated_at
    )
    VALUES (
      ${DEFAULT_CONTEXT_REFRESH_PROFILE_ID},
      ${profile.name},
      ${profile.preferredName},
      ${profile.region},
      ${profile.siteName},
      ${profile.githubRepo},
      ${profile.identitySummary},
      ${linesToStorage(profile.memoryCore)},
      ${linesToStorage(profile.longTermGoals)},
      ${linesToStorage(profile.currentPriorities)},
      ${linesToStorage(profile.activeSocialContext)},
      ${linesToStorage(profile.creativeThemes)},
      ${linesToStorage(profile.conversationPreferences)},
      ${linesToStorage(profile.additionalContext)},
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET
      name = EXCLUDED.name,
      preferred_name = EXCLUDED.preferred_name,
      region = EXCLUDED.region,
      site_name = EXCLUDED.site_name,
      github_repo = EXCLUDED.github_repo,
      identity_summary = EXCLUDED.identity_summary,
      memory_core = EXCLUDED.memory_core,
      long_term_goals = EXCLUDED.long_term_goals,
      current_priorities = EXCLUDED.current_priorities,
      active_social_context = EXCLUDED.active_social_context,
      creative_themes = EXCLUDED.creative_themes,
      conversation_preferences = EXCLUDED.conversation_preferences,
      additional_context = EXCLUDED.additional_context,
      updated_at = now()
    RETURNING
      id,
      name,
      preferred_name,
      region,
      site_name,
      github_repo,
      identity_summary,
      memory_core,
      long_term_goals,
      current_priorities,
      active_social_context,
      creative_themes,
      conversation_preferences,
      additional_context,
      updated_at
  `;

  return toContextRefreshProfile((rows as ContextRefreshProfileRow[])[0]);
}

async function readWritingExcerpt(slug: string) {
  try {
    const file = await readFile(
      path.join(process.cwd(), "public", "writings", `${slug}.md`),
      "utf8",
    );

    return file.replace(/\*\*/g, "").replace(/\s+/g, " ").trim().slice(0, 280);
  } catch {
    return "";
  }
}

async function loadWritingSummaries() {
  return Promise.all(
    writings.map(async (writing) => ({
      ...writing,
      excerpt: await readWritingExcerpt(writing.slug),
      link: `/writings/${writing.slug}`,
    })),
  );
}

async function loadTinyThoughts() {
  try {
    const sql = getSiteSql();
    const rows = await sql`
      SELECT
        id,
        category,
        content,
        image_url,
        attachments,
        inspired_by_category,
        inspired_by,
        created_at,
        updated_at
      FROM tiny_thoughts
      ORDER BY created_at DESC
      LIMIT 3
    `;

    return (rows as TinyThoughtRow[]).map(toTinyThought).map(
      (thought): TinyThoughtForExport => ({
        category: thought.category,
        content: thought.content,
        inspiredByCategory: thought.inspiredByCategory,
        inspiredBy: thought.inspiredBy,
        createdAt: thought.createdAt,
      }),
    );
  } catch {
    return [];
  }
}

function listItems(items: string[]) {
  if (!items.length) {
    return "- None listed";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function yamlList(label: string, items: string[]) {
  return [label, ...items.map((item) => `  - ${item}`)];
}

function projectPriorityLabel(value: number) {
  return (
    projectPriorityOptions.find((priority) => priority.value === value)
      ?.label ?? `Priority ${value}`
  );
}

function projectBlockerSummary(value: string) {
  const blockers = value
    .split("\n")
    .map((blocker) => blocker.trim())
    .filter(Boolean);

  if (!blockers.length) {
    return "";
  }

  return `- Blockers: ${blockers.join("; ")}`;
}

function frontMatter({
  generatedAt,
  variant,
  redacted,
  profile,
  activeProjects,
}: {
  generatedAt: Date;
  variant: ContextRefreshVariant;
  redacted: boolean;
  profile: ContextRefreshProfile;
  activeProjects: string[];
}) {
  return [
    "---",
    `generated_at: ${generatedAt.toISOString()}`,
    `user: ${profile.name}`,
    `preferred_name: ${profile.preferredName}`,
    `purpose: ChatGPT context refresh`,
    `privacy_level: ${redacted ? "personal_redacted" : "personal"}`,
    `export_type: ${variant}`,
    `redacted: ${redacted}`,
    ...yamlList(
      "current_focus:",
      profile.currentPriorities.slice(0, 5),
    ),
    ...yamlList("active_projects:", activeProjects.slice(0, 6)),
    ...yamlList("themes:", profile.creativeThemes.slice(0, 6)),
    ...yamlList(
      "conversation_style:",
      profile.conversationPreferences.slice(0, 4),
    ),
    "---",
  ].join("\n");
}

function variantGuidance(variant: ContextRefreshVariant) {
  switch (variant) {
    case "project":
      return "Use this export primarily for project planning, product thinking, writing implementation, and continuity across active work.";
    case "dating-social":
      return "Use this export primarily for dating, social advice, self-understanding, communication style, and emotional pattern recognition.";
    case "dev-technical":
      return "Use this export primarily for coding help, architecture, repo context, implementation decisions, and developer workflow.";
    case "full":
      return "Use this export when a deeper refresh is useful and the conversation can absorb richer current-state context.";
    case "concise":
    default:
      return "Use this export as the default lightweight refresh before advice, writing, planning, or technical help.";
  }
}

function includeForVariant(
  variant: ContextRefreshVariant,
  section:
    | "projects"
    | "social"
    | "technical"
    | "creative"
    | "website"
    | "tiny-thoughts",
) {
  if (variant === "full" || variant === "concise") {
    return true;
  }

  if (variant === "project") {
    return (
      section === "projects" ||
      section === "technical" ||
      section === "creative" ||
      section === "website"
    );
  }

  if (variant === "dating-social") {
    return (
      section === "social" ||
      section === "creative" ||
      section === "website" ||
      section === "tiny-thoughts"
    );
  }

  return (
    section === "projects" ||
    section === "technical" ||
    section === "website"
  );
}

function websiteSignalLines({
  profile,
  writingSummaries,
  tinyThoughts,
}: {
  profile: ContextRefreshProfile;
  writingSummaries: Array<{
    title: string;
    excerpt: string;
    link: string;
  }>;
  tinyThoughts: TinyThoughtForExport[];
}) {
  const lines = [
    "## Website Signals",
    `- Public site hub: ${profile.siteName}. The tone blends portfolio work, writing, nostalgia, Twin Peaks atmosphere, cats, music, arcade culture, and playful developer experiments.`,
    `- Writings currently featured: ${writingSummaries
      .slice(0, 3)
      .map((writing) => writing.title)
      .join(", ")}.`,
    `- Music page snapshot: ${musicInsights.summary.totalHours} listening hours across ${musicInsights.summary.totalStreams} plays, with peak year ${musicInsights.summary.peakYear}.`,
    `- Favorite arcade signals surfaced on the site: ${arcadeGames
      .slice(0, 4)
      .map((game) => game.title)
      .join(", ")}.`,
    `- Favorite movie/TV signals surfaced on the site: ${visualMedia
      .slice(0, 4)
      .map((item) => item.title)
      .join(", ")}.`,
  ];

  if (tinyThoughts.length) {
    lines.push(
      `- Recent Tiny Thoughts energy: ${tinyThoughts
        .map((thought) => `${thought.category}: ${thought.content}`)
        .join(" | ")}`,
    );
  }

  lines.push("");
  return lines;
}

export async function buildContextRefreshContent({
  variant,
  redacted,
}: {
  variant: ContextRefreshVariant;
  redacted: boolean;
}) {
  const generatedAt = new Date();
  const profile = await getContextRefreshProfile();
  const writingSummaries = await loadWritingSummaries();
  const tinyThoughts = await loadTinyThoughts();
  const projects = await getContextRefreshProjects();
  const activeProjects = projects.map((project) => project.title);
  const lines: string[] = [
    frontMatter({
      generatedAt,
      variant,
      redacted,
      profile,
      activeProjects,
    }),
    "",
    "# Context Export",
    "",
    `Generated for ${profile.preferredName} from ${profile.siteName}. Export mode: ${variantLabels[variant]}.`,
    "",
    "## How To Use This",
    `- ${variantGuidance(variant)}`,
    "- Treat this as a current-state operating manual, not a full autobiography.",
    "- The Memory Core section is the durable stuff. The Current Context sections are the things most likely to change.",
    `- ${redacted ? redactionNote : "This export may include personal context. Do not include passwords, API keys, private addresses, or details that should not be pasted into a chat."}`,
    "",
    "## Memory Core",
    `- Identity summary: ${profile.identitySummary}`,
    listItems(profile.memoryCore),
    "",
  ];

  if (
    includeForVariant(variant, "projects") ||
    includeForVariant(variant, "social") ||
    includeForVariant(variant, "creative")
  ) {
    lines.push("## Current Context", "");
  }

  if (includeForVariant(variant, "projects")) {
    lines.push("### Active Projects");

    if (projects.length) {
      lines.push(
        "",
        ...projects.flatMap((project) =>
          [
            `#### ${project.title}`,
            `- Type: ${project.type}`,
            `- Status: ${project.status}`,
            `- Priority: ${projectPriorityLabel(project.priority)}`,
            `- Description: ${project.description}`,
            project.phase ? `- Current phase: ${project.phase}` : "",
            project.nextAction && project.nextAction !== "None"
              ? `- Next action: ${project.nextAction}`
              : "",
            projectBlockerSummary(project.blockers),
            project.href ? `- Link: ${project.href}` : "",
            "",
          ].filter(Boolean),
        ),
      );
    } else {
      lines.push("", "- No projects are currently marked for context refresh.", "");
    }

    lines.push("### Current Priorities", listItems(profile.currentPriorities), "");
  }

  if (includeForVariant(variant, "social")) {
    lines.push("### Active Social Context", listItems(profile.activeSocialContext), "");
  }

  if (includeForVariant(variant, "creative")) {
    lines.push("### Creative Direction", listItems(profile.creativeThemes), "");
  }

  if (includeForVariant(variant, "technical")) {
    lines.push(
      "## Technical Context",
      `- Main repo: ${profile.githubRepo}`,
      "- Stack: Next.js App Router, React, TypeScript, Neon Postgres, Vercel Blob, and Vercel hosting.",
      "- Active admin-managed public content includes projects and Tiny Thoughts.",
      "- Preferred implementation style: pragmatic changes, close fit with the existing repo, careful verification, and useful automation without overbuilding.",
      "",
    );
  }

  if (includeForVariant(variant, "website")) {
    lines.push(
      ...websiteSignalLines({
        profile,
        writingSummaries,
        tinyThoughts,
      }),
    );
  }

  lines.push(
    "## Long-Term Goals",
    listItems(profile.longTermGoals),
    "",
    "## Conversation Preferences",
    listItems(profile.conversationPreferences),
    "",
  );

  if (profile.additionalContext.length) {
    lines.push(
      "## Additional Context",
      listItems(profile.additionalContext),
      "",
    );
  }

  if (includeForVariant(variant, "tiny-thoughts") && tinyThoughts.length) {
    lines.push(
      "## Recent Tiny Thoughts",
      "",
      ...tinyThoughts.flatMap((thought) =>
        [
          `- ${thought.content}`,
          thought.inspiredBy
            ? `  Inspired by ${thought.inspiredByCategory}: ${thought.inspiredBy}`
            : "",
        ].filter(Boolean),
      ),
      "",
    );
  }

  lines.push(
    "## Maintenance Notes",
    "- ChatGPT Memory should hold only durable facts that improve conversations over long periods.",
    "- This export should stay focused on what matters now: active projects, priorities, social context, themes, and current direction.",
    "- Project knowledge, decisions, and raw notes can live in external knowledge systems instead of bloating the export.",
    "",
    "## Open Editing Notes",
    "- Update new decisions, priorities, and active social context before using this in a new chat.",
    "- Remove stale projects or themes rather than preserving every old version of the story.",
  );

  return lines
    .filter((line, index, all) => {
      return !(line === "" && all[index - 1] === "" && all[index - 2] === "");
    })
    .join("\n");
}

export async function createContextRefreshExport({
  variant,
  redacted,
}: {
  variant: ContextRefreshVariant;
  redacted: boolean;
}) {
  const content = await buildContextRefreshContent({ variant, redacted });
  const sql = getSiteSql();
  const rows = await sql`
    INSERT INTO context_refresh_exports (
      id,
      filename,
      variant,
      redacted,
      content,
      word_count
    )
    VALUES (
      ${randomUUID()},
      ${contextRefreshFilename()},
      ${variant},
      ${redacted},
      ${content},
      ${countContextRefreshWords(content)}
    )
    RETURNING
      id,
      filename,
      variant,
      redacted,
      content,
      word_count,
      created_at,
      updated_at,
      saved_at
  `;

  return toContextRefreshExport((rows as ContextRefreshExportRow[])[0]);
}
