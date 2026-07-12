import Link from "next/link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { href: "/writings", label: "Writing" },
      { href: "/#tiny-thoughts", label: "Tiny Thoughts" },
      { href: "/#fun-and-games", label: "Fun & Games" },
      { href: "/#screening", label: "Screening" },
      { href: "/#cats", label: "Cats" },
      { href: "/about", label: "About" },
      { href: "mailto:jason@arcadeghosts.org", label: "Contact" },
    ],
  },
  {
    title: "Elsewhere In The House",
    links: [
      { href: "/arcade", label: "Arcade Games" },
      { href: "/terminal", label: "Terminal" },
      { href: "/ambient", label: "First Glow" },
      { href: "/tiny-thoughts", label: "Tiny Thoughts" },
      { href: "/writings/rss.xml", label: "Writing RSS" },
      { href: "/tiny-thoughts/rss.xml", label: "Tiny Thoughts RSS" },
    ],
  },
] as const;

function FooterLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith("mailto:")) {
    return <a href={href}>{label}</a>;
  }

  return <Link href={href}>{label}</Link>;
}

export function PublicFooter() {
  return (
    <footer className="site-footer" aria-label="Public site footer">
      <div className="site-footer-shell">
        <div className="site-footer-copy">
          <p className="eyebrow">ArcadeGhosts</p>
          <p>
            A modest footer for the rooms that are public right now.
          </p>
        </div>
        <div className="site-footer-links">
          {footerGroups.map((group) => (
            <section className="site-footer-group" key={group.title} aria-label={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </footer>
  );
}
