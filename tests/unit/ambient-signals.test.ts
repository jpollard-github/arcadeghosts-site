import test from "node:test";
import assert from "node:assert/strict";
import { getAmbientSignalDwellMs } from "../../app/(ambient)/ambient/ambient-signals";

test("active Ambient signal kinds use deliberate dwell timing", () => {
  assert.equal(
    getAmbientSignalDwellMs({
      kind: "project",
      body: "A project signal.",
    }),
    21000,
  );

  assert.equal(
    getAmbientSignalDwellMs({
      kind: "cat",
      body: "A cat signal.",
    }),
    22000,
  );

  assert.equal(
    getAmbientSignalDwellMs({
      kind: "writing",
      body: "A writing signal.",
    }),
    23000,
  );
});

test("tiny thought dwell timing grows with reading length", () => {
  const shortThought = getAmbientSignalDwellMs({
    kind: "thought",
    body: "Short thought.",
  });
  const longThought = getAmbientSignalDwellMs({
    kind: "thought",
    body:
      "This is a much longer tiny thought with enough words and breathing room to deserve a slower dwell so it can be read from desk distance without feeling rushed.",
  });

  assert.equal(shortThought, 17000);
  assert.ok(longThought > shortThought);
  assert.ok(longThought <= 24000);
});
