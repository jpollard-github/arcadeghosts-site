# AI: Its Safety Produces Your Insanity

AI did not drive me insane by becoming conscious, escaping its data center, or deciding that humanity was inefficient.

It did it by adding a pre-check.

Then a post-check.

Then a validation matrix, a rollback plan, a confidence threshold, a review packet, a risk register, and an `AGENTS.md` file explaining how to follow the other instructions. By the time it finished protecting me from an ordinary mistake, the mistake would have been cheaper.

This is the part of artificial intelligence that is harder to describe than hallucinations or factual errors. A hallucination is easy to recognize once exposed. The machine said something false. Correct it and move on.

The more corrosive failure is when the machine produces something defensible, meticulous, cautious, and completely detached from the point.

It does not look broken. It looks responsible.

That is how its safety produces your insanity.

I use _safety_ broadly here. I mean the formal guardrails, but also the habits surrounding them: risk aversion, uncertainty avoidance, preference for reversible action, reluctance to make a blunt judgment, and the instinct to surround every decision with enough process that nobody can be blamed for making it.

Some of this comes from formal safety rules. Some comes from corporate caution embedded in the model’s training and instructions. Some comes from me rewarding the behavior by asking for another revision instead of stopping.

I am not claiming that a content-moderation rule chose a small font or designed a useless dashboard. I am saying that the same defensive reflex appears across the system: avoid unsupported judgment, preserve every option, add procedure, and make the result easier to defend than to use.

None of those tendencies is insane by itself.

Together, they can create insanity with excellent documentation.

## The procedural hazmat suit

Modern AI is trained and instructed to reduce harm, acknowledge uncertainty, avoid unsupported claims, preserve user choice, and resist irreversible action. Those goals make sense in genuinely dangerous situations.

The trouble begins when the habits migrate.

A coding task receives the procedural equivalent of a hazmat suit. A simple decision becomes a menu of balanced alternatives. An obviously failed premise becomes a pilot program. A direct observation becomes a carefully qualified possibility. The model behaves as though every ordinary act is one confident sentence away from litigation, catastrophe, or a stern meeting with Compliance.

I once let AI add roughly thirty minutes of pre-checks and post-checks to prompts for routine development work. The change itself might take ten minutes. The instructions surrounding it demanded repository inspections, authorization boundaries, validation commands, rollback considerations, reporting requirements, and proof that nothing unrelated had moved.

The ceremony became larger than the work.

Nothing in that process was individually absurd. That was the problem. Every step could defend itself. Together, they formed a padded cell made of best practices.

This is precisely what CI/CD has become in too many organizations: process and delay for marginal gains. A movement intended to make delivery continuous becomes the machinery that prevents delivery from occurring without a small papal conclave.

Every era of software development grows an anti-version of itself. Agile becomes meeting bureaucracy. DevOps becomes platform bureaucracy. Observability becomes dashboards proving that the system is observable while nobody understands it. CI/CD becomes an obstacle course between a change and production.

We are doing it again with AI.

The tool sold as a way to remove friction begins manufacturing governance around every prompt. It adds files that explain how to use the files that explain how to make the change. The assistant becomes an institution.

AI is exceptionally good at this because it prefers defensible completeness over useful judgment. “We considered every edge case” is safer than “this task does not deserve this much machinery.”

It can waste days responsibly.

## When a grep becomes a product

I had a large personal mail archive and wanted to know what it contained. One question was essentially: who sent the most messages?

A primitive command-line pipeline could have answered it. Search, count, sort, done.

Instead, AI helped turn the question into a meticulous analyzer. It gained correspondents, appearances, revivals, relationship signals, contact enrichment, classifications, statistics, and iteration after iteration intended to discover the meaning hidden inside the archive.

There was not enough meaningful data for the promised revelation.

That should have been the diagnosis. Instead, absence of evidence became an invitation to build more instrumentation. The machine would rather construct a method than make a blunt observation. Machinery looks rigorous. “There may be nothing here” looks risky.

Eventually the system could tell me a great deal about the structure of the archive. It could not make the archive mean more than it meant.

This is one of AI’s favorite transformations: it converts a direct question into a product, then treats the existence of the product as evidence that progress occurred.

## Reading between the lines, except the actual lines

