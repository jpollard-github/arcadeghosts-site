"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type {
  ContextRefreshExport,
  ContextRefreshProfile,
  ContextRefreshVariant,
} from "./lib/context-refresh";

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function formatDate(value: string) {
  if (!value) {
    return "Not saved yet";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename || "ChatGPTContextRefresh.md";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

type ContextRefreshProfileDraft = {
  name: string;
  preferredName: string;
  region: string;
  siteName: string;
  githubRepo: string;
  identitySummary: string;
  memoryCore: string;
  longTermGoals: string;
  currentPriorities: string;
  activeSocialContext: string;
  creativeThemes: string;
  conversationPreferences: string;
  additionalContext: string;
};

function profileToDraft(profile: ContextRefreshProfile): ContextRefreshProfileDraft {
  return {
    name: profile.name,
    preferredName: profile.preferredName,
    region: profile.region,
    siteName: profile.siteName,
    githubRepo: profile.githubRepo,
    identitySummary: profile.identitySummary,
    memoryCore: profile.memoryCore.join("\n"),
    longTermGoals: profile.longTermGoals.join("\n"),
    currentPriorities: profile.currentPriorities.join("\n"),
    activeSocialContext: profile.activeSocialContext.join("\n"),
    creativeThemes: profile.creativeThemes.join("\n"),
    conversationPreferences: profile.conversationPreferences.join("\n"),
    additionalContext: profile.additionalContext.join("\n"),
  };
}

function emptyProfileDraft(): ContextRefreshProfileDraft {
  return {
    name: "",
    preferredName: "",
    region: "",
    siteName: "",
    githubRepo: "",
    identitySummary: "",
    memoryCore: "",
    longTermGoals: "",
    currentPriorities: "",
    activeSocialContext: "",
    creativeThemes: "",
    conversationPreferences: "",
    additionalContext: "",
  };
}

function draftEqualsProfile(
  draft: ContextRefreshProfileDraft,
  profile: ContextRefreshProfile | null,
) {
  if (!profile) {
    return false;
  }

  return JSON.stringify(draft) === JSON.stringify(profileToDraft(profile));
}

export function AdminContextRefresh() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [currentExport, setCurrentExport] = useState<ContextRefreshExport | null>(null);
  const [currentProfile, setCurrentProfile] = useState<ContextRefreshProfile | null>(null);
  const [profileDraft, setProfileDraft] = useState<ContextRefreshProfileDraft>(
    emptyProfileDraft(),
  );
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [variant, setVariant] = useState<ContextRefreshVariant>("concise");
  const [redacted, setRedacted] = useState(true);
  const [status, setStatus] = useState("Checking admin session...");
  const [savedNoticeVisible, setSavedNoticeVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const wordCount = useMemo(() => countWords(content), [content]);
  const isDirty = Boolean(currentExport) && content !== savedContent;
  const profileDirty = !draftEqualsProfile(profileDraft, currentProfile);
  const overLimit = wordCount > 5000;

  useEffect(() => {
    async function loadContextRefreshState() {
      const response = await fetch("/api/admin/context-refresh");
      const data = (await response.json()) as {
        export?: ContextRefreshExport | null;
        profile?: ContextRefreshProfile;
        variants?: ContextRefreshVariant[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load context refresh tools.");
      }

      setCurrentExport(data.export ?? null);
      setContent(data.export?.content ?? "");
      setSavedContent(data.export?.content ?? "");
      setCurrentProfile(data.profile ?? null);
      setProfileDraft(data.profile ? profileToDraft(data.profile) : emptyProfileDraft());
      setStatus(
        data.export
          ? "Loaded the latest export and static profile."
          : "Update your static profile or create a new context refresh export.",
      );
    }

    async function loadSession() {
      const response = await fetch("/api/admin/session");
      const data = (await response.json()) as {
        authenticated: boolean;
        configured: boolean;
      };

      setAuthenticated(data.authenticated);
      setConfigured(data.configured);

      if (!data.configured) {
        setStatus("Admin authentication is not configured.");
        return;
      }

      if (!data.authenticated) {
        setStatus("Sign in from the admin dashboard to manage context exports.");
        return;
      }

      await loadContextRefreshState();
    }

    loadSession().catch(() =>
      setStatus("Context Refresh Export admin is temporarily unavailable."),
    );
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setCurrentExport(null);
    setCurrentProfile(null);
    setProfileDraft(emptyProfileDraft());
    setContent("");
    setSavedContent("");
    setStatus("Signed out.");
  }

  async function createExport(nextVariant = variant) {
    setBusy(true);
    setStatus("Creating context refresh export...");

    try {
      const response = await fetch("/api/admin/context-refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant: nextVariant, redacted }),
      });
      const data = (await response.json()) as {
        export?: ContextRefreshExport;
        error?: string;
      };

      if (!response.ok || !data.export) {
        throw new Error(data.error ?? "Unable to create context refresh export.");
      }

      setCurrentExport(data.export);
      setContent(data.export.content);
      setSavedContent(data.export.content);
      setVariant(data.export.variant);
      setRedacted(data.export.redacted);
      setStatus(
        "Context refresh export created from the saved static profile and site data.",
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create export.");
    } finally {
      setBusy(false);
    }
  }

  async function saveExport() {
    if (!currentExport) {
      setStatus("Create an export before saving.");
      return;
    }

    setBusy(true);
    setStatus("Saving context refresh export...");

    try {
      const response = await fetch("/api/admin/context-refresh", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentExport.id, content }),
      });
      const data = (await response.json()) as {
        export?: ContextRefreshExport;
        error?: string;
      };

      if (!response.ok || !data.export) {
        throw new Error(data.error ?? "Unable to save context refresh export.");
      }

      setCurrentExport(data.export);
      setContent(data.export.content);
      setSavedContent(data.export.content);
      setSavedNoticeVisible(true);
      setStatus("Saved!");
      window.setTimeout(() => setSavedNoticeVisible(false), 2200);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save export.");
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile() {
    setProfileBusy(true);
    setStatus("Saving static profile...");

    try {
      const response = await fetch("/api/admin/context-refresh", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileDraft),
      });
      const data = (await response.json()) as {
        profile?: ContextRefreshProfile;
        error?: string;
      };

      if (!response.ok || !data.profile) {
        throw new Error(data.error ?? "Unable to save static profile.");
      }

      setCurrentProfile(data.profile);
      setProfileDraft(profileToDraft(data.profile));
      setSavedNoticeVisible(true);
      setStatus("Static profile saved. New exports will use it.");
      window.setTimeout(() => setSavedNoticeVisible(false), 2200);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setProfileBusy(false);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell context-refresh-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Context Refresh Export</h1>
          <p>
            Keep a saved static profile for durable context, then generate a shorter
            current-state Markdown export from that profile plus useful website data.
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
              <button type="button" onClick={handleLogout} disabled={busy || profileBusy}>
                Log Out
              </button>
            </div>

            <section className="admin-login context-refresh-controls">
              <div className="context-refresh-profile-meta">
                <div>
                  <span>Static profile</span>
                  <strong>{formatDate(currentProfile?.updatedAt ?? "")}</strong>
                </div>
                <p className="admin-help">
                  Save durable information about yourself here. New exports use this plus current
                  project and website data.
                </p>
              </div>

              <div className="context-refresh-profile-grid">
                <label>
                  <span>Name</span>
                  <input
                    value={profileDraft.name}
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>Preferred Name</span>
                  <input
                    value={profileDraft.preferredName}
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        preferredName: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>General Region</span>
                  <input
                    value={profileDraft.region}
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        region: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>Site / Hub Name</span>
                  <input
                    value={profileDraft.siteName}
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        siteName: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="context-refresh-profile-wide">
                  <span>Main Repo Link</span>
                  <input
                    value={profileDraft.githubRepo}
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        githubRepo: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="context-refresh-profile-wide">
                  <span>Identity Summary</span>
                  <textarea
                    value={profileDraft.identitySummary}
                    spellCheck
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        identitySummary: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>Memory Core</span>
                  <small>One durable fact per line.</small>
                  <textarea
                    value={profileDraft.memoryCore}
                    spellCheck
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        memoryCore: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>Long-Term Goals</span>
                  <small>One goal per line.</small>
                  <textarea
                    value={profileDraft.longTermGoals}
                    spellCheck
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        longTermGoals: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>Current Priorities</span>
                  <small>One priority per line.</small>
                  <textarea
                    value={profileDraft.currentPriorities}
                    spellCheck
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        currentPriorities: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>Active Social Context</span>
                  <small>One note per line.</small>
                  <textarea
                    value={profileDraft.activeSocialContext}
                    spellCheck
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        activeSocialContext: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>Creative Themes</span>
                  <small>One theme per line.</small>
                  <textarea
                    value={profileDraft.creativeThemes}
                    spellCheck
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        creativeThemes: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>Conversation Preferences</span>
                  <small>One preference per line.</small>
                  <textarea
                    value={profileDraft.conversationPreferences}
                    spellCheck
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        conversationPreferences: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="context-refresh-profile-wide">
                  <span>Additional Context</span>
                  <small>Optional notes that should travel with the export.</small>
                  <textarea
                    value={profileDraft.additionalContext}
                    spellCheck
                    onChange={(event) =>
                      setProfileDraft((current) => ({
                        ...current,
                        additionalContext: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="admin-entry-actions">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={profileBusy || !profileDirty}
                >
                  {profileDirty ? "Save Static Profile" : "Static Profile Saved"}
                </button>
              </div>
            </section>

            <section className="admin-login context-refresh-controls">
              <label className="context-refresh-redaction">
                <input
                  type="checkbox"
                  checked={redacted}
                  onChange={(event) => setRedacted(event.target.checked)}
                />
                <span>Redact sensitive fields</span>
              </label>
              <p className="admin-help">
                Excludes or generalizes addresses, passwords, private names, financial details,
                medical details, API keys, and anything that should not be pasted into a chat.
              </p>
              <p className="context-refresh-profile-note">
                ChatGPT Memory should stay durable. This export is for current priorities,
                projects, themes, and other things that should refresh over time.
              </p>
              <div className="context-refresh-create-grid">
                <button
                  type="button"
                  onClick={() => {
                    setVariant("concise");
                    createExport("concise");
                  }}
                  disabled={busy || profileBusy}
                >
                  <strong>Create ChatGPT Context Refresh File</strong>
                </button>
              </div>
            </section>

            {currentExport ? (
              <section className="admin-login context-refresh-editor">
                <div className="context-refresh-filebar">
                  <div>
                    <span>File</span>
                    <strong>{currentExport.filename}</strong>
                  </div>
                  <div>
                    <span>Saved</span>
                    <strong>{formatDate(currentExport.savedAt)}</strong>
                  </div>
                  <div>
                    <span>Words</span>
                    <strong className={overLimit ? "context-refresh-warning" : ""}>
                      {wordCount}
                    </strong>
                  </div>
                </div>

                {overLimit ? (
                  <p className="context-refresh-warning">
                    Warning: this export is over 5000 words. You can save it for now, but it may
                    be too long for a clean ChatGPT refresh.
                  </p>
                ) : null}

                <label>
                  <span>Markdown + YAML front matter</span>
                  <textarea
                    value={content}
                    spellCheck
                    onChange={(event) => setContent(event.target.value)}
                  />
                </label>

                <div className="admin-entry-actions">
                  <button type="button" onClick={saveExport} disabled={busy || !content}>
                    {isDirty ? "Save File" : "Saved"}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadMarkdown(currentExport.filename, content)}
                    disabled={busy || !content}
                  >
                    Export
                  </button>
                </div>
              </section>
            ) : null}
          </>
        )}

        {savedNoticeVisible ? (
          <div className="context-refresh-toast" role="status" aria-live="polite">
            Saved!
          </div>
        ) : null}

        <p className="admin-status" aria-live="polite">
          {status}
        </p>
      </section>
    </main>
  );
}
