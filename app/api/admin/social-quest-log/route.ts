import { randomUUID } from "crypto";
import {
  jsonError,
  parseJsonBody,
  requireAdminJson,
  routeFailure,
} from "../../../lib/admin-route";
import { getSiteSql } from "../../../lib/database";
import {
  isSocialQuestType,
  normalizeSocialQuestConfidence,
  normalizeSocialQuestCount,
  normalizeSocialQuestDate,
  normalizeSocialQuestTags,
  normalizeSocialQuestText,
  socialQuestTypes,
  toSocialQuestEntry,
  type SocialQuestRow,
  type SocialQuestStats,
  type SocialQuestType,
  type SocialQuestTypeTotal,
} from "../../../lib/social-quest-log";

export const runtime = "nodejs";

const pageSize = 12;

type CountRow = { total: number | string };
type StatsRow = {
  total_entries: number | string | null;
  total_people_met: number | string | null;
  average_confidence_delta: number | string | null;
  growth_entries: number | string | null;
};
type TypeRow = { quest_type: SocialQuestType; total: number | string };

function getPayload(body: Record<string, unknown>) {
  const questType =
    typeof body.questType === "string" && isSocialQuestType(body.questType)
      ? body.questType
      : "other";

  return {
    title: normalizeSocialQuestText(body.title, 120),
    questType,
    eventName: normalizeSocialQuestText(body.eventName, 140),
    location: normalizeSocialQuestText(body.location, 120),
    occurredOn: normalizeSocialQuestDate(body.occurredOn),
    peopleMetCount: normalizeSocialQuestCount(body.peopleMetCount),
    conversationsCount: normalizeSocialQuestCount(body.conversationsCount),
    confidenceBefore: normalizeSocialQuestConfidence(body.confidenceBefore),
    confidenceAfter: normalizeSocialQuestConfidence(body.confidenceAfter),
    conversationNotes: normalizeSocialQuestText(body.conversationNotes, 1200),
    followUpIdeas: normalizeSocialQuestText(body.followUpIdeas, 1000),
    whatILearned: normalizeSocialQuestText(body.whatILearned, 1000),
    nextExperiment: normalizeSocialQuestText(body.nextExperiment, 1000),
    victoryNote: normalizeSocialQuestText(body.victoryNote, 240),
    tags: normalizeSocialQuestTags(body.tags),
  };
}

function validatePayload(payload: ReturnType<typeof getPayload>) {
  if (!payload.title) {
    return "Give this quest a short title.";
  }

  if (!payload.eventName) {
    return "Add the event, group, or outing you showed up for.";
  }

  if (!payload.occurredOn) {
    return "Choose the date for this quest log entry.";
  }

  return "";
}

function toStats(row?: StatsRow): SocialQuestStats {
  return {
    totalEntries: Number(row?.total_entries) || 0,
    totalPeopleMet: Number(row?.total_people_met) || 0,
    averageConfidenceDelta: Number(row?.average_confidence_delta) || 0,
    growthEntries: Number(row?.growth_entries) || 0,
  };
}

function toTypeTotals(rows: TypeRow[]): SocialQuestTypeTotal[] {
  const totals = new Map<SocialQuestType, number>();

  for (const type of socialQuestTypes) {
    totals.set(type, 0);
  }

  for (const row of rows) {
    totals.set(row.quest_type, Number(row.total) || 0);
  }

  return socialQuestTypes.map((questType) => ({
    questType,
    total: totals.get(questType) ?? 0,
  }));
}