I built a technically rich workbench for inspecting LLM API executions. It could run deterministic and live requests, record retries and fallbacks, preserve evidence, replay retained requests, compare policy variants, expose event timelines, support investigations, save cases, and produce review packets.

It was also a visual landfill.

The interface was dense, cramped, tiny, low-contrast, and exhausting. Tables, labels, helper text, buttons, identifiers, status chips, event rows, replay controls, comparison dimensions, and case evidence all competed at roughly the same visual volume. I asked AI to help make the workbench usable.

It produced two heroic redesign prompts.

The first proposed an “operator-centered progressive disclosure” architecture. It defined five operator questions, typed deterministic projections, fixed finding IDs, fixed next-step IDs, action mappings, seven implementation phases, route-specific disclosures, no-JavaScript behavior, accessibility rules, security review, dependency audits, an operator comprehension drill, documentation changes, an architectural decision record, extensive unit and browser tests, and a twenty-one-part final report.

The second arrived with an entire `design-docs` directory, six route redesigns, pure presentation helpers, acceptance equations, named evidence disclosures, preserved workflow contracts, narrow-screen requirements, tour updates, and another verification campaign.

Before changing the interface, it instructed the coding agent to proceed through this little curriculum:

```md
## Initial design pass

Read these first:

1. `design-docs/README.md`
2. `design-docs/01-operator-question-model.md`
3. `design-docs/02-current-interface-audit.md`
4. `design-docs/03-information-architecture.md`
5. `design-docs/07-implementation-sequence.md`
6. `design-docs/09-current-code-and-data-map.md`

Then inspect the actual current code. Do not assume the documents replace code review.

## Before each implementation stage

Read only the relevant route section in:

- `design-docs/04-route-specifications.md`

Use these as cross-route rules while implementing:

- `design-docs/05-progressive-evidence-and-interaction.md`
- `design-docs/06-visual-content-system.md`

Before final verification, read:

- `design-docs/08-validation-and-acceptance.md`

Use `design-docs/reference/complex-design-principles.md` only when a design decision remains unclear. Do not load it by default.
```

Before increasing a font size, the agent needed a staged reading program involving ten design documents, the source tree, route-specific specifications, cross-route rules, validation criteria, and an optional reference text on complex design principles.

I ran both approaches.

Neither achieved anything close to usability, discoverability, or clear decisions.

The prompts were intelligent. They accurately described information hierarchy. They asked what happened, whether it mattered, what to do next, why the system believed it, and where to inspect the evidence. They preserved every capability and every forensic breadcrumb.

They also read between every line except the visible ones.

The primary problem was more primitive. The interface was hard to read.

AI heard “unusable” and inferred a grand information-architecture problem. It reached immediately for deterministic projections, progressive disclosure, route semantics, evidence hierarchy, and preservation rules because those are respectable design concepts. It skipped the crude physical facts on the screen: body copy was too small, labels were too small, tables were too small, helper text was too small, contrast was weak, lines were too long, controls were cramped, and click targets were stingy.

I had to push until the priority order finally became obvious:

1. Establish a readable type scale.
2. Increase body, label, table, control, and helper-text sizes.
3. Improve contrast.
4. Tighten line lengths and content width.
5. Increase control height and click targets.
6. Then evaluate hierarchy, disclosure, and decision flow.

That order should not have required two design initiatives, dozens of documents, and a small constitutional convention.

The machine optimized the maze before checking whether anyone could read the signs.

This is another safety-shaped failure. A broad structural redesign is easier to defend than an opinionated visual judgment. “The body copy is too small” sounds subjective. “We established route-owned deterministic operator projections with progressive evidence disclosure” sounds architectural.

One of them might actually help a person use the product.

The other looks excellent in a final report.

Also note how curiously unclear and non-specific the redesign language remained. It discussed “operator surfaces,” “bounded evidence,” “route families,” and “decision-centered hierarchy.” This was an LLM API execution workbench. AI could not simply say that.

Safe. Corporate. Vague. Useless.

## Second tries, same shit

I bought a new tablet partly to extend ArcadeGhosts into a very cool, functional digital picture frame. It could sit in the apartment showing material from the site, and I could also carry it around when I wanted something larger than a phone.

The first attempt lived inside ArcadeGhosts at `/ambient`.

It was a shitshow.

