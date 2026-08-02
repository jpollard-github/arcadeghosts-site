import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { serializeJsonLd } from "../../../lib/json-ld";
import {
  parseWritingMarkdown,
  type WritingBlock,
  type WritingInline,
  type WritingListBlock,
} from "../../../lib/writing-markdown";
import { RelatedSignals } from "../../../RelatedSignals";
import { absoluteUrl } from "../../../seo";
import { writings } from "../../../writings";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const addendumTitle = "Addendum: The Good, the Bad, and the Ugly";

function getWriting(slug: string) {
  return writings.find((writing) => writing.slug === slug);
}

async function getMarkdown(slug: string) {
  const writing = getWriting(slug);

  if (!writing) {
    notFound();
  }

  return readFile(
    path.join(process.cwd(), "public", "writings", `${writing.slug}.md`),
    "utf8",
  );
}

function renderInline(nodes: WritingInline[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;

    switch (node.type) {
      case "text":
        return node.value;
      case "code":
        return <code key={key}>{node.value}</code>;
      case "emphasis":
        return <em key={key}>{renderInline(node.children, key)}</em>;
      case "strong":
        return <strong key={key}>{renderInline(node.children, key)}</strong>;
    }
  });
}

function getInlineText(nodes: WritingInline[]): string {
  return nodes
    .map((node) =>
      node.type === "text" || node.type === "code"
        ? node.value
        : getInlineText(node.children),
    )
    .join("");
}

function renderList(block: WritingListBlock, key: string): ReactNode {
  const items = block.items.map((item, itemIndex) => (
    <li key={`${key}-item-${itemIndex}`}>
      {renderInline(item.children, `${key}-item-${itemIndex}`)}
      {item.lists.map((list, listIndex) =>
        renderList(list, `${key}-item-${itemIndex}-list-${listIndex}`),
      )}
    </li>
  ));

  return block.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>;
}

function renderHeading(block: Extract<WritingBlock, { type: "heading" }>, key: string) {
  const children = renderInline(block.children, key);

  switch (block.level) {
    case 1:
      return <h1 key={key}>{children}</h1>;
    case 2:
      return <h2 key={key}>{children}</h2>;
    case 3:
      return <h3 key={key}>{children}</h3>;
    case 4:
      return <h4 key={key}>{children}</h4>;
    case 5:
      return <h5 key={key}>{children}</h5>;
    case 6:
      return <h6 key={key}>{children}</h6>;
  }
}

function renderBlock(block: WritingBlock, index: number): ReactNode {
  const key = `writing-block-${index}`;

  switch (block.type) {
    case "paragraph":
      return <p key={key}>{renderInline(block.children, key)}</p>;
    case "blockquote":
      return <blockquote key={key}>{renderInline(block.children, key)}</blockquote>;
    case "heading":
      return renderHeading(block, key);
    case "code":
      return (
        <pre key={key}>
          <code className={block.language ? `language-${block.language}` : undefined}>
            {block.value}
          </code>
        </pre>
      );
    case "list":
      return renderList(block, key);
  }
}

export function generateStaticParams() {
  return writings.map((writing) => ({
    slug: writing.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const writing = getWriting(slug);

  if (!writing) {
    return {
      title: "Writing",
      description: "Essays and short writing from Jason Pollard on ArcadeGhosts.",
    };
  }

  return {
    title: writing.title,
    description: writing.description,
    alternates: {
      canonical: `/writings/${writing.slug}`,
    },
    openGraph: {
      type: "article",
      title: writing.title,
      description: writing.description,
      url: `/writings/${writing.slug}`,
      authors: ["Jason Pollard"],
    },
  };
}

export default async function WritingPage({ params }: PageProps) {
  const { slug } = await params;
  const writing = getWriting(slug);

  if (!writing) {
    notFound();
  }

  const markdown = await getMarkdown(slug);
  const article = parseWritingMarkdown(markdown, writing.title);
  const addendumIndex = article.blocks.findIndex(
    (block) =>
      block.type === "heading" &&
      block.level === 1 &&
      getInlineText(block.children) === addendumTitle,
  );
  const articleBlocks =
    addendumIndex === -1 ? article.blocks : article.blocks.slice(0, addendumIndex);
  const addendumHeading =
    addendumIndex === -1
      ? undefined
      : (article.blocks[addendumIndex] as Extract<
          WritingBlock,
          { type: "heading" }
        >);
  const addendumBlocks =
    addendumIndex === -1 ? [] : article.blocks.slice(addendumIndex + 1);

  return (
    <main className="writing-page">
      <article className="writing-article">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: writing.title,
              description: writing.description,
              url: absoluteUrl(`/writings/${writing.slug}`),
              author: {
                "@type": "Person",
                name: "Jason Pollard",
              },
            }),
          }}
        />
        <Link className="back-link" href="/#writing">
          Back to Writing
        </Link>
        <p className="eyebrow">
          <span aria-hidden="true">{writing.icon}</span> Writing
        </p>
        <h1>{article.title}</h1>
        <div className="writing-body">
          {articleBlocks.map(renderBlock)}
          {addendumHeading ? (
            <details className="writing-addendum">
              <summary>
                <span
                  aria-level={1}
                  className="writing-addendum-title"
                  role="heading"
                >
                  {renderInline(addendumHeading.children, "writing-addendum-title")}
                </span>
                <span aria-hidden="true" className="writing-addendum-marker" />
              </summary>
              <div className="writing-addendum-body">
                {addendumBlocks.map((block, index) =>
                  renderBlock(block, addendumIndex + index + 1),
                )}
              </div>
            </details>
          ) : null}
        </div>
        <RelatedSignals items={writing.related} />
      </article>
    </main>
  );
}
