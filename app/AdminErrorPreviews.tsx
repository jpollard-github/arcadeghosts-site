"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function AdminErrorPreviews() {
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
          ? "Preview the custom 404 and 500 pages."
          : "Sign in from the admin dashboard to preview error pages.",
      );
    }

    loadSession().catch(() =>
      setStatus("Error preview admin is temporarily unavailable."),
    );
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setStatus("Signed out.");
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Error Previews</h1>
          <p>Open the surreal fallback pages without needing to trigger them by accident.</p>
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

            <div className="admin-entry-list admin-dashboard-grid">
              <article className="admin-entry">
                <div className="admin-entry-meta">
                  <span>Preview</span>
                </div>
                <h2>404 Page</h2>
                <p>
                  View the custom missing-page state with the Twin Peaks-style
                  copy and links.
                </p>
                <Link className="admin-action-link" href="/error-preview/not-found">
                  Open 404 Preview
                </Link>
              </article>
              <article className="admin-entry">
                <div className="admin-entry-meta">
                  <span>Preview</span>
                </div>
                <h2>500 Page</h2>
                <p>
                  Trigger the custom runtime error page and confirm the recovery
                  button still shows.
                </p>
                <Link className="admin-action-link" href="/error-preview/server-error">
                  Open 500 Preview
                </Link>
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