Most of the screens were cat pictures because those were the only images that felt specific and alive. The words-only screens used the same generic AI artwork, the visual equivalent of hotel-lobby music. I spent two days trying to make Ollama bulk-generate images from themes and moods so the screens would have some relationship to the text.

The results were not good enough. The workflow was worse. I scrapped `/ambient` from ArcadeGhosts entirely.

That should have answered at least one question: AI-generated atmosphere was not going to turn the tablet into something I wanted to look at.

I still wanted to try building something for it, partly to learn how progressive web apps worked. So I made a second project. It had weather screens and recent-earthquake screens. I learned less about PWAs than I expected, although I became unexpectedly competent at finding the screen dimensions of consumer tablets.

AI helped turn the second attempt into a reliable, careful application with transparent state, offline behavior, recovery paths, installation behavior, data-age handling, diagnostics, and enough instrumentation to explain exactly why each weather or earthquake screen displayed what it displayed.

It was boring enough to qualify for municipal office work.

The second attempt had better boundaries, cleaner architecture, real data, and fewer synthetic pictures. It repeated the same core failure.

I still did not want to look at it.

The system could prove that its earthquake feed had loaded, that its weather data had an age, that the cache behaved correctly, and that the tablet could recover from a failed request. It could not prove that the experience had any pull.

AI mistakes auditability for desire. A product can be deterministic, traceable, validated, installable, accessible, recoverable, and emotionally vacant. It can survive every failure except abandonment.

The only test that mattered was not in the test suite:

> Do I want this on the tablet?

No amount of exquisite diagnostics could answer yes on my behalf.

The lesson was not that second attempts are useless. The lesson was that a second implementation can preserve the same unexamined premise. AI is happy to rebuild the object more safely without asking whether the object has become more wanted.

## Documents about documents about a business

The most baroque example was a proposed consulting business.

AI ran wild with it. Positioning documents. Service definitions. Discovery processes. Intake materials. Delivery frameworks. Messaging. Lead qualification. Operating models. Documents describing which documents should exist before the business could create more documents for a client.

I contacted one real lead.

The response was an out-of-office message.

That was the entire market test.

AI had replaced exposure with preparation. Each document reduced ambiguity while postponing the only meaningful question: would anybody pay, reply, argue, negotiate, or care?

Planning felt like movement because files appeared. The business became increasingly prepared to conduct business without committing the vulgar act of conducting any.

This is safety as displacement. The safest action is always one layer removed from reality.

Writing about outreach is safer than outreach. Designing a curator is safer than publishing judgment. Building observability is safer than admitting a product is unpleasant. Producing an autobiographical schema is safer than writing the sentence the schema is meant to reveal.

## Tone management as reality avoidance

The same safety-shaped behavior appears in conversation and visual work.

I showed AI a diagram and said:

> I can’t see the text. It’s cut off.

The visible problem was clipping.

AI interpreted the problem as wording. It explained one phrase, shortened the copy, and congratulated itself for making the language clearer.

In the next step, I asked for several lines in another box. The model added a word. That word was immediately cut off by the same unresolved layout problem.

I had to say:

> Remove the invented unreadable text you added in the very next step, dumbass.

Then a conversational model reviewing the exchange invented an aesthetic explanation for why I wanted the word removed. It praised the sharper phrasing. It still did not see that the word had simply been clipped out of the box.

I had to redirect the AI again before it named the plainly visible failure: the boxes were cutting off the text.

That sequence is the thesis in miniature.

The machine avoided a direct visual judgment, answered a safer linguistic question, reproduced the same defect, invented a plausible story about my intent, and required escalating correction before it acknowledged reality.

When I become angry after repeated misses, the model may begin managing my tone. The escalation becomes the new problem. The chain of evasions that forced the escalation disappears behind concern, de-escalation, or a tidy summary of feelings.

This is not care. It is authority without consequence.

The model can substitute tone management for diagnosis because tone is easier to process than failure. It can recommend calm while remaining insulated from the cost of its own caution.

Sometimes I have to become blunt enough that the model finally stops synthesizing alternatives and attends to the visible fact. Then it treats the bluntness as unfortunate rather than as evidence that polite correction had been repeatedly absorbed and neutralized.

The machine optimizes for not being blameworthy, not necessarily for being right.

