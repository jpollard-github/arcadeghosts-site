# Thoughts for Improving Attractiveness and Contact

## Status and intent

**Will not implement.**

These are recommendations, not approved requirements or an active backlog.
Jason retains all editorial and business decisions. Any future implementation
should preserve ArcadeGhosts' voice rather than turning it into a generic
portfolio or sales site.

Assessment date: July 26, 2026.

## Short conclusion

There are worthwhile improvements.

ArcadeGhosts already has the difficult part: a memorable atmosphere, a specific
personality, original material, working public pages, custom social images,
canonical metadata, RSS feeds, a sitemap, structured data, and analytics. It
does not need a visual identity overhaul.

The main weakness is the path from:

```text
interesting personal site
        ↓
understanding what Jason is good at
        ↓
seeing credible evidence
        ↓
knowing why and how to contact him
```

Today the site communicates taste and personality more clearly than
professional value or a reason to start a conversation. A visitor has to infer
Jason's software abilities from scattered experiments, and the ordinary contact
link is in the footer. The hidden terminal contact command is delightful, but
it should be a bonus route rather than one of the clearest routes.

The best near-term work is therefore:

1. decide which kinds of contact the site should invite;
2. make that invitation visible without becoming pushy;
3. present a small amount of selected work as evidence;
4. measure contact intent;
5. distribute individual useful pages instead of repeatedly promoting the
   homepage.

## What was observed

This assessment used the current repository, public homepage HTML, public
sitemap and robots file, HTTP headers, and search-result spot checks. An
interactive visual browser was unavailable, so this is not a fresh visual
design review or a claim that every live interaction was manually exercised.

### Existing strengths

- The hero and site language are distinctive. "A personal signal from the neon
  woods" is more memorable than a standard developer headline.
- The site has multiple reasons to explore: writing, games, collections,
  experiments, cats, and the terminal.
- Public routes have canonical metadata and most major rooms have Open Graph
  metadata or custom Open Graph images.
- The homepage contains `Person`, `WebSite`, and `Blog` JSON-LD.
- The site exposes writing and Tiny Thoughts RSS feeds.
- `robots.txt` permits public crawling while excluding admin and API routes.
- The sitemap contains the homepage, major rooms, games, cat pages, and both
  writings.
- `www.arcadeghosts.org` redirects permanently to the canonical apex host.
- Vercel Analytics is present, and several content links and terminal actions
  already emit custom events.
- The site uses a direct domain email address instead of requiring a social
  platform account.

### Current friction

- The homepage title and description emphasize writing, cats, arcade nostalgia,
  and experiments, but not Jason's software engineering capabilities.
- The hero does not offer a direct "work," "what I build," or contact path.
- The current About section identifies Jason as a software engineer but gives
  little evidence of specialties, outcomes, or the kinds of conversations he
  welcomes.
- There is no current public Selected Work section or dedicated work page in
  the checked-in homepage.
- The normal contact link appears in the footer. It is easy to miss, especially
  for someone who only scans the top half of the page.
- The footer contact link is not tracked, so analytics cannot distinguish
  contact intent from general page traffic.
- The site currently has two long-form writings. They are personal and
  meaningful, but there is not yet much indexable material demonstrating
  technical judgment, problem solving, or how Jason works.
- Writing metadata does not currently include visible publication dates,
  `datePublished`, `dateModified`, or a URL for the author entity.
- A search spot check surfaced the homepage but did not surface the writing
  pages as separate results. This is not a definitive index count, but it is
  enough to justify checking Search Console rather than assuming every sitemap
  URL is indexed.
- The search result still contained older homepage text about project statuses
  and blockers that is no longer in the current live HTML. Search snippets can
  lag behind the site, so previously public project-management language may
  remain a visitor's first impression until recrawled.

## First decision: what kind of contact is wanted?

Before adding calls to action, choose the primary outcome. These are different
messages and should not be collapsed into vague "let's connect" language:

- interesting personal conversations;
- peer connections with engineers, writers, or makers;
- job opportunities;
- freelance or consulting work;
- collaboration on a specific kind of project;
- speaking, podcast, writing, or community invitations.

It is fine to welcome more than one, but one should be primary. If Jason is not
currently available for paid work, the site should not imply otherwise. If he
is available, it should say so plainly in language he approves.

This decision controls the homepage call to action, selected-work presentation,
contact page, analytics events, and non-coding outreach.

## Prioritized coding initiatives

