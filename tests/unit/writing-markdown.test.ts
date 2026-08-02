import assert from "node:assert/strict";
import test from "node:test";
import {
  parseWritingInline,
  parseWritingMarkdown,
  type WritingInline,
} from "../../app/lib/writing-markdown";

function inlineText(nodes: WritingInline[]): string {
  return nodes
    .map((node) =>
      node.type === "text" || node.type === "code"
        ? node.value
        : inlineText(node.children),
    )
    .join("");
}

test("parseWritingMarkdown extracts a Markdown H1 title and rich blocks", () => {
  const article = parseWritingMarkdown(
    [
      "# A New Title",
      "",
      "## A section",
      "",
      "A paragraph with `inline code`, *italic text*, _more emphasis_, and **bold text**.",
      "",
      "> A quoted *observation*.",
      "",
      "1. First step",
      "   - Nested detail",
      "     `Kept with the detail`",
      "2. Second step",
      "- First signal",
      "- Second signal",
      "",
      "```md",
      "## This stays code",
      "- So does this",
      "```",
    ].join("\n"),
    "Fallback",
  );

  assert.equal(article.title, "A New Title");
  assert.deepEqual(
    article.blocks.map((block) => block.type),
    ["heading", "paragraph", "blockquote", "list", "list", "code"],
  );

  const heading = article.blocks[0];
  assert.equal(heading.type, "heading");
  assert.equal(heading.level, 2);

  const orderedList = article.blocks[3];
  assert.equal(orderedList.type, "list");
  assert.equal(orderedList.ordered, true);
  assert.equal(orderedList.items.length, 2);
  assert.equal(orderedList.items[0].lists[0]?.ordered, false);
  assert.equal(
    inlineText(orderedList.items[0].lists[0]?.items[0].children ?? []),
    "Nested detail Kept with the detail",
  );

  const unorderedList = article.blocks[4];
  assert.equal(unorderedList.type, "list");
  assert.equal(unorderedList.ordered, false);

  const code = article.blocks[5];
  assert.deepEqual(code, {
    type: "code",
    language: "md",
    value: "## This stays code\n- So does this",
  });
});

test("parseWritingMarkdown preserves the legacy bold-title convention", () => {
  const article = parseWritingMarkdown(
    "**Thank You Yogi**\n\nIt ain't over.",
    "Fallback",
  );

  assert.equal(article.title, "Thank You Yogi");
  assert.equal(article.blocks.length, 1);
  assert.equal(article.blocks[0].type, "paragraph");
});

test("parseWritingInline distinguishes code, emphasis, bold, and escapes", () => {
  const nodes = parseWritingInline(
    "Use `AGENTS.md`, *judgment*, _safety_, **plain speech**, and \\*literal stars\\*.",
  );

  assert.deepEqual(
    nodes.map((node) => node.type),
    [
      "text",
      "code",
      "text",
      "emphasis",
      "text",
      "emphasis",
      "text",
      "strong",
      "text",
    ],
  );
  assert.equal(
    inlineText(nodes),
    "Use AGENTS.md, judgment, safety, plain speech, and *literal stars*.",
  );
});
