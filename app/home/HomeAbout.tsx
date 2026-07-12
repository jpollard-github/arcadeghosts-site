import Link from "next/link";

export function HomeAbout() {
  return (
    <section className="content-section about" id="about">
      <div className="about-copy" id="about-heading">
        <p className="eyebrow">About</p>
        <p>
          I&apos;m Jason. I&apos;m a professional software developer and I made
          this site for fun. Feel free to explore and {" "}
          <a href="mailto:jason@arcadeghosts.org">provide feedback</a>.
        </p>
        <p>
          I live in the Triad area of North Carolina. I have two cats, Beverly
          and Lucinda; you can see their pictures {" "}
          <Link href="/cats/beverly-and-lucinda">here</Link>. Have a great day!
        </p>
      </div>
    </section>
  );
}
