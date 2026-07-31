import Link from "next/link";

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
          I live in North Carolina with my cats, {" "}
          <Link href="/cats/beverly-and-lucinda">Beverly and Lucinda</Link>.
        </p>
      </div>
    </section>
  );
}
