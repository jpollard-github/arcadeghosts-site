"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const scopePrompt = `You are helping create a fixed-price project scope.

Client Problem:
[paste notes]

Generate:

1. Problem Statement
2. Goals
3. Deliverables
4. Out of Scope
5. Assumptions
6. Risks
7. Timeline
8. Acceptance Criteria
9. Fixed Price Recommendation
10. Change Request Rules`;

export function AdminSideHustle() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [status, setStatus] = useState("Checking admin session...");

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

      setStatus(
        data.authenticated
          ? "Copy the scope prompt and drop in your client notes."
          : "Sign in from the admin dashboard to use the Side Hustle tools.",
      );
    }

    loadSession().catch(() => setStatus("Side Hustle admin is temporarily unavailable."));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setStatus("Signed out.");
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(scopePrompt);
      setStatus("Scope prompt copied to the clipboard.");
    } catch {
      setStatus("Clipboard copy failed. You can still select and copy the prompt manually.");
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Side Hustle</h1>
          <p>
            A small prep station for the fixed-price inquiry flow on the Work
            With Me page, including a reusable ChatGPT scope prompt.
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
              <button type="button" onClick={handleLogout}>
                Log Out
              </button>
            </div>

            <div className="admin-entry-list">
              <article className="admin-entry">
                <div className="admin-entry-meta">
                  <span>Prompt</span>
                </div>
                <h2>ChatGPT Scope Document Prompt</h2>
                <p>
                  Paste rough client notes into the placeholder section, then
                  use the generated structure to turn an inquiry into a clear
                  fixed-price scope.
                </p>
                <label className="side-hustle-prompt">
                  <span>Copyable Prompt</span>
                  <textarea readOnly value={scopePrompt} aria-label="ChatGPT scope document prompt" />
                </label>
                <div className="admin-entry-actions">
                  <button type="button" onClick={handleCopyPrompt}>
                    Copy Prompt
                  </button>
                  <Link className="admin-action-link" href="/work-with-me">
                    Open Work With Me Page
                  </Link>
                </div>
              </article>
            </div>
          </>
        )}

        <p className="guestbook-status" aria-live="polite">
          {status}
        </p>
      </section>
    </main>
  );
}
