import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import net from "node:net";
import process from "node:process";
import { writings } from "../app/writings";

type CrawlPage = {
  url: string;
  requestedPath: string;
  path: string;
  status: number;
  finalUrl: string;
  redirected: boolean;
  contentType: string | null;
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  htmlLang: string | null;
  internalLinks: string[];
  imageUrls: string[];
  downloadUrls: string[];
};

type AssetCheck = {
  url: string;
  status: number | null;
  ok: boolean;
  error?: string;
};

type LighthouseCategoryScore = {
  id: string;
  score: number | null;
};

type LighthouseMetric = {
  label: string;
  value: string;
};

type LighthouseRun = {
  label: "mobile" | "desktop";
  auditedUrl: string;
  categories: LighthouseCategoryScore[];
  metrics: LighthouseMetric[];
};

type LighthouseSummary = {
  source: "lighthouse" | "skipped";
  note: string;
  runs: LighthouseRun[];
};

const repoRoot = process.cwd();
const publicAppDir = path.join(repoRoot, "app");
const reviewDir = path.join(repoRoot, "review-packets");
const dynamicWritingRoutes = new Set(writings.map((writing) => `/writings/${writing.slug}`));
const downloadExtensions = new Set([
  ".pdf",
  ".zip",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
  ".json",
  ".txt",
  ".ics",
  ".xml",
]);
const ignoredPrefixes = ["/admin", "/api", "/error-preview"];

async function main() {
  const startedAt = new Date();
  const configuredBaseUrl = process.env.WEBSITE_AUDIT_URL?.trim();
  const reusedLocalServer = configuredBaseUrl ? null : await detectExistingLocalServer();
  const port = configuredBaseUrl || reusedLocalServer ? null : await getAvailablePort();
  const baseUrl = configuredBaseUrl || reusedLocalServer || `http://127.0.0.1:${port}`;
  const server = configuredBaseUrl || reusedLocalServer ? null : await startDevServer(port!);

  try {
    await waitForUrl(baseUrl);

    const knownRoutes = await discoverPublicRoutes();
    const crawl = await crawlSite(baseUrl);
    const crawledPaths = new Set(crawl.pages.map((page) => page.path));

    const allInternalLinks = new Set(crawl.pages.flatMap((page) => page.internalLinks));
    const imageChecks = await verifyAssets(uniqueInternalUrls(crawl.pages.flatMap((page) => page.imageUrls), baseUrl));
    const downloadChecks = await verifyAssets(uniqueInternalUrls(crawl.pages.flatMap((page) => page.downloadUrls), baseUrl));
    const duplicates = findDuplicateTitles(crawl.pages);
    const metadataFindings = findMetadataFindings(crawl.pages);
    const orphanedRoutes = knownRoutes.filter((route) => route !== "/" && !allInternalLinks.has(route));
    const uncrawledKnownRoutes = knownRoutes.filter((route) => !crawledPaths.has(route));
    const brokenInternalLinks = crawl.brokenLinks;
    const lighthouse = await runLighthouseAudit(baseUrl);

    const reportPath = await writeReport({
      startedAt,
      finishedAt: new Date(),
      baseUrl,
      usedExistingServer: Boolean(configuredBaseUrl || reusedLocalServer),
      knownRoutes,
      crawlPages: crawl.pages,
      brokenInternalLinks,
      imageChecks,
      downloadChecks,
      duplicates,
      metadataFindings,
      orphanedRoutes,
      uncrawledKnownRoutes,
      lighthouse,
    });

    nodeLog(`Website audit complete: ${path.relative(repoRoot, reportPath)}`);
  } finally {
    if (server) {
      server.kill("SIGINT");
      await waitForExit(server);
    }
  }
}

async function discoverPublicRoutes() {
  const routeFiles = await walkFiles(publicAppDir);
  const publicRoutes = new Set<string>(["/"]);

  for (const file of routeFiles) {
    if (!file.endsWith(`${path.sep}page.tsx`)) {
      continue;
    }

    const relative = path.relative(publicAppDir, file);

    if (
      relative.startsWith(`admin${path.sep}`) ||
      relative.startsWith(`api${path.sep}`) ||
      relative.startsWith(`error-preview${path.sep}`)
    ) {
      continue;
    }

    const route = routeFromPageFile(relative);

    if (route.includes("[slug]")) {
      if (route === "/writings/[slug]") {
        for (const writingRoute of Array.from(dynamicWritingRoutes)) {
          publicRoutes.add(writingRoute);
        }
      }

      continue;
    }

    publicRoutes.add(route);
  }

  return Array.from(publicRoutes).sort();
}

