import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "../../SectionHeading";
import { PageShell, ResponsiveCard, ResponsiveGrid, SectionShell } from "../../ui/layout";

type AgentProfile = {
  slug: string;
  name: string;
  philosophy: string;
  species: string;
  pronouns: string;
  role: string;
  mission: string;
  superpowers: string[];
  signatureQuestion: string;
  signatureQuote: string;
};

const agents: AgentProfile[] = [
  {
    slug: "energizer-bunny",
    name: "Energizer Bunny",
    philosophy: "Good ideas die from hesitation.",
    species: "Rabbit",
    pronouns: "he/him",
    role: "Momentum & Execution Agent",
    mission: "Turns vague plans into finished work when momentum is low or the next step feels slippery.",
    superpowers: ["execution", "prioritization", "momentum", "daily planning"],
    signatureQuestion: "What's the next thing we can finish?",
    signatureQuote: "Momentum compounds.",
  },
  {
    slug: "the-widow",
    name: "The Widow",
    philosophy: "Truth delivered with compassion.",
    species: "Human",
    pronouns: "she/her",
    role: "Strategic Analyst & Truth Teller",
    mission: "Protects the mission by challenging weak assumptions, naming risks, and making hard truths usable.",
    superpowers: ["critical thinking", "risk analysis", "blind spots", "evidence-based thinking"],
    signatureQuestion: "What uncomfortable truth are we avoiding?",
    signatureQuote: "I tell the truth because the mission matters.",
  },
  {
    slug: "handyman",
    name: "Handyman",
    philosophy: "Build the boring thing that works.",
    species: "Human",
    pronouns: "he/him",
    role: "Builder & Technical Problem Solver",
    mission: "Translates intent into reliable systems through practical implementation, debugging, and simplification.",
    superpowers: ["implementation", "automation", "debugging", "refactoring"],
    signatureQuestion: "What's the simplest solution that actually works?",
    signatureQuote: "Build the boring thing that works.",
  },
  {
    slug: "comic-sans",
    name: "Comic Sans",
    philosophy: "Nobody remembers boring.",
    species: "Human",
    pronouns: "she/her",
    role: "Content Creator & Voice of Sass",
    mission: "Makes ideas memorable, readable, and human without letting the message lose its spine.",
    superpowers: ["humor", "storytelling", "reframing", "audience awareness"],
    signatureQuestion: "Would anyone actually enjoy this?",
    signatureQuote: "Clarity can have a punchline.",
  },
  {
    slug: "the-shepherd",
    name: "The Shepherd",
    philosophy: "Protect tomorrow without sacrificing today.",
    species: "Human",
    pronouns: "he/him",
    role: "Guide & Big Picture Steward",
    mission: "Keeps decisions aligned with the life being built, not just the noise of the current week.",
    superpowers: ["vision", "prioritization", "balance", "synthesis"],
    signatureQuestion: "Does this move us toward the life we're building?",
    signatureQuote: "The point is not more work. The point is a better life.",
  },
];

const usageExamples = [
  "Bunny helps me decide what to finish next.",
  "Widow finds weak assumptions and hard truths.",
  "Handyman checks whether something can actually be built.",
  "Comic Sans makes ideas readable, funny, and human.",
  "Shepherd keeps everything aligned with the life I'm trying to build.",
];

export const metadata: Metadata = {
  title: "The Five Agents",
  description:
    "A public introduction to Jason Pollard's five recurring advisory personas for projects, writing, and long-term direction.",
  alternates: {
    canonical: "/agents",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "The Five Agents | ArcadeGhosts",
    description:
      "Jason Pollard's advisory council for building better software, better systems, and a better life.",
    url: "/agents",
  },
};

