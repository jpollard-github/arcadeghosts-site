import { mkdir, readFile, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const maximumRemoteBytes = 20 * 1024 * 1024;
const supportedInputFormats = new Set(["jpeg", "png", "gif", "webp"]);

type Options = {
  input: string;
  output: string;
  width: number;
  height: number;
  quality: number;
  force: boolean;
};

function usage(): never {
  throw new Error(
    'Usage: npm run image:webp -- "<input path or direct image URL>" "<output .webp path>" [--width 800] [--height 1200] [--quality 82] [--force]',
  );
}

function parsePositiveInteger(value: string | undefined, flag: string) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} must be a positive integer.`);
  }
  return parsed;
}

function parseArguments(args: string[]): Options {
  const positional: string[] = [];
  let width = 800;
  let height = 1200;
  let quality = 82;
  let force = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--force") {
      force = true;
    } else if (["--width", "--height", "--quality"].includes(argument)) {
      const value = args[index + 1];
      if (value === undefined) usage();
      const parsed = parsePositiveInteger(value, argument);
      if (argument === "--width") width = parsed;
      if (argument === "--height") height = parsed;
      if (argument === "--quality") quality = parsed;
      index += 1;
    } else if (argument.startsWith("--")) {
      throw new Error(`Unknown option: ${argument}`);
    } else {
      positional.push(argument);
    }
  }

  if (positional.length !== 2) usage();
  if (quality > 100) throw new Error("--quality must be between 1 and 100.");
  return { input: positional[0], output: positional[1], width, height, quality, force };
}

function resolveRepositoryPath(value: string, label: string) {
  const resolved = path.resolve(repositoryRoot, value);
  const relative = path.relative(repositoryRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${label} must stay within the repository root.`);
  }
  return resolved;
}

async function readRemoteInput(url: URL) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Remote image request failed with HTTP ${response.status} ${response.statusText}.`);
  }

  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maximumRemoteBytes) {
    throw new Error("Remote image exceeds the 20 MB input limit.");
  }
  if (!response.body) throw new Error("Remote image response had no body.");

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytesRead = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytesRead += value.byteLength;
    if (bytesRead > maximumRemoteBytes) {
      await reader.cancel();
      throw new Error("Remote image exceeds the 20 MB input limit.");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

async function readInput(value: string) {
  let url: URL | undefined;
  try {
    url = new URL(value);
  } catch {
    return readFile(resolveRepositoryPath(value, "Input path"));
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Unsupported input protocol: ${url.protocol}`);
  }
  return readRemoteInput(url);
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (!options.output.toLowerCase().endsWith(".webp")) {
    throw new Error("Output path must end in .webp.");
  }

  const outputPath = resolveRepositoryPath(options.output, "Output path");
  try {
    await stat(outputPath);
    if (!options.force) {
      throw new Error(`Output already exists: ${outputPath}. Use --force to overwrite it.`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const input = await readInput(options.input);
  const metadata = await sharp(input, { animated: false }).metadata();
  if (!metadata.format || !supportedInputFormats.has(metadata.format)) {
    throw new Error(
      `Unsupported input format${metadata.format ? `: ${metadata.format}` : ". Expected JPEG, PNG, GIF, or WebP"}.`,
    );
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.${process.pid}.tmp`;
  try {
    const result = await sharp(input, { animated: false, pages: 1 })
      .rotate()
      .resize({
        width: options.width,
        height: options.height,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: options.quality })
      .toFile(temporaryPath);
    await rename(temporaryPath, outputPath);
    const outputStat = await stat(outputPath);
    console.log(`Created ${outputPath}`);
    console.log(`Dimensions: ${result.width}x${result.height}`);
    console.log(`Format: ${result.format}`);
    console.log(`Size: ${outputStat.size} bytes`);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Image conversion failed: ${message}`);
  process.exitCode = 1;
});
