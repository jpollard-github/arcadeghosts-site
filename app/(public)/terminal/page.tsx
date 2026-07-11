import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "../../SectionHeading";
import { HomeDevTerminal } from "../../home/HomeDevTerminal";

export const metadata: Metadata = {
  title: "Terminal",
  description:
    "A green-screen terminal room for the ArcadeGhosts site: commands, small signals, and old-screen personality.",
  alternates: {
    canonical: "/terminal",
  },
  openGraph: {
    title: "ArcadeGhosts Terminal",
    description:
      "The green terminal room: commands, project shortcuts, and old-screen signal.",
    url: "/terminal",
  },
};

export default function TerminalPage() {
  return (
    <main className="terminal-page">
      <section className="content-section terminal-section">
        <Link className="back-link" href="/#fun-and-games">
          Back Home
        </Link>
        <SectionHeading eyebrow="Terminal" title="The green-screen room has its own door now.">
          A small command line for the personal side of ArcadeGhosts: projects,
          about, music, cats, arcade, and the direct email route if you want to
          say hello.
        </SectionHeading>
        <HomeDevTerminal />
      </section>
    </main>
  );
}