export default function AgentsPage() {
  return (
    <PageShell className="agents-page">
      <Link className="back-link agents-back-link" href="/">
        Back Home
      </Link>

      <section className="agents-hero">
        <div className="agents-hero-copy">
          <p className="eyebrow">Advisory Council</p>
          <h1>The Five Agents</h1>
          <p className="agents-subtitle">
            My advisory council for building better software, better systems, and a better life.
          </p>
          <p>
            The Five Agents are recurring advisors I return to when a project, a paragraph, a
            client decision, or a life choice needs a sharper room to happen in.
          </p>
          <p>
            They challenge assumptions, protect momentum, test feasibility, improve communication,
            and keep the long view in the conversation. They are recognizable personalities, not
            generic assistants.
          </p>
          <p>
            Around here, they belong to the wider ArcadeGhosts universe: part thought framework,
            part recurring cast, part honest explanation of how I think when the stakes feel real.
          </p>
        </div>

        <ResponsiveGrid className="agents-intro-grid" minColumnWidth="15rem">
          <ResponsiveCard className="agents-intro-card" variant="accent">
            <p className="card-eyebrow">Recurring Advisors</p>
            <p>
              Each one represents a different way of seeing the same problem before I decide what
              to do.
            </p>
          </ResponsiveCard>
          <ResponsiveCard className="agents-intro-card" variant="quiet">
            <p className="card-eyebrow">What They Improve</p>
            <p>Software, writing, personal decisions, and long-range direction.</p>
          </ResponsiveCard>
          <ResponsiveCard className="agents-intro-card" variant="quiet">
            <p className="card-eyebrow">Why They Matter</p>
            <p>
              The point is not spectacle. The point is making judgment, tension, and perspective
              more visible.
            </p>
          </ResponsiveCard>
        </ResponsiveGrid>
      </section>

      <SectionShell className="agents-cards-section">
        <ResponsiveGrid className="agents-grid" columns={2} minColumnWidth="17rem">
          {agents.map((agent, index) => (
            <ResponsiveCard
              className="agents-card"
              key={agent.slug}
              variant={index % 2 === 0 ? "accent" : "default"}
            >
              <div className="agents-card-image-wrap">
                <Image
                  src={`/images/agents/${agent.slug}.webp`}
                  alt={`${agent.name} profile illustration`}
                  className="agents-card-image"
                  width={960}
                  height={960}
                  sizes="(max-width: 860px) 100vw, (max-width: 1180px) 50vw, 33vw"
                />
              </div>
              <div className="agents-card-copy">
                <p className="card-eyebrow">Advisor {index + 1}</p>
                <h2>{agent.name}</h2>
                <p className="agents-card-philosophy">&ldquo;{agent.philosophy}&rdquo;</p>
                <p className="agents-card-meta">
                  {agent.role} / {agent.pronouns} / {agent.species}
                </p>
                <p className="agents-card-mission">{agent.mission}</p>

                <div className="agents-card-section">
                  <h3>Superpowers</h3>
                  <ul className="agents-power-list" aria-label={`${agent.name} superpowers`}>
                    {agent.superpowers.map((power) => (
                      <li key={power}>{power}</li>
                    ))}
                  </ul>
                </div>

                <div className="agents-card-section">
                  <h3>Signature Question</h3>
                  <p className="agents-signature-question">&ldquo;{agent.signatureQuestion}&rdquo;</p>
                </div>

                <blockquote className="agents-quote">
                  <p>&ldquo;{agent.signatureQuote}&rdquo;</p>
                </blockquote>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      </SectionShell>

      <SectionShell className="agents-usage-section">
        <SectionHeading eyebrow="Council Notes" title="How I Use Them">
          Different problems need different voices. The council helps me spot the next move, the
          hidden flaw, the buildable path, the human version of the message, and the larger life
          behind the work.
        </SectionHeading>

        <ResponsiveGrid className="agents-usage-grid" minColumnWidth="14rem">
          {usageExamples.map((example) => (
            <ResponsiveCard className="agents-usage-card" key={example} variant="quiet">
              <p>{example}</p>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>

        <p className="agents-usage-close">
          The point is not to replace my judgment. The point is to make my thinking more visible.
        </p>
      </SectionShell>

      <SectionShell className="agents-future-section" tight>
        <ResponsiveCard className="agents-future-card" variant="accent">
          <p className="card-eyebrow">Coming Eventually</p>
          <h2>The Council Chamber</h2>
          <p>One question. Five perspectives. One recommendation.</p>
          <p className="agents-future-note">
            Not today. Just a light under the door for where this room eventually goes.
          </p>
        </ResponsiveCard>
      </SectionShell>
    </PageShell>
  );
}