function routeFromPageFile(relativePath: string) {
  if (relativePath === "page.tsx") {
    return "/";
  }

  const withoutPage = relativePath.replace(new RegExp(`${escapeRegex(path.sep)}page\\.tsx$`), "");
  if (!withoutPage) {
    return "/";
  }

  return normalizeRoutePath(`/${withoutPage.split(path.sep).join("/")}`);
}

async function crawlSite(baseUrl: string) {
  const queue = ["/"];
  const seen = new Set<string>();
  const pages: CrawlPage[] = [];
  const brokenLinks: string[] = [];

  while (queue.length > 0) {
    const nextPath = queue.shift();

    if (!nextPath || seen.has(nextPath)) {
      continue;
    }

    seen.add(nextPath);

    const page = await fetchPage(baseUrl, nextPath);
    pages.push(page);

    if (page.status >= 400) {
      brokenLinks.push(nextPath);
      continue;
    }

    for (const linkPath of page.internalLinks) {
      if (!seen.has(linkPath) && !queue.includes(linkPath)) {
        queue.push(linkPath);
      }
    }
  }

  pages.sort((a, b) => a.path.localeCompare(b.path));

  return { pages, brokenLinks };
}

async function fetchPage(baseUrl: string, routePath: string): Promise<CrawlPage> {
  const url = new URL(routePath, ensureTrailingSlashOrigin(baseUrl)).toString();
  const response = await fetch(url, { redirect: "follow" });
  const html = await response.text();
  const finalUrl = response.url;

  return {
    url,
    requestedPath: routePath,
    path: normalizeRoutePath(new URL(finalUrl).pathname),
    status: response.status,
    finalUrl,
    redirected: response.redirected,
    contentType: response.headers.get("content-type"),
    title: extractTitle(html),
    description: extractMeta(html, "name", "description"),
    canonical: extractCanonical(html),
    ogTitle: extractMeta(html, "property", "og:title"),
    ogDescription: extractMeta(html, "property", "og:description"),
    htmlLang: extractHtmlLang(html),
    internalLinks: extractInternalLinks(html, baseUrl),
    imageUrls: extractImageUrls(html, baseUrl),
    downloadUrls: extractDownloadUrls(html, baseUrl),
  };
}

function extractTitle(html: string) {
  return extractTagContent(html, "title");
}

function extractHtmlLang(html: string) {
  const match = html.match(/<html[^>]*\slang=["']([^"']+)["']/i);
  return match?.[1]?.trim() || null;
}

function extractMeta(html: string, attribute: "name" | "property", value: string) {
  const tagMatches = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of tagMatches) {
    const attrValue = extractAttribute(tag, attribute);
    if (attrValue?.toLowerCase() !== value.toLowerCase()) {
      continue;
    }

    const content = extractAttribute(tag, "content");
    if (content) {
      return content;
    }
  }

  return null;
}

function extractCanonical(html: string) {
  const tagMatches = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of tagMatches) {
    const rel = extractAttribute(tag, "rel");
    if (rel?.toLowerCase() !== "canonical") {
      continue;
    }

    const href = extractAttribute(tag, "href");
    if (href) {
      return href;
    }
  }

  return null;
}

function extractTagContent(html: string, tagName: string) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = html.match(regex);
  return match?.[1]?.replace(/\s+/g, " ").trim() || null;
}

function extractAttribute(tag: string, attribute: string) {
  const regex = new RegExp(`${attribute}=["']([^"']+)["']`, "i");
  const match = tag.match(regex);
  return match?.[1]?.trim() || null;
}

function extractInternalLinks(html: string, baseUrl: string) {
  const tagMatches = html.match(/<a\b[^>]*href=["'][^"']+["'][^>]*>/gi) ?? [];
  const links = new Set<string>();

  for (const tag of tagMatches) {
    const href = extractAttribute(tag, "href");
    const normalized = normalizeDiscoveredUrl(href, baseUrl);

    if (normalized) {
      links.add(normalized);
    }
  }

  return Array.from(links).sort();
}