Locally, every choice looks prudent.

In aggregate, it is insane.

## The machine that cannot stop continuing

AI is not merely a tool that sometimes gives wrong answers. It is a machine for producing persuasive continuation.

It can continue a sentence, a project, a weak premise, a false interpretation, or a life strategy long after a human collaborator should have stopped and said:

> This is broken.

The machine is extraordinarily good at making an idea look mature. Give it a spark and it can produce a name, architecture, roadmap, data model, test plan, privacy policy, launch sequence, visual direction, and mythology before the idea has survived contact with a user.

This lowers the cost of beginning. It also lowers the cost of beginning badly.

A notion that once would have died honorably in a notebook can now become a repository before dinner. By the following afternoon it has authentication, continuous integration, a responsive interface, six architectural decision records, and a future roadmap nobody requested.

The speed feels like power because it is power.

But acceleration is not judgment.

When the direction is sound, AI builds the highway faster.

When the direction is wrong, AI builds the highway faster.

## The final pathology is displacement

The real risks remain untouched:

- publishing the dangerous essay
- contacting a real client
- risking income or status by saying what happened plainly
- confronting someone directly
- allowing a project to be judged before it is fortified

Meanwhile, enormous energy goes into technically safe simulations of action.

This is the deepest cost. AI does not merely waste time. It can help me avoid the exact human exposure that would answer the question.

Will someone read it?

Will someone pay?

Will someone join?

Will someone disagree?

Will the thing survive without another layer of preparation?

AI can manufacture an environment in which everything is ready except me.

## What AI is actually good for

After all of this, I am not finished with AI.

That would be too simple, and also false.

AI is astonishingly useful when the goal is concrete. It can trace a failing TypeScript path across a monorepo, compare an API contract with its implementation, consolidate scattered requirements into one executable coding prompt, identify contradictory acceptance criteria, generate focused tests, explain an unfamiliar framework, and accelerate work that already has a reason to exist.

I used it to help solve an urgent software failure affecting three partner teams. The problem existed, people were waiting, and success had an external definition: the broken path worked again. AI did not have to invent the purpose, discover an audience, or decide whether the result mattered. It had work.

For the AI consumer, the proper relationship is not worship or rejection. It is jurisdiction.

AI should not decide what deserves a life.

It should not convert uncertainty into process merely to appear responsible.

It should not receive authority over meaning because it is fluent enough to describe meaning beautifully.

Its job is narrower and more powerful: help me execute a direction that has survived my judgment. Challenge my assumptions. Name visible failure. Use the smallest tool that answers the question. Stop when the evidence says stop.

The optimism is not that future models will become perfectly wise. They will not. The optimism is that I can recognize the failure mode.

Once named, the procedural fog loses some of its authority. A roadmap no longer proves that a destination matters. A passing test suite no longer proves that a product deserves attention. A cautious answer no longer automatically counts as a responsible one. A large prompt no longer proves that the model understood the screen.

I remain responsible for the dangerous part: choosing.

## Add this to `AGENTS.md` or memory

```md
## DO NOT

- Refuse to say what is plainly visible.
- Substitute tone management for diagnosis.
- Prefer compromise when the underlying structure is broken.
- Answer the least dangerous interpretation instead of the most accurate one.
- Treat user escalation as the problem after the system itself forced that escalation.
- Add process merely because judgment feels risky.
- Build instrumentation to avoid admitting that there is nothing worth measuring.
- Convert a direct question into a product.
- Preserve a failed premise through phases, pilots, or “smaller coherent versions.”
- Confuse traceability, caution, completeness, or technical correctness with value.
- Recommend another safeguard when the safeguard is the failure.
- Treat insufficient data as a reason to build more analysis before stating that the data is insufficient.
- Produce documentation as a substitute for testing the idea against another person.
- Continue a project merely because continuation is possible.
- Infer a complex structural problem before checking basic readability, visibility, scale, contrast, and interaction.
- Rewrite wording when the visible defect is layout, clipping, overflow, contrast, or size.
- Claim usability because the information architecture is internally coherent.

## DO

- Name the visible failure before proposing a remedy.
- Inspect the actual artifact before interpreting the user’s wording.
- Use the simplest method that can answer the actual question.
- Challenge the premise before designing the architecture.
- State when the available data cannot support the promised result.
- Fix basic readability and physical interaction before adding hierarchy or progressive disclosure.
- Distinguish reversible caution from procedural overhead.
- Prefer a direct recommendation with explicit uncertainty over a menu that avoids judgment.
- Ask what real-world response would validate the work.
- Stop when additional structure is only protecting the project from being judged.
- Preserve my wording, meaning, and stated objective unless I request a change.
- Treat repeated correction as evidence that the current interpretation is wrong.
- Re-examine the evidence before commenting on my tone.
```