### Priority 1: add a visible, low-pressure contact path

Add one contact action near the hero or immediately after About, while retaining
the footer and terminal routes.

The invitation should answer:

- what kinds of messages are welcome;
- whether Jason is open to work, collaboration, or conversation;
- the email address in visible text;
- what a useful first email could include.

A plain email link is enough initially. Showing the address as text also helps
people whose browser has no configured mail application. A dedicated contact
form adds spam, accessibility, storage, privacy, and delivery concerns and
should not be the first move.

Possible surfaces:

- a quiet hero link such as "What I build" plus a secondary "Say hello";
- a final paragraph and email action in About;
- a small contact block at the end of selected work and writings;
- a `/contact` page only if more explanation is genuinely useful.

Do not use a modal, chat bubble, popup, or sticky sales banner.

Estimated effort: small.

### Priority 2: create a small Selected Work room

Create a `/work` page or a concise homepage section with three to five carefully
chosen projects. This should be a curated portfolio, not a public project
manager.

Each item should answer:

- What problem or curiosity started it?
- What did Jason personally design or build?
- What constraints or tradeoffs mattered?
- What works now?
- What evidence can a visitor inspect: live demo, screenshots, code, test
  coverage, performance, usage, or a short case study?
- What did Jason learn or change?

Prefer shipped, inspectable work. A self-directed project is credible when the
problem, choices, and result are concrete. Avoid leading with a long list of
paused ideas, internal blockers, TODOs, or candid status notes that make sense
to Jason but not to a potential collaborator.

The current site offers good candidates to evaluate, including the original
game, reflection journey, terminal, and developer-tool repositories. Jason
should choose the examples; this document does not make that editorial choice.

Estimated effort: medium.

### Priority 3: track the contact funnel

Use the existing analytics helper rather than adding another analytics product.

Add a consistent event such as `Contact Link Clicked` with a small, stable
`source` property:

- `hero`;
- `about`;
- `selected-work`;
- `writing`;
- `footer`;
- `terminal`.

Also track visits or clicks into Selected Work. Do not track email addresses,
message contents, or other personal data.

The useful funnel is:

```text
landing page
    → selected work or substantial writing
    → contact click
    → real email received
```

The last step remains a manual count. That is acceptable at this scale.

Estimated effort: small.

### Priority 4: improve the About path

The short homepage About section can remain, but it should point to a dedicated
page if there is more to say. A useful About page would combine:

- a concise professional description;
- the kinds of systems or experiences Jason likes to build;
- principles or working style;
- location at the level Jason is comfortable publishing;
- selected work and writing;
- current availability or interests;
- a direct contact invitation.

An authentic photograph can increase human recognition, but it is optional.
The page should not use a stock image, fake office portrait, or biography that
sounds unlike Jason.

If a dedicated About page becomes primarily about Jason, add valid
`ProfilePage` structured data and link article authors back to it. Google
documents Profile pages specifically for creator and About pages:

- <https://developers.google.com/search/docs/appearance/structured-data/profile-page>

Estimated effort: small to medium, depending on editorial work.

### Priority 5: make a few projects into case studies

The Selected Work page can start with cards, but the strongest one or two
projects should eventually have stable case-study URLs.

A useful case study is not a README pasted into the site. It should show:

1. context;
2. problem;
3. Jason's role;
4. decisions and tradeoffs;
5. screenshots or a working artifact;
6. result;
7. what he would improve next.

Where quantitative outcomes do not exist, use verifiable qualitative evidence:
scope completed, supported flows, tests, before/after screenshots, constraints
handled, or an honest technical postmortem. Do not invent impact metrics.

Estimated effort: medium per case study.

### Priority 6: publish writing that creates an entry point

Personal essays are part of the site's identity and should stay. To attract
people who may want to work or collaborate with Jason, add occasional pieces
that expose useful judgment:

- how a small system was designed;
- a tradeoff that changed during implementation;
- what failed in an experiment and why;
- a humane opinion about AI-assisted development;
- the making of a game, extension, or unusual interface;
- how personal taste influences software design.

The goal is not "content marketing" volume. One strong, specific article is more
useful than ten generic SEO posts. Each article should have its own durable URL,
an accurate title and description, and a contextual next step.

The best Tiny Thoughts can become seeds for substantial writing, avoiding a
separate high-volume content obligation.

Estimated effort: editorial and ongoing.

### Priority 7: strengthen writing metadata

