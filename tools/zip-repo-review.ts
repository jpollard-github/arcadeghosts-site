import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const repoName = path.basename(repoRoot);
const outputDir = path.join(repoRoot, "repo-reviews");
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico"]);

async function main() {
  const files = await getIncludedFiles();
  const outputPath = path.join(outputDir, `${repoName}-${formatTimestamp(new Date())}.zip`);

  await fs.mkdir(outputDir, { recursive: true });
  await removeIfExists(outputPath);
  await createArchive(outputPath, files);

  const stats = await fs.stat(outputPath);
  const sampledImages = files.filter((file) => isImageFile(file));

  console.log(`Created ${path.relative(repoRoot, outputPath)}`);
  console.log(`Files included: ${files.length}`);
  console.log(`Images included: ${sampledImages.length}`);
  console.log(`Archive size: ${formatMb(stats.size)} MB`);
}

async function getIncludedFiles() {
  const repoFiles = await getRepoFiles();
  const allowedImages = await getAllowedImages(repoFiles);

  return repoFiles.filter((file) => {
    if (!isImageFile(file)) {
      return true;
    }

    return allowedImages.has(file);
  });
}

async function getRepoFiles() {
  const stdout = await runAndCollect("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"]);

  return stdout
    .split("\0")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
}

async function getAllowedImages(repoFiles: string[]) {
  const allowed = new Set<string>();
  const imageRoot = "public/images";

  for (const file of repoFiles) {
    if (!file.startsWith(`${imageRoot}/logo.`)) {
      continue;
    }

    if (isImageFile(file)) {
      allowed.add(file);
    }
  }

  const categoryDirs = await fs.readdir(imageRoot, { withFileTypes: true });

  for (const entry of categoryDirs) {
    if (!entry.isDirectory()) {
      continue;
    }

    const categoryPath = path.posix.join(imageRoot, entry.name);
    const categoryFiles = repoFiles
      .filter((file) => file.startsWith(`${categoryPath}/`) && isImageFile(file))
      .sort((left, right) => left.localeCompare(right))
      .slice(0, 2);

    for (const file of categoryFiles) {
      allowed.add(file);
    }
  }

  return allowed;
}

function createArchive(outputPath: string, files: string[]) {
  return new Promise<void>((resolve, reject) => {
    const zip = spawn("zip", ["-q", outputPath, "-@"], {
      cwd: repoRoot,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stderr = "";
    let stdout = "";

    zip.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });

    zip.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    zip.on("error", reject);

    zip.on("close", (code) => {
      if (code === 0) {
        if (stdout.trim()) {
          console.log(stdout.trim());
        }

        if (stderr.trim()) {
          console.error(stderr.trim());
        }

        resolve();
        return;
      }

      reject(new Error(`zip exited with code ${code ?? "unknown"}\n${stderr || stdout}`));
    });

    zip.stdin.write(`${files.join("\n")}\n`);
    zip.stdin.end();
  });
}

function runAndCollect(command: string, args: string[]) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
        return;
      }

      reject(new Error(`${command} exited with code ${code ?? "unknown"}\n${stderr}`));
    });
  });
}

function isImageFile(file: string) {
  return imageExtensions.has(path.extname(file).toLowerCase());
}

function formatTimestamp(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  const hours = `${value.getHours()}`.padStart(2, "0");
  const minutes = `${value.getMinutes()}`.padStart(2, "0");
  const seconds = `${value.getSeconds()}`.padStart(2, "0");

  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
}

function formatMb(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

async function removeIfExists(targetPath: string) {
  try {
    await fs.unlink(targetPath);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      throw error;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
