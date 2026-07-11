import assert from "node:assert/strict";
import test from "node:test";
import { saveHomeSpotlight } from "../../app/lib/home-spotlight-write-transactions";
import type {
  HomeSpotlightQueueItem,
  HomeSpotlightRecord,
} from "../../app/lib/home-spotlight";
import { saveNowItems } from "../../app/lib/now-write-transactions";
import type { NowItem } from "../../app/lib/now";
import {
  deleteProjectAndReorder,
  saveProjectList,
  saveProjectOrder,
  type ProjectWrite,
  type SiteSql,
} from "../../app/lib/project-write-transactions";
import {
  defaultProjects,
  seedDefaultProjectsIfEmpty,
  type SiteProject,
} from "../../app/lib/projects";

type RecordedQuery = {
  text: string;
  values: unknown[];
};

type FakeSql = {
  sql: SiteSql;
  transactionCalls: RecordedQuery[][];
};

function createFakeSql({
  count = 0,
  transactionError,
}: {
  count?: number;
  transactionError?: Error;
} = {}): FakeSql {
  const transactionCalls: RecordedQuery[][] = [];
  const tag = (strings: TemplateStringsArray, ...values: unknown[]) => {
    const query = { text: strings.join("$"), values };

    if (query.text.includes("SELECT COUNT(*)")) {
      return Promise.resolve([{ count }]);
    }

    return query;
  };
  const transaction = async (queries: RecordedQuery[]) => {
    transactionCalls.push(queries);
    if (transactionError) throw transactionError;
    return [];
  };

  return {
    sql: Object.assign(tag, { transaction }) as unknown as SiteSql,
    transactionCalls,
  };
}

function project(id: string): SiteProject {
  return {
    id,
    type: "Experiment",
    title: `Project ${id}`,
    description: `Description ${id}`,
    href: "",
    imageUrl: "",
    status: "active",
    phase: "",
    nextAction: "None",
    blockers: "",
    priority: 3,
    lastUpdatedAt: "2026-07-11",
    includeInContextRefresh: true,
  };
}

function projectWrite(id: string, displayOrder: number): ProjectWrite {
  return {
    project: project(id),
    lastUpdatedAt: "2026-07-11",
    displayOrder,
  };
}

test("project bulk save batches all upserts and removed ids once", async () => {
  const fake = createFakeSql();

  await saveProjectList(
    fake.sql,
    [projectWrite("kept-a", 0), projectWrite("kept-b", 1)],
    ["kept-a", "kept-b", "removed"],
  );

  assert.equal(fake.transactionCalls.length, 1);
  assert.equal(fake.transactionCalls[0].length, 3);
  const deleteQueries = fake.transactionCalls[0].filter(({ text }) =>
    text.includes("DELETE FROM site_projects"),
  );
  assert.deepEqual(deleteQueries.map(({ values }) => values), [["removed"]]);
});

test("project bulk save propagates transaction rejection", async () => {
  const failure = new Error("transaction failed");
  const fake = createFakeSql({ transactionError: failure });

  await assert.rejects(
    saveProjectList(fake.sql, [projectWrite("a", 0)], []),
    failure,
  );
  assert.equal(fake.transactionCalls.length, 1);
});

test("project reorder preserves submitted order in one transaction", async () => {
  const fake = createFakeSql();

  assert.equal(
    await saveProjectOrder(fake.sql, ["third", "first", "second"], ["first", "second", "third"]),
    true,
  );

  assert.equal(fake.transactionCalls.length, 1);
  assert.deepEqual(
    fake.transactionCalls[0].map(({ values }) => values),
    [[0, "third"], [1, "first"], [2, "second"]],
  );
});

test("project reorder validation failure performs no transaction", async () => {
  const fake = createFakeSql();

  assert.equal(await saveProjectOrder(fake.sql, ["first"], ["first", "second"]), false);
  assert.equal(fake.transactionCalls.length, 0);
});

test("project delete batches deletion with contiguous remaining order", async () => {
  const fake = createFakeSql();

  assert.equal(
    await deleteProjectAndReorder(fake.sql, "second", ["first", "second", "third"]),
    true,
  );

  assert.equal(fake.transactionCalls.length, 1);
  assert.equal(fake.transactionCalls[0].length, 3);
  assert.deepEqual(
    fake.transactionCalls[0].map(({ values }) => values),
    [["second"], [0, "first"], [1, "third"]],
  );
});

test("project minimum validation performs no delete transaction", async () => {
  const fake = createFakeSql();

  assert.equal(await deleteProjectAndReorder(fake.sql, "only", ["only"]), false);
  assert.equal(fake.transactionCalls.length, 0);
});

test("default project initialization batches every insert", async () => {
  const fake = createFakeSql({ count: 0 });

  await seedDefaultProjectsIfEmpty(fake.sql);

  assert.equal(fake.transactionCalls.length, 1);
  assert.equal(fake.transactionCalls[0].length, defaultProjects.length);
});

test("non-empty project table skips default seed transaction", async () => {
  const fake = createFakeSql({ count: 1 });

  await seedDefaultProjectsIfEmpty(fake.sql);

  assert.equal(fake.transactionCalls.length, 0);
});

test("Now save batches upserts and calculates removed ids", async () => {
  const fake = createFakeSql();
  const items: NowItem[] = [
    { id: "kept", label: "Doing", title: "Kept", text: "Still here" },
    { id: "new", label: "Making", title: "New", text: "Just arrived" },
  ];

  await saveNowItems(fake.sql, items, ["kept", "removed"]);

  assert.equal(fake.transactionCalls.length, 1);
  assert.equal(fake.transactionCalls[0].length, 3);
  assert.deepEqual(fake.transactionCalls[0][2].values, ["removed"]);
});

const spotlight: HomeSpotlightRecord = {
  id: "main",
  eyebrow: "Current Signal",
  title: "A spotlight",
  text: "Spotlight body",
  linkLabel: "Read more",
  linkHref: "/about",
  enabled: true,
};

function queueItem(id: string, displayOrder: number): HomeSpotlightQueueItem {
  return {
    ...spotlight,
    id,
    title: `Queue ${id}`,
    displayOrder,
  };
}

test("spotlight save batches main, queue clear, and ordered inserts", async () => {
  const fake = createFakeSql();

  await saveHomeSpotlight(fake.sql, spotlight, [queueItem("a", 9), queueItem("b", 4)]);

  assert.equal(fake.transactionCalls.length, 1);
  assert.equal(fake.transactionCalls[0].length, 4);
  assert.match(fake.transactionCalls[0][0].text, /INSERT INTO home_spotlight/);
  assert.match(fake.transactionCalls[0][1].text, /DELETE FROM home_spotlight_queue/);
  assert.deepEqual(
    fake.transactionCalls[0].slice(2).map(({ values }) => values.at(-1)),
    [0, 1],
  );
});

test("empty spotlight queue still atomically saves main and clears queue", async () => {
  const fake = createFakeSql();

  await saveHomeSpotlight(fake.sql, spotlight, []);

  assert.equal(fake.transactionCalls.length, 1);
  assert.equal(fake.transactionCalls[0].length, 2);
});

test("spotlight save propagates transaction rejection", async () => {
  const failure = new Error("queue insert failed");
  const fake = createFakeSql({ transactionError: failure });

  await assert.rejects(saveHomeSpotlight(fake.sql, spotlight, [queueItem("a", 0)]), failure);
  assert.equal(fake.transactionCalls.length, 1);
});