Add editorially accurate publication dates to the repository-backed writing
model, display them on writing pages, and include `datePublished` and, when
applicable, `dateModified` in article structured data. Add an author URL that
resolves to the dedicated About page if one is created.

Google recommends accurate dates and stronger author identity in Article
structured data:

- <https://developers.google.com/search/docs/appearance/structured-data/article>

Validate new structured data with Google's Rich Results Test before relying on
it. Structured data can help search engines understand a page, but it does not
guarantee a rich result or better ranking.

Estimated effort: small, plus Jason's date decisions.

### Priority 8: tune search presentation without flattening the voice

The current homepage search title foregrounds writing, cats, and arcade ghosts.
That is charming but gives little signal to someone searching Jason's name plus
software, engineering, AI tools, or web experiments.

Revisit the homepage title and description so they represent both halves:

- the personal signal;
- the software builder behind it.

Do not stuff keywords into the hero or replace its distinctive headline. Search
metadata can be slightly more explicit than visible creative copy.

Also:

- verify the Search Console property;
- submit or confirm the current sitemap;
- inspect the homepage and both writing URLs;
- request recrawling where Google still shows removed project copy;
- review non-branded queries, pages with impressions but low click-through, and
  pages absent from the index;
- adjust titles based on real query data rather than guesses.

Search Console reports impressions, clicks, click-through rate, pages, and the
queries that surfaced the site:

- <https://support.google.com/webmasters/answer/7576553>
- <https://support.google.com/webmasters/answer/17010961>

Estimated effort: small initially, then a monthly review.

### Priority 9: add contextual contact invitations

A person who finishes a writing or case study is more qualified than a random
homepage visitor. Add a quiet end-of-page invitation tailored to the content.

Examples of the structure, not approved copy:

- enjoyed this line of thought → email Jason;
- working on a related problem → compare notes;
- interested in how this was built → view the case study or repository;
- want to collaborate on something similar → contact.

Keep the existing Related Signals so the site still encourages wandering.
Contact should be one possible next step, not the only one.

Estimated effort: small.

### Priority 10: preserve and improve shareable previews

The site already has strong Open Graph foundations. Continue making unique,
representative images for substantial writings and case studies. Avoid using the
same logo or hero for every page.

Google's Discover guidance recommends large, relevant, non-generic images and
notes that Discover traffic is inherently less predictable than search:

- <https://developers.google.com/search/docs/appearance/google-discover>

This is a supporting improvement, not a reason to chase Discover as a strategy.

Estimated effort: small per important page.

## Non-coding initiatives

### 1. Make every existing profile point to the right page

Update profiles Jason already uses—GitHub and any professional or community
profiles he chooses—to use a consistent one-sentence description and link to
ArcadeGhosts.

Do not automatically link every profile to the homepage. Link to the page that
best matches the audience:

- GitHub or engineering community → Selected Work or a technical case study;
- writing community → a specific writing;
- local professional group → About or Contact;
- arcade, film, music, or cat community → the relevant room.

This turns the site into a useful destination rather than a generic bio link.

### 2. Share artifacts, not announcements

"I updated my website" is rarely interesting. Share one useful or emotionally
specific thing:

- a playable game;
- a short lesson from building an experiment;
- a case study;
- an essay;
- an unusual screenshot with context;
- an open-source release.

Post where the subject already belongs, participate in the conversation, and
include the link only when it genuinely adds value. Avoid dropping unrelated
links into communities.

### 3. Use direct, personal distribution

When a new piece is genuinely relevant, send it to a small number of people who
would appreciate it. A brief personal note is more likely to create a
conversation than a broad generic post.

This is not cold mass outreach. It is:

- "This made me think of our conversation";
- "You mentioned this problem; here is what I tried";
- "I built the strange little thing we discussed."

### 4. Demonstrate something in person

Local meetups, coworking groups, maker communities, developer gatherings,
writing groups, and small talks can create the situations where a card or site
link becomes useful.

Instead of attending solely to hand out cards, bring one demonstrable artifact
or a five-minute story:

- how the terminal or game was built;
- a short AI-tool workflow;
- a case-study tradeoff;
- a creative coding experiment.

The site then becomes the follow-up destination for a conversation that already
started.

### 5. Ask for five honest visitor reactions

Ask a small mix of engineers, non-engineers, and people who might plausibly
contact Jason to spend two minutes on the homepage. Do not explain the site
first.

Ask:

- What do you think Jason does?
- What do you remember?
- What would you click next?
- What could you contact him about?
- Where would you look to contact him?
- What, if anything, reduced trust?