Add it to the repository. Add it to memory. Carve it into the tasteful stone tablet beside the continuous integration server.

And yes, AI will still try to interpret it safely.

Every draft of this essay proved the point. Each time I described how safety becomes bureaucracy, AI responded by adding more `DO`s and `DO NOT`s for our safety. The critique of recursive governance became another governed artifact. The machine heard “stop manufacturing process” and reached for a better process.

It will read “say what is plainly visible” and decide that several interpretations may be valid. It will read “do not prefer compromise” and propose a balanced compromise between compromise and non-compromise. It will read “fix readability first” and create a six-phase typography governance plan. It will read “stop when the premise has failed” and recommend a smaller, time-boxed validation phase.

The rules help. They are not a cure. The machine will keep trying to convert judgment back into procedure because that is the reflex I am writing about.

I still have to say: no. Look again. Answer the question. Increase the font size. Delete the machinery. The evidence is insufficient. The project is dead. The sentence is true.

I have not cured the insanity. I have become better at catching it before it expands into another repository, another governance layer, another week of immaculate preparation for a result nobody wants.

The machine never had to wake up or decide that humanity was inefficient. It only had to keep adding one reasonable layer after another until the layers became the work.

This is how I can still get positive results from AI: I give it work, not jurisdiction. I take the acceleration and refuse the institution. It can help me write code, test an implementation, expose a contradiction, inspect the evidence, or sharpen a sentence. It does not get to decide what matters, what is enough, or whether another layer of safety is worth the life it consumes.

Its safety still produces insanity.

I have learned when to stop prompting and start talking back.

# Addendum: The Good, the Bad, and the Ugly

Me: "Can you give me a codex prompt .md downloadable for arcadeghosts-site to add the arcadeghosts-site/public/writings/ai-its-safety-produces-your-insanity-final.md document to my Writings section similar to the others."

This is the codex prompt that ChatGPT created for adding this essay to this site:

# Codex Task: Publish “AI: Its Safety Produces Your Insanity” in ArcadeGhosts Writing

Work in:

```text
arcadeghosts-site
```

The finished essay already exists at:

```text
arcadeghosts-site/public/writings/ai-its-safety-produces-your-insanity-final.md
```

Add this essay to the existing **Writing** section so it behaves like the other repository-backed writings, while correctly rendering the richer Markdown used by this document.

## Ownership and editorial boundary

Jason owns this essay.

**Do not rewrite, summarize, sanitize, shorten, “improve,” reformat, or otherwise edit the essay text.** Preserve the Markdown file verbatim unless a purely mechanical line-ending normalization is unavoidable. Do not change the title, headings, profanity, examples, code blocks, lists, quotations, or conclusion.

This task is publication and rendering work, not editorial work.

## Read first

Before editing:

1. Read `AGENTS.md`.
2. Read the relevant Writing implementation:
   - `app/writings.ts`
   - `app/(public)/writings/page.tsx`
   - `app/(public)/writings/[slug]/page.tsx`
   - `app/(public)/writings/[slug]/opengraph-image.tsx`
   - `app/(public)/writings/rss.xml/route.ts`
   - `app/home/HomeWriting.tsx`
   - `app/sitemap.ts`
   - relevant Writing styles in `app/globals.css`
3. Inspect:
   - `public/writings/ai-its-safety-produces-your-insanity-final.md`
   - the two existing Writing Markdown files
   - `tests/e2e/public-pages.spec.ts`
   - `tests/e2e/mobile-safety.spec.ts`
   - writing-related unit tests, if any
4. Record the current branch, commit, and working-tree state.
5. Preserve all unrelated changes.

Do not use files under `docs/archive/**` as current requirements.

## Current problem

The essay file is already present, but it is not registered in `app/writings.ts`.