export async function GET(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const sql = getSiteSql();
    const { searchParams } = new URL(request.url);
    const query = normalizeSocialQuestText(searchParams.get("q") ?? "", 80);
    const questType =
      typeof searchParams.get("type") === "string" &&
      isSocialQuestType(searchParams.get("type") ?? "")
        ? (searchParams.get("type") as SocialQuestType)
        : "";
    const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
    const offset = (page - 1) * pageSize;
    const pattern = `%${query}%`;

    const rows = await sql`
      SELECT
        id,
        title,
        quest_type,
        event_name,
        location,
        occurred_on::text,
        people_met_count,
        conversations_count,
        confidence_before,
        confidence_after,
        conversation_notes,
        follow_up_ideas,
        what_i_learned,
        next_experiment,
        victory_note,
        tags,
        created_at,
        updated_at
      FROM social_quest_log_entries
      WHERE (
        ${query === ""}
        OR title ILIKE ${pattern}
        OR event_name ILIKE ${pattern}
        OR location ILIKE ${pattern}
        OR conversation_notes ILIKE ${pattern}
        OR what_i_learned ILIKE ${pattern}
        OR next_experiment ILIKE ${pattern}
      )
      AND (${questType === ""} OR quest_type = ${questType})
      ORDER BY occurred_on DESC, created_at DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;

    const countRows = await sql`
      SELECT count(*)::int AS total
      FROM social_quest_log_entries
      WHERE (
        ${query === ""}
        OR title ILIKE ${pattern}
        OR event_name ILIKE ${pattern}
        OR location ILIKE ${pattern}
        OR conversation_notes ILIKE ${pattern}
        OR what_i_learned ILIKE ${pattern}
        OR next_experiment ILIKE ${pattern}
      )
      AND (${questType === ""} OR quest_type = ${questType})
    `;

    const statsRows = await sql`
      SELECT
        count(*)::int AS total_entries,
        COALESCE(sum(people_met_count), 0)::int AS total_people_met,
        COALESCE(round(avg(confidence_after - confidence_before)::numeric, 2), 0) AS average_confidence_delta,
        count(*) FILTER (WHERE confidence_after > confidence_before)::int AS growth_entries
      FROM social_quest_log_entries
      WHERE (
        ${query === ""}
        OR title ILIKE ${pattern}
        OR event_name ILIKE ${pattern}
        OR location ILIKE ${pattern}
        OR conversation_notes ILIKE ${pattern}
        OR what_i_learned ILIKE ${pattern}
        OR next_experiment ILIKE ${pattern}
      )
      AND (${questType === ""} OR quest_type = ${questType})
    `;

    const typeRows = await sql`
      SELECT quest_type, count(*)::int AS total
      FROM social_quest_log_entries
      WHERE (
        ${query === ""}
        OR title ILIKE ${pattern}
        OR event_name ILIKE ${pattern}
        OR location ILIKE ${pattern}
        OR conversation_notes ILIKE ${pattern}
        OR what_i_learned ILIKE ${pattern}
        OR next_experiment ILIKE ${pattern}
      )
      AND (${questType === ""} OR quest_type = ${questType})
      GROUP BY quest_type
      ORDER BY total DESC, quest_type ASC
    `;

    const total = Number((countRows as CountRow[])[0]?.total) || 0;

    return Response.json({
      entries: (rows as SocialQuestRow[]).map(toSocialQuestEntry),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      stats: toStats((statsRows as StatsRow[])[0]),
      typeTotals: toTypeTotals(typeRows as TypeRow[]),
    });
  } catch (error) {
    return routeFailure(
      "Admin social quest log GET failed",
      "Quest log entries are unavailable.",
      error,
    );
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const payload = getPayload(body);
    const error = validatePayload(payload);

    if (error) {
      return jsonError(error, 400);
    }

    const sql = getSiteSql();
    const rows = await sql`
      INSERT INTO social_quest_log_entries (
        id,
        title,
        quest_type,
        event_name,
        location,
        occurred_on,
        people_met_count,
        conversations_count,
        confidence_before,
        confidence_after,
        conversation_notes,
        follow_up_ideas,
        what_i_learned,
        next_experiment,
        victory_note,
        tags
      )
      VALUES (
        ${randomUUID()},
        ${payload.title},
        ${payload.questType},
        ${payload.eventName},
        ${payload.location},
        ${payload.occurredOn},
        ${payload.peopleMetCount},
        ${payload.conversationsCount},
        ${payload.confidenceBefore},
        ${payload.confidenceAfter},
        ${payload.conversationNotes},
        ${payload.followUpIdeas},
        ${payload.whatILearned},
        ${payload.nextExperiment},
        ${payload.victoryNote},
        ${JSON.stringify(payload.tags)}::jsonb
      )
      RETURNING
        id,
        title,
        quest_type,
        event_name,
        location,
        occurred_on::text,
        people_met_count,
        conversations_count,
        confidence_before,
        confidence_after,
        conversation_notes,
        follow_up_ideas,
        what_i_learned,
        next_experiment,
        victory_note,
        tags,
        created_at,
        updated_at
    `;

    return Response.json({
      ok: true,
      entry: toSocialQuestEntry((rows as SocialQuestRow[])[0]),
    });
  } catch (error) {
    return routeFailure(
      "Admin social quest log POST failed",
      "Quest log entry could not be saved.",
      error,
    );
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const id = typeof body.id === "string" ? body.id : "";
    const payload = getPayload(body);
    const error = validatePayload(payload);

    if (!id) {
      return jsonError("Missing quest log entry id.", 400);
    }

    if (error) {
      return jsonError(error, 400);
    }

    const sql = getSiteSql();
    const rows = await sql`
      UPDATE social_quest_log_entries
      SET
        title = ${payload.title},
        quest_type = ${payload.questType},
        event_name = ${payload.eventName},
        location = ${payload.location},
        occurred_on = ${payload.occurredOn},
        people_met_count = ${payload.peopleMetCount},
        conversations_count = ${payload.conversationsCount},
        confidence_before = ${payload.confidenceBefore},
        confidence_after = ${payload.confidenceAfter},
        conversation_notes = ${payload.conversationNotes},
        follow_up_ideas = ${payload.followUpIdeas},
        what_i_learned = ${payload.whatILearned},
        next_experiment = ${payload.nextExperiment},
        victory_note = ${payload.victoryNote},
        tags = ${JSON.stringify(payload.tags)}::jsonb,
        updated_at = now()
      WHERE id = ${id}
      RETURNING
        id,
        title,
        quest_type,
        event_name,
        location,
        occurred_on::text,
        people_met_count,
        conversations_count,
        confidence_before,
        confidence_after,
        conversation_notes,
        follow_up_ideas,
        what_i_learned,
        next_experiment,
        victory_note,
        tags,
        created_at,
        updated_at
    `;

    if (!rows.length) {
      return jsonError("Quest log entry was not found.", 404);
    }

    return Response.json({
      ok: true,
      entry: toSocialQuestEntry((rows as SocialQuestRow[])[0]),
    });
  } catch (error) {
    return routeFailure(
      "Admin social quest log PUT failed",
      "Quest log entry could not be updated.",
      error,
    );
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const id = typeof body.id === "string" ? body.id : "";

    if (!id) {
      return jsonError("Missing quest log entry id.", 400);
    }

    const sql = getSiteSql();
    const rows = await sql`
      DELETE FROM social_quest_log_entries
      WHERE id = ${id}
      RETURNING id
    `;

    if (!rows.length) {
      return jsonError("Quest log entry was not found.", 404);
    }

    return Response.json({ ok: true, deleted: true });
  } catch (error) {
    return routeFailure(
      "Admin social quest log DELETE failed",
      "Quest log entry could not be deleted.",
      error,
    );
  }
}
