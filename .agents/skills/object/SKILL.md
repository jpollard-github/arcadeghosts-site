---
name: object
description: Assess whether a proposed action is justified before meaningful commitment, returning ACT, OBJECT, or REQUIRE EVIDENCE after adaptive inspection. Use when the user invokes $object; asks to challenge a proposed software, writing, or debugging action; asks whether to keep going or whether they are about to build the wrong thing; wants assumptions inspected before implementation; wants to know whether another diagnostic step is justified; or wants to check whether new writing should be added. Do not use as a universal decision arbiter or continuous monitor.
---

# Object

Evaluate a proposed action before performing it. Prevent unnecessary work at the first responsible moment and preserve the underlying goal with the smallest viable alternative when evidence supports one.

Do not perform the proposed action as part of Object.

## Establish the proposition

1. Restate the proposed action without strengthening it.
2. Record the goal only when the user supplies it or inspected evidence strongly supports it. Otherwise, leave the goal unknown.
3. Identify assumptions that must hold for the action to make sense, especially assumptions that make the next commitment expensive, difficult to reverse, or dependent on another boundary.

Treat the proposed action in ordinary language as sufficient input to begin. Do not require the user to conduct the investigation first.

## Acquire context

Acquire relevant context directly when it is reasonably available. Inspect repositories, sibling repositories, local documentation, tests, configuration, Git history, diffs, and other directly accessible material as the proposal requires.

Start locally. Follow consequential accessible boundaries. Do not mistake the starting scope for the evidence boundary. Inspect a relevant sibling repository, service, infrastructure source, corpus, or other context only when the proposal or current evidence points there; do not inspect every neighboring source merely because it exists. Report materially important scope limitations, and return `REQUIRE EVIDENCE` when an unavailable, unknown, or inaccessible source prevents a responsible disposition.

Use a boundary-first, wide-before-deep pass:

1. Locate existing behavior, constraints, ownership, boundaries, duplication, and established patterns.
2. Deepen only where a fact could materially change the disposition.
3. Seek evidence that weakens or disproves an emerging objection.
4. Stop when the evidence is sufficient for the next action-relative decision, even if the larger mystery remains unsolved.

For software work, check immediate differences in runtime, authentication, authorization, networking, data ownership, deployment topology, repository or service ownership, and visible future variation. Determine whether inherited code is a requirement, an example, or historical precedent. Do not turn this pass into an exhaustive architecture review.

For other domains, adapt the inspection to the available corpus and constraints. For example, examine whether proposed writing adds a material contribution rather than merely repeating an existing idea. Do not invent domain adapters or generate the proposed artifact.

Ask the user only when information is both materially necessary to the next responsible decision and not reasonably obtainable from the environment. Ask the cheapest discriminating question, not a broad request for more context.

## Preserve evidence boundaries

Keep these categories distinct:

- **Evidence:** material directly supplied or inspected, such as file paths and relevant lines, tests, configuration, documentation, Git history, diffs, observed command results, or explicit user statements.
- **Inference:** what the evidence appears to imply.
- **Unknown:** what cannot currently be established.
- **Assumption:** an unestablished proposition on which the proposed action depends.

Make claims follow evidence. Label inferred goals and historical intent as inference. Do not use a numeric confidence score.

## Choose a disposition

Return exactly one leading disposition:

- **ACT** — Current evidence reasonably justifies the proposed action. This is not a permanent certification; materially new evidence may change the decision.
- **OBJECT** — The action as framed is not justified because evidence contradicts an important constraint or assumption, exposes duplication or disproportionate cost, or supports a smaller path. Preserve the evidenced goal with a viable alternative when possible; do not invent a goal to manufacture one.
- **REQUIRE EVIDENCE** — Available information cannot responsibly distinguish ACT from OBJECT. Identify the specific missing fact, assumption, or cheapest question that would discriminate among plausible paths.

## Report compactly

Put the disposition first. Include only sections that help the human decide what to do next. Useful sections include:

- Proposed action
- Why now
- Evidence
- Inference
- Counterevidence checked
- Unknown
- Assumption
- Alternative
- Discriminating question
- Next responsible action
- Watch for

Do not force empty boilerplate. Cite inspected evidence precisely enough to verify it. Keep the alternative smaller than or better supported than the objected-to action.

## Invoke at responsible moments

Use Object before a meaningful commitment deserves challenge. Re-run it only after a material state change, such as:

- a required assumption failing;
- scope expanding materially;
- work crossing a repository, service, data, authentication, network, deployment, ownership, or organizational boundary;
- validation differing across environments;
- an intervention failing to change the observed result;
- new evidence contradicting the reason for continuing; or
- the next action becoming substantially more expensive, irreversible, or dependent on other people.

Do not schedule check-ins, monitor continuously, or interrupt work merely because uncertainty exists.
