import { getSiteSql } from "./database";

export const socialQuestTypes = [
  "singles-event",
  "discord-group",
  "meetup",
  "class-workshop",
  "friend-hang",
  "solo-outing",
  "other",
] as const;

export type SocialQuestType = (typeof socialQuestTypes)[number];

export type SocialQuestEntry = {
  id: string;
  title: string;
  questType: SocialQuestType;
  eventName: string;
  location: string;
  occurredOn: string;
  peopleMetCount: number;
  conversationsCount: number;
  confidenceBefore: number;
  confidenceAfter: number;
  conversationNotes: string;
  followUpIdeas: string;
  whatILearned: string;
  nextExperiment: string;
  victoryNote: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type SocialQuestRow = {
  id: string;
  title: string;
  quest_type: SocialQuestType;
  event_name: string;
  location: string | null;
  occurred_on: string;
  people_met_count: number | string;
  conversations_count: number | string;
  confidence_before: number | string;
  confidence_after: number | string;
  conversation_notes: string | null;
  follow_up_ideas: string | null;
  what_i_learned: string | null;
  next_experiment: string | null;
  victory_note: string | null;
  tags: unknown;
  created_at: string;
  updated_at: string;
};

export type SocialQuestStats = {
  totalEntries: number;
  totalPeopleMet: number;
  averageConfidenceDelta: number;
  growthEntries: number;
};

export type SocialQuestTypeTotal = {
  questType: SocialQuestType;
  total: number;
};

export function isSocialQuestType(value: string): value is SocialQuestType {
  return socialQuestTypes.includes(value as SocialQuestType);
}

export function normalizeSocialQuestText(value: unknown, maxLength = 600) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, maxLength);
}

export function normalizeSocialQuestDate(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const candidate = value.trim();

  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : "";
}

export function normalizeSocialQuestCount(value: unknown, max = 99) {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.max(0, Math.min(max, Math.round(numeric)));
}

export function normalizeSocialQuestConfidence(value: unknown) {
  const normalized = normalizeSocialQuestCount(value, 5);
  return Math.max(1, normalized || 1);
}

export function normalizeSocialQuestTags(value: unknown) {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  const seen = new Set<string>();
  const tags: string[] = [];

  for (const item of values) {
    const normalized = normalizeSocialQuestText(item, 24)
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    tags.push(normalized);

    if (tags.length >= 8) {
      break;
    }
  }

  return tags;
}

export async function ensureSocialQuestLogTable() {
  const sql = getSiteSql();

  await sql`
    CREATE TABLE IF NOT EXISTS social_quest_log_entries (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
      quest_type TEXT NOT NULL CHECK (
        quest_type IN (
          'singles-event',
          'discord-group',
          'meetup',
          'class-workshop',
          'friend-hang',
          'solo-outing',
          'other'
        )
      ),
      event_name TEXT NOT NULL CHECK (char_length(event_name) BETWEEN 1 AND 140),
      location TEXT NOT NULL DEFAULT '',
      occurred_on DATE NOT NULL,
      people_met_count INTEGER NOT NULL DEFAULT 0 CHECK (people_met_count BETWEEN 0 AND 99),
      conversations_count INTEGER NOT NULL DEFAULT 0 CHECK (conversations_count BETWEEN 0 AND 99),
      confidence_before INTEGER NOT NULL DEFAULT 3 CHECK (confidence_before BETWEEN 1 AND 5),
      confidence_after INTEGER NOT NULL DEFAULT 3 CHECK (confidence_after BETWEEN 1 AND 5),
      conversation_notes TEXT NOT NULL DEFAULT '',
      follow_up_ideas TEXT NOT NULL DEFAULT '',
      what_i_learned TEXT NOT NULL DEFAULT '',
      next_experiment TEXT NOT NULL DEFAULT '',
      victory_note TEXT NOT NULL DEFAULT '',
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS social_quest_log_entries_occurred_on_idx
    ON social_quest_log_entries (occurred_on DESC, created_at DESC)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS social_quest_log_entries_quest_type_idx
    ON social_quest_log_entries (quest_type)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS social_quest_log_entries_created_at_idx
    ON social_quest_log_entries (created_at DESC)
  `;
}

export function toSocialQuestEntry(row: SocialQuestRow): SocialQuestEntry {
  return {
    id: row.id,
    title: row.title,
    questType: row.quest_type,
    eventName: row.event_name,
    location: row.location ?? "",
    occurredOn: row.occurred_on,
    peopleMetCount: Number(row.people_met_count) || 0,
    conversationsCount: Number(row.conversations_count) || 0,
    confidenceBefore: Number(row.confidence_before) || 1,
    confidenceAfter: Number(row.confidence_after) || 1,
    conversationNotes: row.conversation_notes ?? "",
    followUpIdeas: row.follow_up_ideas ?? "",
    whatILearned: row.what_i_learned ?? "",
    nextExperiment: row.next_experiment ?? "",
    victoryNote: row.victory_note ?? "",
    tags: normalizeSocialQuestTags(row.tags),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
