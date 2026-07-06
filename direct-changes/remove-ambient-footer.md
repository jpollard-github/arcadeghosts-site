- Summary: Removed the shared public footer from the `/ambient` route so it keeps its standalone, installation-like presentation.
- Scope: small route-specific behavior change only; no other public pages were altered.

Made the shared footer opt out on `/ambient` paths in [app/PublicFooter.tsx](/Users/jasonp/repos/arcadeghosts-site/app/PublicFooter.tsx:1). The root layout still renders the footer everywhere else, but `PublicFooter` now checks the current pathname and returns nothing for `/ambient`, which keeps that page visually separate from the rest of the site as intended.

Files changed: [app/PublicFooter.tsx](/Users/jasonp/repos/arcadeghosts-site/app/PublicFooter.tsx:1) and this note file.

Removed the footer from `/ambient` by making [app/PublicFooter.tsx](/Users/jasonp/repos/arcadeghosts-site/app/PublicFooter.tsx:1) opt out when the pathname starts with `/ambient`, so the rest of the site still keeps the shared footer and Ambient stays standalone.

I also added the requested write-up at [direct-changes/remove-ambient-footer.md](/Users/jasonp/repos/arcadeghosts-site/direct-changes/remove-ambient-footer.md:1).

Verification: `npx eslint app/PublicFooter.tsx` passed. I did not generate a mobile screenshot packet in this pass.