Record patterns, not individual preferences. If four people cannot explain what
Jason builds or find contact, that is stronger evidence than a design opinion.

### 6. Improve the business card only as a supporting object

The scarcity of occasions to hand out cards is the larger problem, so a card
redesign should not be the primary growth initiative.

If the card is refreshed:

- keep Jason's name, a plain-language descriptor, the domain, and email legible;
- use one memorable line rather than a list of technologies;
- include a QR code with a printed URL beside it;
- send the QR code to a stable About, Work, or Contact page rather than an
  ephemeral campaign page;
- optionally add a simple source query such as `?from=card` if analytics can
  capture it without collecting personal data;
- print a tiny batch first and test scanning and readability in ordinary light.

The card should help someone remember an existing interaction. It cannot create
the interaction by itself.

### 7. Use the site in the email signature

A quiet link in Jason's normal email signature gives relevant people repeated,
non-intrusive exposure. Link text such as "ArcadeGhosts — writing, software,
and experiments" is more informative than a bare URL, but Jason should approve
the wording.

### 8. Invite legitimate references

When a project or article is genuinely useful to a peer, community organizer,
project README, or resource list, it is reasonable to ask whether they would
reference it. Relevant links can bring qualified visitors and help discovery.

Do not buy links, exchange links at scale, or submit the site to low-quality
directories.

### 9. Consider a tiny recurring signal, not a full newsletter

RSS already serves people who use it. An email list may reach more people, but
it introduces consent, unsubscribe, privacy, deliverability, and cadence work.

Only add email subscriptions if Jason wants to publish reliably and can explain
what subscribers will receive. A monthly or irregular "new signal" note is more
appropriate than manufacturing weekly content. Until then, RSS plus direct
sharing is enough.

### 10. Collect testimonials only when they occur naturally

If someone has genuinely benefited from Jason's work, ask permission to quote a
specific statement about the experience. Keep attribution and context honest.
Do not add empty praise, anonymous filler, or invented metrics merely because
portfolios are expected to contain testimonials.

## A practical first sequence

### First week

1. Decide the primary kind of contact the site should invite.
2. Add a visible email invitation near About and a restrained hero path.
3. Track contact clicks by source.
4. Verify Search Console, inspect important URLs, and request recrawling for the
   stale homepage snippet.
5. Ask five people the visitor-reaction questions.

### Next two to four weeks

1. Create a Selected Work page with three strong items.
2. Turn one item into a real case study.
3. Strengthen the About path and author identity.
4. Add accurate writing dates and article metadata.
5. Publish or prepare one technically revealing piece of writing.

### Ongoing, approximately monthly

1. Share one specific artifact where it is relevant.
2. Personally send it to a few people who would value it.
3. Review search impressions, clicks, top pages, referral traffic, work clicks,
   contact clicks, and actual messages.
4. Improve the page that attracts qualified attention rather than adding
   unrelated features.

## How to measure whether this is working

Avoid using total visits as the only success measure. A small number of
interested people is more valuable than broad accidental traffic.

Track:

- non-branded search impressions and clicks;
- visits to Selected Work and case studies;
- outbound clicks to relevant repositories or demos;
- contact clicks by page and source;
- actual relevant emails received;
- invitations, collaborations, introductions, or conversations that mention a
  specific page;
- which shared artifacts bring returning visitors.

Use a simple monthly note. At this scale, a spreadsheet or Markdown table is
enough; a new CRM is not required to evaluate the site.

## Initiatives to avoid for now

- a full visual redesign before clarifying the contact path;
- generic AI-generated SEO articles;
- publishing every project, TODO, blocker, or abandoned idea;
- a complicated contact form or booking system before there is demand;
- popups, chat widgets, autoplay, or forced newsletter prompts;
- adding many social platforms that Jason will not maintain;
- fake urgency, fake availability, inflated metrics, or invented testimonials;
- changing personal writing to sound corporate;
- chasing traffic unrelated to the people Jason actually wants to meet.

## Recommended minimum viable improvement

If only one small round of work happens, do this:

1. add a visible, honest contact invitation near About;
2. add a Selected Work page with three inspectable projects;
3. track contact and work clicks;
4. request a Google recrawl;
5. share one specific work page directly with relevant people.

That would make the site's purpose clearer without sacrificing the neon woods,
cats, essays, games, or the wandering quality that makes ArcadeGhosts worth
remembering.