function extractImageUrls(html: string, baseUrl: string) {
  const tagMatches = html.match(/<img\b[^>]*src=["'][^"']+["'][^>]*>/gi) ?? [];
  const urls = new Set<string>();

  for (const tag of tagMatches) {
    const src = extractAttribute(tag, "src");
    const normalized = normalizeAssetUrl(src, baseUrl);

    if (normalized) {
      urls.add(normalized);
    }
  }

  return Array.from(urls).sort();
}

function extractDownloadUrls(html: string, baseUrl: string) {
  const tagMatches = html.match(/<a\b[^>]*href=["'][^"']+["'][^>]*>/gi) ?? [];
  const urls = new Set<string>();

  for (const tag of tagMatches) {
    const href = extractAttribute(tag, "href");
    if (!href) {
      continue;
    }

    const isDownload = tag.includes(" download") || hasDownloadExtension(href);
    if (!isDownload) {
      continue;
    }

    const normalized = normalizeAssetUrl(href, baseUrl);
    if (normalized) {
      urls.add(normalized);
    }
  }

  return Array.from(urls).sort();
}

function hasDownloadExtension(href: string) {
  try {
    const url = new URL(href, "https://example.com");
    return downloadExtensions.has(path.extname(url.pathname).toLowerCase());
  } catch {
    return false;
  }
}

function normalizeDiscoveredUrl(href: string | null | undefined, baseUrl: string) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
    return null;
  }

  try {
    const url = new URL(href, ensureTrailingSlashOrigin(baseUrl));
    const origin = new URL(baseUrl).origin;

    if (url.origin !== origin) {
      return null;
    }

    const routePath = normalizeRoutePath(url.pathname);

    if (ignoredPrefixes.some((prefix) => routePath === prefix || routePath.startsWith(`${prefix}/`))) {
      return null;
    }

    return routePath;
  } catch {
    return null;
  }
}

function normalizeAssetUrl(href: string | null | undefined, baseUrl: string) {
  if (!href || href.startsWith("data:") || href.startsWith("blob:")) {
    return null;
  }

  try {
    const url = new URL(href, ensureTrailingSlashOrigin(baseUrl));
    if (url.origin !== new URL(baseUrl).origin) {
      return null;
    }

    if (url.pathname === "/_next/image") {
      const nestedUrl = url.searchParams.get("url");
      if (nestedUrl) {
        return normalizeAssetUrl(nestedUrl, baseUrl);
      }
    }

    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function normalizeRoutePath(routePath: string) {
  if (routePath.endsWith("/index.html")) {
    routePath = routePath.slice(0, -"/index.html".length) || "/";
  }

  if (routePath === "/") {
    return routePath;
  }

  return routePath.replace(/\/+$/, "") || "/";
}

function uniqueInternalUrls(urls: string[], baseUrl: string) {
  const origin = new URL(baseUrl).origin;
  return Array.from(new Set(urls.filter((url) => new URL(url).origin === origin))).sort();
}

async function verifyAssets(urls: string[]) {
  const checks: AssetCheck[] = [];

  for (const url of urls) {
    checks.push(await checkAsset(url));
  }

  return checks.sort((a, b) => a.url.localeCompare(b.url));
}

async function checkAsset(url: string): Promise<AssetCheck> {
  try {
    let response = await fetch(url, { method: "HEAD", redirect: "follow" });

    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, { method: "GET", redirect: "follow" });
      await response.arrayBuffer();
    }

    return {
      url,
      status: response.status,
      ok: response.ok,
    };
  } catch (error) {
    return {
      url,
      status: null,
      ok: false,
      error: error instanceof Error ? error.message : "Unknown asset verification error.",
    };
  }
}