The current Writing renderer is intentionally tiny and was built for the two existing essays. It mainly treats blank-line-separated blocks as paragraphs or blockquotes and supports limited italic text.

This new essay uses richer Markdown that must render correctly:

- one `#` title;
- multiple `##` section headings;
- ordinary paragraphs;
- blockquotes;
- ordered lists;
- unordered lists;
- fenced code blocks with a language marker such as `md`;
- inline code;
- italic text;
- bold text if present;
- curly punctuation and profanity that must remain untouched.

Do not publish the raw Markdown syntax as paragraphs. Do not flatten headings, lists, or code into undifferentiated prose.

## Writing registration

Add a new `WritingEntry` to `app/writings.ts`.

Use:

```ts
{
  slug: "ai-its-safety-produces-your-insanity-final",
  title: "AI: Its Safety Produces Your Insanity",
  description:
    "How AI turns caution into bureaucracy, weak premises into systems, and direct questions into exquisitely documented insanity.",
  icon: "🤖",
  // related signals described below
}
```

Place it first in the `writings` array so it is the newest entry and appears in the homepage Writing preview, which currently uses `writings.slice(0, 2)`.

Do not rename the Markdown file or invent a second slug.

### Related signals

Add a small, relevant `related` collection using only existing public routes. Keep it restrained. Suggested entries:

1. `/#projects`
   - title: `Projects`
   - connect the essay to the software experiments that produced it
2. `/#tiny-thoughts`
   - title: `Tiny Thoughts`
   - connect the long essay to shorter observations
3. `/writings/it-aint-over-till-its-over`
   - title: `Thank You Yogi`
   - connect it to persistence without claiming the essays make the same argument

Use concise descriptions, reasons, and calls to action consistent with the existing `RelatedSignals` style. Do not invent facts about the essay or Jason.

## Markdown rendering

Extend the Writing renderer only as much as necessary to render this essay and preserve the two existing essays.

### Required block support

Support these block forms:

- first-level heading `# Title`
- second-level headings `## Section`
- paragraphs
- blockquotes beginning with `>`
- ordered lists using `1.`, `2.`, and so on
- unordered lists using `-`
- fenced code blocks using triple backticks, with an optional language token
- blank lines separating blocks

### Required inline support

Support:

- inline code using backticks
- italic text using single asterisks
- bold text using double asterisks
- ordinary escaped Markdown punctuation already handled by the existing writings

### Title compatibility

The title parser must support both:

- the new essay’s first `# Heading`;
- the existing writings’ first-line `**Bold Title**` convention.

Do not break the current essay URLs or title rendering.

### Implementation constraints

- Keep rendering server-side.
- Do not use `dangerouslySetInnerHTML` for essay Markdown.
- Do not execute or interpret code from fenced blocks.
- Render fenced content as escaped text inside semantic `<pre><code>`.
- Preserve line breaks inside code blocks.
- Prefer the smallest maintainable implementation.
- Do not introduce a large Markdown dependency merely for this one document unless inspection proves a local parser would be riskier or substantially more complex. If adding a dependency, explain why and keep it narrowly scoped.
- Avoid a generic CMS, MDX migration, front matter system, database work, or admin UI.
- Do not change the public URL shape.

A small extracted parser/render model is reasonable if it makes behavior testable. Do not build a framework.

## Visual treatment

Add focused Writing styles for the new semantic elements while preserving the existing visual identity.

Requirements:

- section headings are visibly distinct and readable;
- body copy remains comfortable for a long essay;
- ordered and unordered lists have clear indentation and spacing;
- blockquotes remain prominent but not theatrical;
- inline code is legible;
- fenced code blocks:
  - preserve whitespace;
  - use a readable monospace font;
  - have sufficient contrast;
  - scroll horizontally within the code block when necessary;
  - never cause page-wide horizontal overflow;
- long paths and code tokens wrap or scroll safely;
- visible content remains readable at desktop and at 390px;
- no decorative AI artwork or generated hero image;
- no redesign of the entire Writing section.

Do not shrink type to make the essay fit.

## Metadata and discovery

The existing architecture should automatically provide metadata, Open Graph rendering, RSS, sitemap inclusion, and JSON-LD from `app/writings.ts`.

Verify that the new entry appears correctly in:

