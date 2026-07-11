import { promises as fs } from "node:fs";
import path from "node:path";
import {
  ambientSceneCategories,
  createEmptyAmbientSceneManifest,
  normalizeAmbientSceneManifest,
  type AmbientScene,
} from "../app/(ambient)/ambient/ambient-scenes";

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, "public", "ambient", "scenes", "manifest.json");
const allowedExtensions = new Set([".webp", ".jpg", ".jpeg", ".png"]);

function fail(message: string) {
  console.error(`[ambient:scenes:validate] ${message}`);
}

function info(message: string) {
  console.log(`[ambient:scenes:validate] ${message}`);
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function hasUniqueSceneIds(scenes: AmbientScene[]) {
  const ids = new Set<string>();

  for (const scene of scenes) {
    if (ids.has(scene.id)) {
      return false;
    }
    ids.add(scene.id);
  }

  return true;
}

async function main() {
  const manifestExists = await fileExists(manifestPath);

  if (!manifestExists) {
    fail(`Missing manifest: ${manifestPath}`);
    process.exitCode = 1;
    return;
  }

  const raw = await fs.readFile(manifestPath, "utf8");
  const manifest = normalizeAmbientSceneManifest(JSON.parse(raw));
  const errors: string[] = [];

  if (manifest.library !== "ambient-scene-library") {
    errors.push("Manifest library must be `ambient-scene-library`.");
  }

  if (manifest.version !== 1) {
    errors.push("Manifest version must be `1`.");
  }

  if (!hasUniqueSceneIds(manifest.scenes)) {
    errors.push("Scene ids must be unique.");
  }

  for (const scene of manifest.scenes) {
    if (!ambientSceneCategories.includes(scene.category)) {
      errors.push(`Scene ${scene.id} uses unknown category: ${scene.category}`);
    }

    const extension = path.extname(scene.path).toLowerCase();
    if (!allowedExtensions.has(extension)) {
      errors.push(`Scene ${scene.id} uses unsupported extension: ${scene.path}`);
    }

    const absoluteScenePath = path.join(repoRoot, "public", scene.path.replace(/^\/+/, ""));
    if (!(await fileExists(absoluteScenePath))) {
      errors.push(`Scene ${scene.id} points to a missing file: ${scene.path}`);
    }
  }

  const emptyManifest = createEmptyAmbientSceneManifest();
  const totalTargetCount = manifest.categories.reduce((sum, category) => sum + category.targetCount, 0);

  if (manifest.scenes.length === 0) {
    info("Manifest is valid and currently empty. The scene library is ready for imported assets.");
  }

  info(`Categories: ${manifest.categories.length}`);
  info(`Target capacity: ${totalTargetCount} scenes`);
  info(`Current scene count: ${manifest.scenes.length}`);

  if (manifest.categories.length !== emptyManifest.categories.length) {
    errors.push("Manifest categories do not match the expected Ambient Scene Library category count.");
  }

  if (errors.length > 0) {
    for (const error of errors) {
      fail(error);
    }
    process.exitCode = 1;
    return;
  }

  info("Manifest passed validation.");
}

void main();
