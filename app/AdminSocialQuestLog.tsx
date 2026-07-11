"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  socialQuestTypes,
  type SocialQuestEntry,
  type SocialQuestStats,
  type SocialQuestType,
  type SocialQuestTypeTotal,
} from "./lib/social-quest-log";

type QuestForm = {
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
  tags: string;
};

type QuestLogResponse = {
  entries: SocialQuestEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: SocialQuestStats;
  typeTotals: SocialQuestTypeTotal[];
};

const typeLabels: Record<SocialQuestType, string> = {
  "singles-event": "Singles event",
  "discord-group": "Discord group",
  meetup: "Meetup",
  "class-workshop": "Class or workshop",
  "friend-hang": "Friend hang",
  "solo-outing": "Solo outing",
  other: "Other",
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function blankForm(): QuestForm {
  return {
    id: "",
    title: "",
    questType: "singles-event",
    eventName: "",
    location: "",
    occurredOn: today(),
    peopleMetCount: 0,
    conversationsCount: 0,
    confidenceBefore: 3,
    confidenceAfter: 3,
    conversationNotes: "",
    followUpIdeas: "",
    whatILearned: "",
    nextExperiment: "",
    victoryNote: "",
    tags: "",
  };
}

function toForm(entry: SocialQuestEntry): QuestForm {
  return {
    id: entry.id,
    title: entry.title,
    questType: entry.questType,
    eventName: entry.eventName,
    location: entry.location,
    occurredOn: entry.occurredOn,
    peopleMetCount: entry.peopleMetCount,
    conversationsCount: entry.conversationsCount,
    confidenceBefore: entry.confidenceBefore,
    confidenceAfter: entry.confidenceAfter,
    conversationNotes: entry.conversationNotes,
    followUpIdeas: entry.followUpIdeas,
    whatILearned: entry.whatILearned,
    nextExperiment: entry.nextExperiment,
    victoryNote: entry.victoryNote,
    tags: entry.tags.join(", "),
  };
}

function defaultStats(): SocialQuestStats {
  return {
    totalEntries: 0,
    totalPeopleMet: 0,
    averageConfidenceDelta: 0,
    growthEntries: 0,
  };
}

function excerpt(value: string, fallback: string) {
  if (!value.trim()) {
    return fallback;
  }

  return value.length > 180 ? `${value.slice(0, 177)}...` : value;
}

export function AdminSocialQuestLog() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [status, setStatus] = useState("Checking admin session...");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<QuestForm>(blankForm);
  const [entries, setEntries] = useState<SocialQuestEntry[]>([]);
  const [stats, setStats] = useState<SocialQuestStats>(defaultStats);
  const [typeTotals, setTypeTotals] = useState<SocialQuestTypeTotal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState("");

  const loadEntries = useCallback(async (nextPage: number, nextQuery: string, nextType: string) => {
    const params = new URLSearchParams();

    params.set("page", String(nextPage));

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    }

    if (nextType) {
      params.set("type", nextType);
    }

    const response = await fetch(`/api/admin/social-quest-log?${params.toString()}`);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? "Unable to load quest log entries.");
    }

    const data = (await response.json()) as QuestLogResponse;
    setEntries(data.entries);
    setStats(data.stats);
    setTypeTotals(data.typeTotals);
    setPage(data.page);
    setTotalPages(data.totalPages);
    setTotal(data.total);
    setSearchQuery(nextQuery);
    setSearchInput(nextQuery);
    setTypeFilter(nextType);
    setStatus(data.total ? "Quest log loaded." : "No quest log entries yet.");
  }, []);

  useEffect(() => {
    async function loadSession() {
      const response = await fetch("/api/admin/session");
      const data = (await response.json()) as {
        authenticated: boolean;
        configured: boolean;
      };

      setAuthenticated(data.authenticated);
      setConfigured(data.configured);

      if (!data.configured) {
        setStatus("ADMIN_USERNAME or ADMIN_PASSWORD is not configured.");
        return;
      }

      if (data.authenticated) {
        await loadEntries(1, "", "");
      } else {
        setStatus("Sign in from the admin dashboard to manage the Social Quest Log.");
      }
    }

    loadSession().catch(() => setStatus("Social Quest Log admin is temporarily unavailable."));
  }, [loadEntries]);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setEntries([]);
    setStatus("Signed out.");
  }

  function updateForm<K extends keyof QuestForm>(field: K, value: QuestForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setEditingId("");
    setForm(blankForm());
    setStatus("Ready for a new quest log entry.");
  }

  async function saveEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus(editingId ? "Updating quest log entry..." : "Saving quest log entry...");

    try {
      const response = await fetch("/api/admin/social-quest-log", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          id: editingId,
          tags: form.tags,
        }),
      });
      const data = (await response.json()) as {
        entry?: SocialQuestEntry;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save quest log entry.");
      }

      resetForm();

      if (editingId) {
        await loadEntries(page, searchQuery, typeFilter);
        setStatus("Quest log entry updated.");
      } else {
        await loadEntries(1, "", "");
        setStatus("Quest log entry saved.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save quest log entry.");
    } finally {
      setBusy(false);
    }
  }

  function editEntry(entry: SocialQuestEntry) {
    setEditingId(entry.id);
    setForm(toForm(entry));
    setStatus(`Editing ${entry.title}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteEntry(id: string, title: string) {
    const confirmed = window.confirm(`Delete "${title}" from the quest log?`);

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setStatus("Deleting quest log entry...");

    try {
      const response = await fetch("/api/admin/social-quest-log", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete quest log entry.");
      }

      if (editingId === id) {
        resetForm();
      }

      const nextPage = page > 1 && entries.length === 1 ? page - 1 : page;
      await loadEntries(nextPage, searchQuery, typeFilter);
      setStatus("Quest log entry deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete quest log entry.");
    } finally {
      setBusy(false);
    }
  }

  async function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("Filtering quest log...");

    try {
      await loadEntries(1, searchInput, typeFilter);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to filter quest log.");
    } finally {
      setBusy(false);
    }
  }

  async function goToPage(nextPage: number) {
    setBusy(true);
    setStatus("Loading another page...");

    try {
      await loadEntries(nextPage, searchQuery, typeFilter);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to change pages.");
    } finally {
      setBusy(false);
    }
  }

  async function clearFilters() {
    setBusy(true);
    setStatus("Clearing filters...");

    try {
      setSearchInput("");
      setTypeFilter("");
      await loadEntries(1, "", "");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to clear filters.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell projects-admin-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Social Quest Log</h1>
          <p>
            Log social reps like a gentle quest journal: what you tried, what shifted,
            and what you want to test next. Keep it growth-focused and leave names out.
          </p>
        </div>

        {!authenticated ? (
          <div className="admin-login">
            <p>This page requires an active admin session.</p>
            <Link className="admin-action-link" href="/admin" aria-disabled={!configured}>
              Open Admin Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="admin-toolbar">
              <button
                type="button"
                onClick={() => loadEntries(1, searchQuery, typeFilter)}
                disabled={busy}
              >
                Refresh
              </button>
              <button type="button" onClick={resetForm} disabled={busy}>
                New Entry
              </button>
              <button type="button" onClick={handleLogout} disabled={busy}>
                Log Out
              </button>
            </div>

            <form className="admin-entry social-quest-form" onSubmit={saveEntry}>
              <div className="admin-entry-meta">
                <span>{editingId ? "Edit quest" : "New quest"}</span>
              </div>

              <p className="social-quest-note">
                Note patterns, energy, and experiments rather than cataloging people.
              </p>

              <div className="projects-admin-form">
                <label>
                  <span>Quest Title</span>
                  <input
                    type="text"
                    value={form.title}
                    placeholder="Unlocked local singles night"
                    onChange={(event) => updateForm("title", event.target.value)}
                  />
                </label>
                <label>
                  <span>Quest Type</span>
                  <select
                    value={form.questType}
                    onChange={(event) =>
                      updateForm("questType", event.target.value as SocialQuestType)
                    }
                  >
                    {socialQuestTypes.map((type) => (
                      <option key={type} value={type}>
                        {typeLabels[type]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Event Or Group</span>
                  <input
                    type="text"
                    value={form.eventName}
                    placeholder="Thursday singles mixer"
                    onChange={(event) => updateForm("eventName", event.target.value)}
                  />
                </label>
                <label>
                  <span>Location</span>
                  <input
                    type="text"
                    value={form.location}
                    placeholder="East Village"
                    onChange={(event) => updateForm("location", event.target.value)}
                  />
                </label>
                <label>
                  <span>Date</span>
                  <input
                    type="date"
                    value={form.occurredOn}
                    onChange={(event) => updateForm("occurredOn", event.target.value)}
                  />
                </label>
                <label>
                  <span>Tags</span>
                  <input
                    type="text"
                    value={form.tags}
                    placeholder="showed-up, brave, awkward-then-better"
                    onChange={(event) => updateForm("tags", event.target.value)}
                  />
                </label>
                <label>
                  <span>People Met</span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={form.peopleMetCount}
                    onChange={(event) =>
                      updateForm("peopleMetCount", Number.parseInt(event.target.value || "0", 10))
                    }
                  />
                </label>
                <label>
                  <span>Conversations Started</span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={form.conversationsCount}
                    onChange={(event) =>
                      updateForm(
                        "conversationsCount",
                        Number.parseInt(event.target.value || "0", 10),
                      )
                    }
                  />
                </label>
                <label>
                  <span>Confidence Before</span>
                  <select
                    value={form.confidenceBefore}
                    onChange={(event) =>
                      updateForm("confidenceBefore", Number.parseInt(event.target.value, 10))
                    }
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Confidence After</span>
                  <select
                    value={form.confidenceAfter}
                    onChange={(event) =>
                      updateForm("confidenceAfter", Number.parseInt(event.target.value, 10))
                    }
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="projects-admin-wide">
                  <span>Conversation Notes</span>
                  <textarea
                    value={form.conversationNotes}
                    placeholder="Themes, moments, or patterns. No names needed."
                    onChange={(event) => updateForm("conversationNotes", event.target.value)}
                  />
                </label>
                <label className="projects-admin-wide">
                  <span>Follow-Up Ideas</span>
                  <textarea
                    value={form.followUpIdeas}
                    placeholder="Join the group Discord. Send a brief thanks. Return next week."
                    onChange={(event) => updateForm("followUpIdeas", event.target.value)}
                  />
                </label>
                <label className="projects-admin-wide">
                  <span>What I Learned</span>
                  <textarea
                    value={form.whatILearned}
                    placeholder="My nerves drop once I have one real conversation."
                    onChange={(event) => updateForm("whatILearned", event.target.value)}
                  />
                </label>
                <label className="projects-admin-wide">
                  <span>Next Social Experiment</span>
                  <textarea
                    value={form.nextExperiment}
                    placeholder="Start one conversation before getting a drink."
                    onChange={(event) => updateForm("nextExperiment", event.target.value)}
                  />
                </label>
                <label className="projects-admin-wide">
                  <span>Victory Note</span>
                  <input
                    type="text"
                    value={form.victoryNote}
                    placeholder="Boss defeated: stayed-home avoidance."
                    onChange={(event) => updateForm("victoryNote", event.target.value)}
                  />
                </label>
              </div>

              <div className="admin-entry-actions">
                <button type="submit" disabled={busy}>
                  {editingId ? "Save Quest" : "Log Quest"}
                </button>
                {editingId ? (
                  <button type="button" onClick={resetForm} disabled={busy}>
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </form>

            <section className="social-quest-stats-grid">
              <article className="admin-entry social-quest-stat-card">
                <div className="admin-entry-meta">
                  <span>Total quests</span>
                </div>
                <strong>{stats.totalEntries}</strong>
              </article>
              <article className="admin-entry social-quest-stat-card">
                <div className="admin-entry-meta">
                  <span>People met</span>
                </div>
                <strong>{stats.totalPeopleMet}</strong>
              </article>
              <article className="admin-entry social-quest-stat-card">
                <div className="admin-entry-meta">
                  <span>Avg confidence delta</span>
                </div>
                <strong>{stats.averageConfidenceDelta.toFixed(2)}</strong>
              </article>
              <article className="admin-entry social-quest-stat-card">
                <div className="admin-entry-meta">
                  <span>Confidence-up quests</span>
                </div>
                <strong>{stats.growthEntries}</strong>
              </article>
            </section>

            <form className="admin-entry social-quest-filterbar" onSubmit={applyFilters}>
              <label>
                <span>Search</span>
                <input
                  type="text"
                  value={searchInput}
                  placeholder="Search by title, event, lesson, or experiment"
                  onChange={(event) => setSearchInput(event.target.value)}
                />
              </label>
              <label>
                <span>Type</span>
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                >
                  <option value="">All quest types</option>
                  {socialQuestTypes.map((type) => (
                    <option key={type} value={type}>
                      {typeLabels[type]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="admin-entry-actions">
                <button type="submit" disabled={busy}>
                  Apply Filters
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    void clearFilters();
                  }}
                >
                  Clear
                </button>
              </div>
            </form>

            <div className="social-quest-type-totals">
              {typeTotals
                .filter((item) => item.total > 0)
                .map((item) => (
                  <span key={item.questType} className="projects-admin-badge">
                    {typeLabels[item.questType]}: {item.total}
                  </span>
                ))}
            </div>

            <div className="admin-entry-list projects-admin-list">
              {entries.map((entry) => {
                const confidenceDelta = entry.confidenceAfter - entry.confidenceBefore;

                return (
                  <article className="admin-entry projects-admin-card" key={entry.id}>
                    <div className="admin-entry-meta">
                      <span>{typeLabels[entry.questType]}</span>
                      <time dateTime={entry.occurredOn}>{entry.occurredOn}</time>
                    </div>

                    <div className="social-quest-card-grid">
                      <div className="projects-admin-summary-copy">
                        <h2 className="projects-admin-summary-title">{entry.title}</h2>
                        <p className="projects-admin-summary-subtitle">
                          {entry.eventName}
                          {entry.location ? ` • ${entry.location}` : ""}
                        </p>
                        <p className="projects-admin-summary-description">
                          {excerpt(
                            entry.whatILearned || entry.conversationNotes,
                            "Reflection still in progress.",
                          )}
                        </p>
                        <p className="social-quest-next-step">
                          {excerpt(
                            entry.nextExperiment,
                            "No next experiment saved yet.",
                          )}
                        </p>
                        <div className="projects-admin-badges">
                          <span className="projects-admin-badge">
                            Confidence {entry.confidenceBefore} → {entry.confidenceAfter}
                          </span>
                          <span
                            className={`projects-admin-badge ${
                              confidenceDelta > 0 ? "projects-admin-badge-alert" : ""
                            }`}
                          >
                            Delta {confidenceDelta >= 0 ? `+${confidenceDelta}` : confidenceDelta}
                          </span>
                          <span className="projects-admin-badge">
                            People met {entry.peopleMetCount}
                          </span>
                          <span className="projects-admin-badge">
                            Conversations {entry.conversationsCount}
                          </span>
                          {entry.tags.map((tag) => (
                            <span key={tag} className="projects-admin-badge">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        {entry.victoryNote ? (
                          <p className="social-quest-victory">{entry.victoryNote}</p>
                        ) : null}
                      </div>

                      <div className="admin-entry-actions projects-admin-actions">
                        <button type="button" disabled={busy} onClick={() => editEntry(entry)}>
                          Edit
                        </button>
                        <button
                          className="admin-danger"
                          type="button"
                          disabled={busy}
                          onClick={() => deleteEntry(entry.id, entry.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}

              {!entries.length ? (
                <article className="admin-entry">
                  <p>No quest log entries match this view yet.</p>
                </article>
              ) : null}
            </div>

            <div className="admin-toolbar social-quest-pagination">
              <span className="projects-admin-badge">
                Page {page} of {totalPages}
              </span>
              <span className="projects-admin-badge">{total} entries</span>
              <button type="button" disabled={busy || page <= 1} onClick={() => goToPage(page - 1)}>
                Previous
              </button>
              <button
                type="button"
                disabled={busy || page >= totalPages}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}

        <p className="admin-status" aria-live="polite">
          {status}
        </p>
      </section>
    </main>
  );
}