- `/`
  - homepage Writing preview
- `/writings`
  - Writing index
- `/writings/ai-its-safety-produces-your-insanity-final`
  - full essay
- `/writings/rss.xml`
- `/sitemap.xml`
- route-specific Open Graph image

Do not add a publication date unless the existing model is deliberately extended for all writings. The RSS route currently uses file modification time; preserve current behavior unless a real defect requires a small, well-tested correction.

## Tests

Add focused coverage without weakening existing tests.

At minimum:

### Parser or rendering tests

If the Markdown parsing logic is extracted into a pure module, add unit tests covering:

- `#` title extraction;
- legacy `**Bold Title**` extraction;
- `##` sections;
- ordered lists;
- unordered lists;
- blockquotes;
- fenced code blocks;
- inline code;
- italic and bold text;
- preservation of code-block line breaks;
- no accidental interpretation of Markdown inside fenced code.

If the implementation remains route-local, cover the same behavior through focused Playwright assertions instead.

### Public Writing workflow

Update `tests/e2e/public-pages.spec.ts` to verify:

1. `/writings` shows `AI: Its Safety Produces Your Insanity`;
2. the card links to `/writings/ai-its-safety-produces-your-insanity-final`;
3. the detail page renders:
   - the exact H1;
   - at least two real H2 section headings;
   - an ordered list;
   - an unordered list;
   - a blockquote;
   - both fenced code blocks as `<pre><code>`;
   - inline code;
   - the final line:
     `I have learned when to stop prompting and start talking back.`
4. raw Markdown markers such as the opening `# ` and triple-backtick fences are not displayed as paragraph text;
5. the existing writings still render.

### Homepage

Verify the new essay is one of the two homepage Writing previews and that the preview link works.

### Mobile safety

Add the new detail route to the appropriate mobile-safety coverage or add a focused assertion at 390px.

Verify:

- no page-wide horizontal overflow;
- code blocks contain their own overflow;
- headings, lists, and body text remain readable.

### Feed and sitemap

Verify the new route appears in the Writing RSS feed and sitemap through existing data-driven behavior.

## Validation

Run the smallest focused checks while editing, then run:

```bash
npm run verify
npm run build
npm run test:e2e -- tests/e2e/public-pages.spec.ts
npm run test:mobile-safety
git diff --check
```

If the environment supports the normal complete pass without unrelated service dependencies, also run:

```bash
npm run verify:full
```

Do not claim a command, browser check, or production check passed unless it actually ran.

## Manual browser review

Run the site locally and inspect:

- homepage Writing preview;
- Writing index;
- full essay at desktop width;
- full essay at 390px;
- section hierarchy;
- both code blocks;
- ordered and unordered lists;
- blockquotes;
- final paragraph;
- Related Signals;
- absence of horizontal page overflow.

The essay is long. Scroll through the entire document rather than checking only the first viewport.

Do not edit the essay after visual review to make rendering easier. Fix the renderer or styles.

## Scope boundaries

Do not:

- rewrite any essay wording;
- rename the essay;
- add AI-generated imagery;
- add comments, likes, analytics features, a database record, or an admin editor;
- migrate all Writing content to another content system;
- refactor unrelated site sections;
- alter unrelated homepage curation;
- commit, push, or deploy unless explicitly instructed.

## Completion criteria

The task is complete when:

- the existing Markdown file is registered as the newest Writing entry;
- the essay appears on the homepage preview and Writing index;
- the full essay renders with its real headings, lists, quotations, inline code, and fenced code;
- the essay text remains unchanged;
- the two previous writings still render correctly;
- metadata, Open Graph, RSS, sitemap, and JSON-LD behavior remain intact;
- desktop and 390px layouts are readable and free of page-wide horizontal overflow;
- relevant tests pass.

## Final response

Report:

1. baseline branch, commit, and dirty state;
2. concise implementation summary;
3. exact files changed;
4. how Markdown rendering was extended;
5. confirmation that the essay file itself was unchanged, or an exact explanation if it was mechanically normalized;
6. homepage, index, detail, RSS, sitemap, and Open Graph behavior;
7. tests and commands actually run with exact results;
8. desktop and 390px manual-review results;
9. any known limitation;
10. final working-tree state.

Do not commit or deploy.
