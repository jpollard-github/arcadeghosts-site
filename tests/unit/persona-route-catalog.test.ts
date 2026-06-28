import assert from "node:assert/strict";
import test from "node:test";
import { personaDefinitions } from "../persona-testing/support/persona-manifest";
import { journeyScenarioDefinitions } from "../persona-testing/support/persona-scenarios";
import { getPersonaRouteCatalog } from "../persona-testing/support/site-surfaces";

test("persona route references resolve against the catalog", async () => {
  const catalog = await getPersonaRouteCatalog();
  const catalogIds = new Set(catalog.map((entry) => entry.id));
  const missingReferences = new Set<string>();

  for (const definition of personaDefinitions) {
    for (const surfaceId of [
      ...(definition.preferredSurfaceIds ?? []),
      ...(definition.ignoredSurfaceIds ?? []),
      ...(definition.deEmphasizedSurfaceIds ?? []),
    ]) {
      if (!catalogIds.has(surfaceId)) {
        missingReferences.add(`${definition.slug}: ${surfaceId}`);
      }
    }
  }

  assert.deepEqual(Array.from(missingReferences), []);
});

test("scenario route references resolve against the catalog", async () => {
  const catalog = await getPersonaRouteCatalog();
  const catalogIds = new Set(catalog.map((entry) => entry.id));
  const missingReferences = new Set<string>();

  for (const scenario of journeyScenarioDefinitions) {
    if (!catalogIds.has(scenario.defaultStartSurfaceId)) {
      missingReferences.add(`${scenario.id}: defaultStartSurfaceId -> ${scenario.defaultStartSurfaceId}`);
    }

    for (const condition of scenario.successConditions) {
      for (const surfaceId of [...(condition.allOf ?? []), ...(condition.anyOf ?? [])]) {
        if (!catalogIds.has(surfaceId)) {
          missingReferences.add(`${scenario.id}: successCondition -> ${surfaceId}`);
        }
      }
    }
  }

  assert.deepEqual(Array.from(missingReferences), []);
});

test("admin routes are never marked journey-eligible", async () => {
  const catalog = await getPersonaRouteCatalog();
  const adminLeaks = catalog.filter((entry) => entry.area === "admin" && entry.journeyEligible);

  assert.deepEqual(adminLeaks, []);
});
