import Link from "next/link";
import { businessContact } from "../lib/business-config";

export function HomeAbout() {
  return (
    <section className="content-section about">
      <div className="about-copy" id="about">
        <p className="eyebrow">About</p>
        <h2>About ArcadeGhosts.</h2>
        <p>
          I&apos;m Jason, a software engineer who builds systems, experiments,
          and small digital spaces outside of work. ArcadeGhosts is where those
          ideas become playable, readable, or occasionally strange.
        </p>
        <p>
          Notice what is real, protect what you love, make something that did
          not exist before, and refuse to lie to yourself more than survival
          requires.
        </p>
        <p>
          I live in North Carolina with my cats, {" "}
          <Link href="/cats/beverly-and-lucinda">Beverly and Lucinda</Link>.
        </p>
        <p>
          If something here gives you a reason to continue a conversation, {" "}
          <a href={businessContact.emailHref}>send me a note</a>.
        </p>
      </div>
    </section>
  );
}
