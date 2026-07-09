import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyAmbientSceneManifest,
  normalizeAmbientSceneManifest,
  selectAmbientSceneForSignal,
  type AmbientScene,
} from "../../app/ambient/ambient-scenes";

test("empty ambient scene manifest includes categories and no scenes", () => {
  const manifest = createEmptyAmbientSceneManifest();

  assert.equal(manifest.library, "ambient-scene-library");
  assert.equal(manifest.version, 1);
  assert.equal(manifest.scenes.length, 0);
  assert.ok(manifest.categories.length >= 12);
});

test("normalizeAmbientSceneManifest keeps valid scenes only", () => {
  const manifest = normalizeAmbientSceneManifest({
    version: 1,
    library: "ambient-scene-library",
    lastUpdatedAt: "2026-07-03T00:00:00.000Z",
    categories: createEmptyAmbientSceneManifest().categories,
    scenes: [
      {
        id: "misty-forest-01",
        category: "misty-forests",
        title: "Forest",
        path: "/ambient/scenes/misty-forests/misty-forest-01.webp",
        moodTags: ["foggy", "quiet"],
        brightness: "dark",
        textOverlaySuitability: "excellent",
        preferredUse: "side-panel",
        weight: 4,
        notes: "Nice negative space",
      },
      {
        id: "",
        category: "broken",
      },
    ],
  });

  assert.equal(manifest.scenes.length, 1);
  assert.equal(manifest.scenes[0]?.id, "misty-forest-01");
});

test("selectAmbientSceneForSignal prefers overlay-friendly category matches", () => {
  const scenes: AmbientScene[] = [
    {
      id: "now-desk",
      category: "cozy-desks",
      title: "Desk Lamp",
      path: "/ambient/scenes/cozy-desks/desk-lamp.webp",
      moodTags: ["warm", "desk"],
      brightness: "dark",
      textOverlaySuitability: "excellent",
      preferredUse: "side-panel",
      weight: 5,
      notes: "",
    },
    {
      id: "city-glow",
      category: "city-streets",
      title: "Street",
      path: "/ambient/scenes/city-streets/street.webp",
      moodTags: ["wet", "night"],
      brightness: "medium",
      textOverlaySuitability: "good",
      preferredUse: "side-panel",
      weight: 2,
      notes: "",
    },
  ];

  const selected = selectAmbientSceneForSignal(
    {
      id: "project-123",
      kind: "project",
    },
    scenes,
  );

  assert.equal(selected?.imageSrc, "/ambient/scenes/cozy-desks/desk-lamp.webp");
  assert.equal(selected?.imageAlt, "Desk Lamp");
});
