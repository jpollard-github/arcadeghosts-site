export type WritingInline =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "emphasis"; children: WritingInline[] }
  | { type: "strong"; children: WritingInline[] };

export type WritingListItem = {
  children: WritingInline[];
  lists: WritingListBlock[];
};

export type WritingListBlock = {
  type: "list";
  ordered: boolean;
  items: WritingListItem[];
};

export type WritingBlock =
  | { type: "paragraph"; children: WritingInline[] }
  | { type: "blockquote"; children: WritingInline[] }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: WritingInline[] }
  | { type: "code"; language?: string; value: string }
  | WritingListBlock;

export type ParsedWriting = {
  title: string;
  blocks: WritingBlock[];
};

const listLinePattern = /^(\s*)(-|\d+\.)\s+(.*)$/;
const escapablePunctuation = new Set("\\`*_-{}[]()#+.!>");

function appendText(nodes: WritingInline[], value: string) {
  if (!value) {
    return;
  }

  const previous = nodes.at(-1);

  if (previous?.type === "text") {
    previous.value += value;
    return;
  }

  nodes.push({ type: "text", value });
}

function findClosingMarker(text: string, marker: string, start: number) {
  for (let index = start; index <= text.length - marker.length; index += 1) {
    if (text[index] === "\\") {
      index += 1;
      continue;
    }

    if (text.startsWith(marker, index)) {
      return index;
    }
  }

  return -1;
}

export function parseWritingInline(text: string): WritingInline[] {
  const nodes: WritingInline[] = [];
  let index = 0;

  while (index < text.length) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (
      character === "\\" &&
      nextCharacter &&
      escapablePunctuation.has(nextCharacter)
    ) {
      appendText(nodes, nextCharacter);
      index += 2;
      continue;
    }

    if (character === "`") {
      const closingIndex = findClosingMarker(text, "`", index + 1);

      if (closingIndex !== -1) {
        nodes.push({ type: "code", value: text.slice(index + 1, closingIndex) });
        index = closingIndex + 1;
        continue;
      }
    }

    if (text.startsWith("**", index)) {
      const closingIndex = findClosingMarker(text, "**", index + 2);

      if (closingIndex !== -1) {
        nodes.push({
          type: "strong",
          children: parseWritingInline(text.slice(index + 2, closingIndex)),
        });
        index = closingIndex + 2;
        continue;
      }
    }

    if (character === "*" || character === "_") {
      const closingIndex = findClosingMarker(text, character, index + 1);

      if (closingIndex !== -1) {
        nodes.push({
          type: "emphasis",
          children: parseWritingInline(text.slice(index + 1, closingIndex)),
        });
        index = closingIndex + 1;
        continue;
      }
    }

    appendText(nodes, character);
    index += 1;
  }

  return nodes;
}

function isOrderedListMarker(marker: string) {
  return /\d+\./.test(marker);
}

function parseList(
  lines: string[],
  startIndex: number,
  indentation: number,
): { block: WritingListBlock; nextIndex: number } {
  const firstMatch = lines[startIndex].match(listLinePattern);

  if (!firstMatch) {
    throw new Error("Expected a Markdown list item.");
  }

  const ordered = isOrderedListMarker(firstMatch[2]);
  const items: WritingListItem[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const match = lines[index].match(listLinePattern);

    if (
      !match ||
      match[1].length !== indentation ||
      isOrderedListMarker(match[2]) !== ordered
    ) {
      break;
    }

    const item: WritingListItem = {
      children: parseWritingInline(match[3].trim()),
      lists: [],
    };
    items.push(item);
    index += 1;

    while (index < lines.length && lines[index].trim() !== "") {
      const nestedMatch = lines[index].match(listLinePattern);

      if (nestedMatch && nestedMatch[1].length > indentation) {
        const nested = parseList(lines, index, nestedMatch[1].length);
        item.lists.push(nested.block);
        index = nested.nextIndex;
        continue;
      }

      const continuationIndentation =
        lines[index].length - lines[index].trimStart().length;

      if (continuationIndentation <= indentation) {
        break;
      }

      appendText(item.children, " ");
      item.children.push(...parseWritingInline(lines[index].trim()));
      index += 1;
    }
  }

  return {
    block: { type: "list", ordered, items },
    nextIndex: index,
  };
}

function startsBlock(line: string) {
  return (
    /^ {0,3}```/.test(line) ||
    /^ {0,3}#{1,6}\s+/.test(line) ||
    /^>\s?/.test(line) ||
    listLinePattern.test(line)
  );
}

export function parseWritingMarkdown(
  markdown: string,
  fallbackTitle: string,
): ParsedWriting {
  const normalized = markdown.replace(/\r\n?/g, "\n").trim();
  const lines = normalized.split("\n");
  const firstLine = lines[0] ?? "";
  const markdownTitle = firstLine.match(/^#\s+(.+?)\s*$/);
  const legacyTitle = firstLine.match(/^\*\*(.+?)\*\*\s*$/);
  const title = markdownTitle?.[1] ?? legacyTitle?.[1] ?? fallbackTitle;

  if (markdownTitle || legacyTitle) {
    lines.shift();
  }

  const blocks: WritingBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const fenceMatch = line.match(/^ {0,3}```([A-Za-z0-9_-]*)\s*$/);

    if (fenceMatch) {
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !/^ {0,3}```\s*$/.test(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push({
        type: "code",
        language: fenceMatch[1] || undefined,
        value: codeLines.join("\n"),
      });
      continue;
    }

    const headingMatch = line.match(/^ {0,3}(#{1,6})\s+(.+?)\s*$/);

    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        children: parseWritingInline(headingMatch[2]),
      });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];

      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }

      blocks.push({
        type: "blockquote",
        children: parseWritingInline(quoteLines.join(" ")),
      });
      continue;
    }

    const listMatch = line.match(listLinePattern);

    if (listMatch) {
      const list = parseList(lines, index, listMatch[1].length);
      blocks.push(list.block);
      index = list.nextIndex;
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !startsBlock(lines[index])
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      children: parseWritingInline(paragraphLines.join(" ")),
    });
  }

  return { title, blocks };
}
