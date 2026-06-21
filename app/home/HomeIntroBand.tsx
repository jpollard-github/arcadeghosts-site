import Link from "next/link";

export function HomeIntroBand() {
  return (
    <section className="intro-band" aria-label="Site mood">
      <p>
        A living portfolio for software, writing, and strange little
        experiments.{" "}
        <Link
          className="admin-cup-link"
          href="/admin"
          aria-label="Open Control Room"
          title="Control Room"
        >
          <span aria-hidden="true">☕</span>
          <span className="admin-cup-label">Control Room</span>
        </Link>
      </p>
    </section>
  );
}
