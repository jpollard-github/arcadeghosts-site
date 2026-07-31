import assert from "node:assert/strict";
import test from "node:test";
import {
  liveWithMeContent,
  liveWithMeMailto,
  type LiveWithMeParagraph,
} from "../../app/site-content/live-with-me";

function paragraphText(paragraph: LiveWithMeParagraph) {
  return typeof paragraph === "string"
    ? paragraph
    : paragraph.map((part) => (typeof part === "string" ? part : part.text)).join("");
}

const copy = [
  ...liveWithMeContent.hero.introduction.map(paragraphText),
  liveWithMeContent.hero.note,
  ...liveWithMeContent.sections.flatMap((section) =>
    section.paragraphs.map(paragraphText),
  ),
  ...liveWithMeContent.closing.paragraphs,
].join("\n");

test("live-with-me content keeps the approved practical boundaries", () => {
  assert.match(copy, /Triad area of North Carolina/);
  assert.match(copy, /I’m looking for a woman/);
  assert.match(copy, /I’m not looking for a long-distance relationship/);
  assert.ok(
    copy.includes(
      "I’m looking for someone who wants to make room for shared time, closeness, and an ordinary life together.",
    ),
  );
  assert.ok(
    copy.includes(
      "We do not need to agree on everything, but a Trump or MAGA worldview is a fundamental incompatibility.",
    ),
  );
  assert.match(copy, /I’m not religious/);
});

test("live-with-me content keeps one approved email and playlist path", () => {
  assert.equal(
    liveWithMeMailto,
    "mailto:jason@arcadeghosts.org?subject=Live%20with%20me",
  );
  assert.equal(
    liveWithMeContent.music.href,
    "https://open.spotify.com/playlist/37i9dQZF1E8HCrv0dQ8eW5?si=bc6c1985d0c542f2",
  );
  assert.equal((copy.match(/jason@arcadeghosts\.org/g) ?? []).length, 0);
  assert.doesNotMatch(copy, /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/);
});

test("live-with-me content omits removed defensive and marketing language", () => {
  for (const phrase of [
    "prolonged audition",
    "pen-pal arrangement",
    "response-time analysis",
    "one-sided pursuit",
    "emotional hide-and-seek",
    "relationship as favor",
    "Silence may mean many things",
    "Complete sentences",
    "WhatsApp",
    "Signal username",
    "dating apps",
  ]) {
    assert.ok(!copy.toLowerCase().includes(phrase.toLowerCase()), phrase);
  }
});

test("live-with-me sections use only the fixed editorial layout model", () => {
  const approvedAlignments = new Set(["heading-left", "heading-right", "full"]);

  for (const section of liveWithMeContent.sections) {
    assert.ok(approvedAlignments.has(section.alignment));
  }
});