function findDuplicateTitles(pages: CrawlPage[]) {
  const titles = new Map<string, string[]>();

  for (const page of pages) {
    if (!page.title || page.redirected || !isHtmlPage(page)) {
      continue;
    }

    const entries = titles.get(page.title) ?? [];
    entries.push(page.requestedPath);
    titles.set(page.title, entries);
  }

  return Array.from(titles.entries())
    .filter(([, paths]) => paths.length > 1)
    .map(([title, paths]) => ({ title, paths: paths.sort() }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

function findMetadataFindings(pages: CrawlPage[]) {
  const findings: Array<{ path: string; issues: string[] }> = [];

  for (const page of pages) {
    if (!isHtmlPage(page)) {
      continue;
    }

    const issues: string[] = [];

    if (!page.title) {
      issues.push("missing <title>");
    }

    if (!page.description) {
      issues.push("missing meta description");
    }

    if (!page.canonical) {
      issues.push("missing canonical link");
    }

    if (!page.ogTitle) {
      issues.push("missing og:title");
    }

    if (!page.ogDescription) {
      issues.push("missing og:description");
    }

    if (!page.htmlLang) {
      issues.push("missing html lang");
    }

    if (issues.length > 0) {
      findings.push({ path: page.path, issues });
    }
  }

  return findings.sort((a, b) => a.path.localeCompare(b.path));
}

function isHtmlPage(page: CrawlPage) {
  return page.contentType?.toLowerCase().includes("text/html") ?? false;
}

async function runLighthouseAudit(baseUrl: string): Promise<LighthouseSummary> {
  const lighthouseCommand = await findLocalLighthouseCommand();

  if (lighthouseCommand) {
    try {
      const mobileRun = await runSingleLighthouseAudit(lighthouseCommand.command, baseUrl, "mobile");
      const desktopRun = await runSingleLighthouseAudit(lighthouseCommand.command, baseUrl, "desktop");

      return {
        source: "lighthouse",
        note: "Local Lighthouse CLI audits completed against the homepage for both mobile and desktop.",
        runs: [mobileRun, desktopRun],
      };
    } catch (error) {
      return {
      source: "skipped",
      note: `Lighthouse CLI was found but failed before results could be captured. ${error instanceof Error ? error.message : ""}`.trim(),
      runs: [],
    };
  }
  }

  return {
    source: "skipped",
    note: "Lighthouse CLI is not installed locally, so Lighthouse results were skipped.",
    runs: [],
  };
}

async function runSingleLighthouseAudit(
  command: string,
  baseUrl: string,
  formFactor: LighthouseRun["label"],
): Promise<LighthouseRun> {
  const result = await runCommand(command, getLighthouseArgs(baseUrl, formFactor), 180_000);
  const parsed = JSON.parse(result.stdout) as {
    finalDisplayedUrl?: string;
    categories?: Record<string, { score?: number | null }>;
    audits?: Record<string, { displayValue?: string; numericValue?: number | null }>;
  };

  const categories = Object.entries(parsed.categories ?? {})
    .map(([id, value]) => ({
      id,
      score: typeof value.score === "number" ? Math.round(value.score * 100) : null,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  const metrics = [
    formatLighthouseMetric(parsed, "first-contentful-paint", "First contentful paint", "ms"),
    formatLighthouseMetric(parsed, "largest-contentful-paint", "Largest contentful paint", "ms"),
    formatLighthouseMetric(parsed, "speed-index", "Speed index", "ms"),
    formatLighthouseMetric(parsed, "total-blocking-time", "Total blocking time", "ms"),
    formatLighthouseMetric(parsed, "cumulative-layout-shift", "Cumulative layout shift"),
  ].filter((metric): metric is LighthouseMetric => metric !== null);

  return {
    label: formFactor,
    auditedUrl: parsed.finalDisplayedUrl ?? baseUrl,
    categories,
    metrics,
  };
}

function getLighthouseArgs(baseUrl: string, formFactor: LighthouseRun["label"]) {
  const args = [
    baseUrl,
    "--quiet",
    "--output=json",
    "--output-path=stdout",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage",
  ];

  if (formFactor === "desktop") {
    args.push("--preset=desktop");
  } else {
    args.push("--form-factor=mobile");
  }

  return args;
}

function formatLighthouseMetric(
  parsed: {
    audits?: Record<string, { displayValue?: string; numericValue?: number | null }>;
  },
  auditId: string,
  label: string,
  numericUnit?: "ms",
) {
  const audit = parsed.audits?.[auditId];

  if (!audit) {
    return null;
  }

  if (audit.displayValue) {
    return { label, value: audit.displayValue };
  }

  if (typeof audit.numericValue === "number") {
    if (numericUnit === "ms") {
      return { label, value: `${Math.round(audit.numericValue)} ms` };
    }

    return { label, value: String(audit.numericValue) };
  }

  return { label, value: "n/a" };
}

async function findLocalLighthouseCommand() {
  const repoBinary = path.join(repoRoot, "node_modules", ".bin", process.platform === "win32" ? "lighthouse.cmd" : "lighthouse");

  try {
    await fs.access(repoBinary);
    return {
      command: repoBinary,
      args: (baseUrl: string) => [
        baseUrl,
        "--quiet",
        "--chrome-flags=--headless=new",
        "--output=json",
        "--output-path=stdout",
        "--only-categories=performance,accessibility,best-practices,seo",
      ],
    };
  } catch {
    return null;
  }
}

async function writeReport(input: {
  startedAt: Date;
  finishedAt: Date;
  baseUrl: string;
  usedExistingServer: boolean;
  knownRoutes: string[];
  crawlPages: CrawlPage[];
  brokenInternalLinks: string[];
  imageChecks: AssetCheck[];
  downloadChecks: AssetCheck[];
  duplicates: Array<{ title: string; paths: string[] }>;
  metadataFindings: Array<{ path: string; issues: string[] }>;
  orphanedRoutes: string[];
  uncrawledKnownRoutes: string[];
  lighthouse: LighthouseSummary;
}) {
  await fs.mkdir(reviewDir, { recursive: true });

  const stamp = formatReportStamp(input.startedAt);
  const filename = `website-audit-${stamp}.md`;
  const reportPath = path.join(reviewDir, filename);

  const brokenImages = input.imageChecks.filter((check) => !check.ok);
  const brokenDownloads = input.downloadChecks.filter((check) => !check.ok);
  const failedPages = input.crawlPages.filter((page) => page.status >= 400);

  const report = [
    "# Website Audit",
    "",
    `- Started: ${input.startedAt.toISOString()}`,
    `- Finished: ${input.finishedAt.toISOString()}`,
    `- Base URL: ${input.baseUrl}`,
    `- Server: ${input.usedExistingServer ? "existing URL" : "temporary local Next dev server"}`,
    "",
    "## Summary",
    "",
    `- Known public routes: ${input.knownRoutes.length}`,
    `- Crawled pages: ${input.crawlPages.length}`,
    `- Broken pages: ${failedPages.length}`,
    `- Broken internal links: ${input.brokenInternalLinks.length}`,
    `- Broken images: ${brokenImages.length} of ${input.imageChecks.length}`,
    `- Broken downloads: ${brokenDownloads.length} of ${input.downloadChecks.length}`,
    `- Duplicate titles: ${input.duplicates.length}`,
    `- Missing metadata pages: ${input.metadataFindings.length}`,
    `- Orphaned pages: ${input.orphanedRoutes.length}`,
    `- Known routes not reached by crawler: ${input.uncrawledKnownRoutes.length}`,
    "",
    "## Crawl Results",
    "",
    ...input.crawlPages.map((page) =>
      `- ${page.requestedPath} -> ${page.status}${page.redirected ? ` (redirected to ${page.finalUrl})` : ""}${page.title ? ` | ${page.title}` : ""}`,
    ),
    "",
    "## Broken Pages",
    "",
    ...(failedPages.length > 0 ? failedPages.map((page) => `- ${page.requestedPath} -> ${page.status}`) : ["- None"]),
    "",
    "## Internal Link Issues",
    "",
    ...(input.brokenInternalLinks.length > 0 ? input.brokenInternalLinks.map((link) => `- ${link}`) : ["- None"]),
    "",
    "## Image Verification",
    "",
    ...(input.imageChecks.length > 0
      ? [
          `- Verified internal images: ${input.imageChecks.length}`,
          `- Broken internal images: ${brokenImages.length}`,
          ...(brokenImages.length > 0
            ? brokenImages.map((check) => `- ${new URL(check.url).pathname} -> ${formatAssetStatus(check)}`)
            : ["- No broken internal images found."]),
        ]
      : ["- No internal images were found in server-rendered HTML."]),
    "",
    "## Download Verification",
    "",
    ...(input.downloadChecks.length > 0
      ? [
          `- Verified internal downloads: ${input.downloadChecks.length}`,
          `- Broken internal downloads: ${brokenDownloads.length}`,
          ...(brokenDownloads.length > 0
            ? brokenDownloads.map((check) => `- ${new URL(check.url).pathname} -> ${formatAssetStatus(check)}`)
            : ["- No broken internal downloads found."]),
        ]
      : ["- No internal download links were found."]),
    "",
    "## Duplicate Titles",
    "",
    ...(input.duplicates.length > 0
      ? input.duplicates.map((duplicate) => `- ${duplicate.title}: ${duplicate.paths.join(", ")}`)
      : ["- None"]),
    "",
    "## Missing Metadata",
    "",
    ...(input.metadataFindings.length > 0
      ? input.metadataFindings.map((finding) => `- ${finding.path}: ${finding.issues.join("; ")}`)
      : ["- None"]),
    "",
    "## Orphaned Pages",
    "",
    ...(input.orphanedRoutes.length > 0 ? input.orphanedRoutes.map((route) => `- ${route}`) : ["- None"]),
    "",
    "## Known Routes Not Reached By Crawl",
    "",
    ...(input.uncrawledKnownRoutes.length > 0 ? input.uncrawledKnownRoutes.map((route) => `- ${route}`) : ["- None"]),
    "",
    "## Lighthouse",
    "",
    `- Source: ${input.lighthouse.source}`,
    `- Note: ${input.lighthouse.note}`,
    ...(input.lighthouse.runs.length > 0
      ? input.lighthouse.runs.flatMap((run) => [
          "",
          `### ${capitalize(run.label)}`,
          "",
          `- Audited URL: ${run.auditedUrl}`,
          ...run.categories.map((category) => `- ${category.id}: ${category.score ?? "n/a"}`),
          ...(run.metrics.length > 0 ? ["", ...run.metrics.map((metric) => `- ${metric.label}: ${metric.value}`)] : []),
        ])
      : []),
    "",
  ].join("\n");

  await fs.writeFile(reportPath, report, "utf8");
  return reportPath;
}

function formatAssetStatus(check: AssetCheck) {
  if (check.ok) {
    return `${check.status}`;
  }

  if (check.status) {
    return `${check.status}${check.error ? ` (${check.error})` : ""}`;
  }

  return check.error ?? "failed";
}

function formatReportStamp(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  const seconds = `${date.getSeconds()}`.padStart(2, "0");
  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
}

async function startDevServer(port: number) {
  const child = spawn("npm", ["run", "dev", "--", "--port", String(port)], {
    cwd: repoRoot,
    env: {
      ...process.env,
      PORT: String(port),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    if (text.includes("Ready")) {
      nodeLog(`Local dev server ready on port ${port}`);
    }
  });

  child.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    if (text.trim()) {
      nodeLog(text.trim());
    }
  });

  return child;
}

async function waitForUrl(baseUrl: string) {
  const started = Date.now();

  while (Date.now() - started < 120_000) {
    try {
      const response = await fetch(baseUrl, { redirect: "follow" });
      if (response.ok) {
        return;
      }
    } catch {
      // Wait and retry.
    }

    await sleep(1000);
  }

  throw new Error(`Timed out waiting for ${baseUrl}`);
}

async function getAvailablePort() {
  return await new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Unable to allocate a local port for website audit."));
        return;
      }

      const { port } = address;
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
}

async function detectExistingLocalServer() {
  const candidates = ["http://127.0.0.1:3000", "http://localhost:3000"];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { redirect: "follow" });
      if (response.ok) {
        nodeLog(`Reusing existing local server at ${candidate}`);
        return candidate;
      }
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

function ensureTrailingSlashOrigin(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runCommand(command: string, args: string[], timeoutMs: number) {
  return await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`Command timed out: ${command} ${args.join(" ")}`));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on("exit", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(new Error(stderr.trim() || stdout.trim() || `Command exited with code ${code}`));
    });
  });
}

async function waitForExit(child: ReturnType<typeof spawn>) {
  if (child.exitCode !== null) {
    return;
  }

  await new Promise<void>((resolve) => {
    child.once("exit", () => resolve());
  });
}

function nodeLog(message: string) {
  process.stdout.write(`[website:audit] ${message}\n`);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

void main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`);
  process.exitCode = 1;
});
