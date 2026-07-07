import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import path from "node:path";

const execFileAsync = promisify(execFile);

const repoRoot = process.cwd();
const defaultOutputDir = path.join(repoRoot, "chatgpt-zip-packets");
const defaultOutputName = "arcadeghosts-chatgpt-repo-review.zip";

const excludes = [
  "node_modules/*",
  ".next/*",
  ".git/*",
  ".vscode/*",
  "test-results/*",
  "playwright-report/*",
  "coverage/*",
  "persona-results/*",
  "out/*",
  "dist/*",
  ".vercel/*",
  "resume/*",
  "chatgpt-zip-packets/*",
  ".env*",
  "*.log",
  ".DS_Store",
  "**/.DS_Store",
  "public/images/*",
  "merch/**/exports/*",
  "*.png",
  "*.jpg",
  "*.jpeg",
  "*.gif",
  "*.webp",
  "*.svg",
  "*.ico",
  "*.mp4",
  "*.mov",
  "*.webm",
  "*.mp3",
  "*.wav",
  "*.ogg",
  "*.flac",
  "*.woff",
  "*.woff2",
  "*.ttf",
  "*.otf",
];

// TODO: Consider switching this archive script to `git ls-files` later so packet
// generation stays aligned with tracked source files and cleaner exclusion rules.
// TODO: Consider lightweight named profiles such as `repo-review` and `standard-review`
// so future archive requests can be handled with a short npm command.

function parseArgs(argv: string[]) {
  let outputName = defaultOutputName;
  let outputDir = defaultOutputDir;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--name" && argv[index + 1]) {
      outputName = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--output-dir" && argv[index + 1]) {
      outputDir = path.resolve(repoRoot, argv[index + 1]);
      index += 1;
    }
  }

  return {
    outputDir,
    outputName: path.basename(outputName),
  };
}

async function removeExistingArchive(outputPath: string) {
  try {
    await fs.unlink(outputPath);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      throw error;
    }
  }
}

async function main() {
  const { outputDir, outputName } = parseArgs(process.argv.slice(2));
  const outputPath = path.join(outputDir, outputName);

  await fs.mkdir(outputDir, { recursive: true });
  await removeExistingArchive(outputPath);

  const args = ["-rq", outputPath, ".", "-x", ...excludes];
  const { stdout, stderr } = await execFileAsync("zip", args, {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 20,
  });

  if (stdout.trim()) {
    console.log(stdout.trim());
  }

  if (stderr.trim()) {
    console.error(stderr.trim());
  }

  const stats = await fs.stat(outputPath);
  console.log(
    `Created ${outputPath} (${Math.round((stats.size / (1024 * 1024)) * 10) / 10} MB)`,
  );
  console.log("Excluded:");
  for (const pattern of excludes) {
    console.log(`- ${pattern}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
