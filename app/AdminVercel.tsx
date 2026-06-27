"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const vercelLinks = [
  {
    eyebrow: "Project",
    title: "Main Project Overview",
    text: "Your main Vercel project home for deployments, usage, settings, and project-level controls.",
    href: "https://vercel.com/jpollardgithubs-projects/personal",
    cta: "Open Project Overview",
  },
  {
    eyebrow: "Analytics",
    title: "Web Analytics Dashboard",
    text: "Review the new custom events, page views, and visitor behavior for the public site.",
    href: "https://vercel.com/jpollardgithubs-projects/personal/analytics",
    cta: "Open Analytics",
  },
  {
    eyebrow: "Docs",
    title: "Analytics Limits And Pricing",
    text: "Reference current custom-event pricing constraints, including the two-property event limit.",
    href: "https://vercel.com/docs/analytics/limits-and-pricing",
    cta: "Open Analytics Limits Docs",
  },
  {
    eyebrow: "Docs",
    title: "AI Gateway",
    text: "The official AI Gateway docs for model routing, usage attribution, and future AI feature work.",
    href: "https://vercel.com/docs/ai-gateway",
    cta: "Open AI Gateway Docs",
  },
  {
    eyebrow: "Docs",
    title: "Pro Plan",
    text: "A quick reminder of what Pro adds beyond Hobby, especially around analytics and usage management.",
    href: "https://vercel.com/docs/plans/pro-plan",
    cta: "Open Pro Plan Docs",
  },
];

const analyticsChecks = [
  "Start Here card clicks: see which doorway people actually choose first.",
  "Search performed versus search result clicks: good for spotting whether people find useful things after searching.",
  "Project link clicks: a practical signal for which builds actually pull attention.",
  "Writing, Tiny Thoughts, and RSS clicks: useful for deciding whether to lean into essays, short-form, or subscription surfaces.",
  "Build log clicks: a quick way to tell whether visitors care about ongoing site evolution.",
  "Guestbook submissions: a small but meaningful sign of public engagement.",
];

const improvementLoops = [
  "If search volume is high but search-result clicks are low, improve synonyms, entry descriptions, or featured results.",
  "If one Start Here path dominates, make the other two clearer or sharper rather than assuming visitors naturally understand them.",
  "If project clicks are weak, tighten project card copy, images, and next-move framing.",
  "If build-log clicks are healthy, keep feeding the log because it is becoming a repeat-visit habit surface.",
  "If RSS clicks happen more than expected, investing in a steadier publishing rhythm likely pays off.",
];

const aiIdeas = [
  "Useful first: an AI site guide that helps visitors choose a room based on mood or interest and then links them to real pages.",
  "Useful first: a writing and build-log assistant for turning Content Inbox fragments into cleaner drafts, titles, summaries, and related links.",
  "Useful first: an AI-powered related-signals suggester that proposes cross-links between writings, projects, tiny thoughts, and fun rooms before publishing.",
  "Useful later: a conversational search layer that answers with links and short summaries instead of only keyword results.",
  "Fun later: a Signal Booth-style AI oracle that recommends a page, song, cat room, or strange corner in the voice of the site.",
  "Fun later: a build-log or updates remixer that turns recent work into a playful changelog blurb for the homepage.",
];

export function AdminVercel() {
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
          ? "Use this page as a Vercel control room and review checklist."
          : "Sign in from the admin dashboard to open the Vercel control room.",
      );
    }

    loadSession().catch(() => setStatus("Vercel control room is temporarily unavailable."));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setStatus("Signed out.");
  }

  return (
    <main className="admin-page">
      <section className="admin-shell content-inbox-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Vercel Control Room</h1>
          <p>
            A small private launchpad for Vercel analytics, project controls,
            Pro-plan follow-through, and what to watch now that custom events are live.
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

            <div className="admin-entry-list admin-dashboard-grid">
              {vercelLinks.map((item) => (
                <article className="admin-entry" key={item.href}>
                  <div className="admin-entry-meta">
                    <span>{item.eyebrow}</span>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                  <a
                    className="admin-action-link"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.cta}
                  </a>
                </article>
              ))}
            </div>

            <div className="admin-entry-list">
              <article className="admin-entry">
                <div className="admin-entry-meta">
                  <span>Watch First</span>
                </div>
                <h2>What to look at in analytics</h2>
                <ul className="admin-checklist">
                  {analyticsChecks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  Keep custom events lean: this site now normalizes and caps event
                  properties at two so the Vercel Analytics pricing constraints are respected.
                </p>
              </article>

              <article className="admin-entry">
                <div className="admin-entry-meta">
                  <span>Improve</span>
                </div>
                <h2>How to turn metrics into site improvements</h2>
                <ul className="admin-checklist">
                  {improvementLoops.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  The goal is not to maximize clicks blindly. The goal is to
                  learn which parts of the site are resonating and remove friction
                  from the paths that matter most.
                </p>
              </article>

              <article className="admin-entry">
                <div className="admin-entry-meta">
                  <span>AI Ideas</span>
                </div>
                <h2>Good uses for AI Gateway and a smaller OpenAI model</h2>
                <ul className="admin-checklist">
                  {aiIdeas.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  Before implementation, verify the current AI Gateway model ID in
                  the live Vercel docs or model list instead of hardcoding a guessed slug.
                </p>
                <p>
                  For the expanded follow-through list, see{" "}
                  <code>docs/Vercel-Pro-TODO.md</code>.
                </p>
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
