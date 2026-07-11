import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  checksumMigration,
  loadMigrationFiles,
  parseMigrationFilename,
  planMigrations,
  splitMigrationStatements,
  type MigrationFile,
} from "../../scripts/database-migrations";

function temporaryMigrationDirectory() {
  return mkdtempSync(join(tmpdir(), "arcadeghosts-migrations-"));
}

function writeMigration(directory: string, filename: string, sql = "SELECT 1") {
  writeFileSync(join(directory, filename), sql, "utf8");
}

function migration(overrides: Partial<MigrationFile> = {}): MigrationFile {
  return {
    version: "001",
    filename: "001_baseline.sql",
    checksum: "checksum-001",
    sql: "SELECT 1",
    statements: ["SELECT 1"],
    ...overrides,
  };
}

test("migration files sort deterministically by numeric version", () => {
  const directory = temporaryMigrationDirectory();
  writeMigration(directory, "010_tenth.sql");
  writeMigration(directory, "002_second.sql");
  writeMigration(directory, "001_first.sql");

  assert.deepEqual(
    loadMigrationFiles(directory).map(({ version }) => version),
    ["001", "002", "010"],
  );
});

test("malformed migration filenames are rejected", () => {
  assert.throws(
    () => parseMigrationFilename("baseline.sql"),
    /Malformed migration filename/,
  );
  assert.throws(
    () => parseMigrationFilename("001-Baseline.sql"),
    /Malformed migration filename/,
  );
});

test("duplicate numeric migration versions are rejected", () => {
  const directory = temporaryMigrationDirectory();
  writeMigration(directory, "001_first.sql");
  writeMigration(directory, "1_duplicate.sql");

  assert.throws(() => loadMigrationFiles(directory), /Duplicate migration version/);
});

test("migration checksums use SHA-256", () => {
  assert.equal(
    checksumMigration("SELECT 1"),
    "e004ebd5b5532a4b85984a62f8ad48a81aa3460c1ca07701f386135d72cdecf5",
  );
});

test("migration planning detects a changed applied checksum", () => {
  const plan = planMigrations([migration()], [
    {
      version: "001",
      filename: "001_baseline.sql",
      checksum: "changed",
    },
  ]);

  assert.equal(plan.applied.length, 0);
  assert.equal(plan.pending.length, 0);
  assert.match(plan.mismatches[0]?.reason ?? "", /checksum differs/);
});

test("migration planning classifies applied and pending files", () => {
  const first = migration();
  const second = migration({
    version: "002",
    filename: "002_next.sql",
    checksum: "checksum-002",
  });
  const plan = planMigrations([first, second], [
    {
      version: first.version,
      filename: first.filename,
      checksum: first.checksum,
    },
  ]);

  assert.deepEqual(plan.applied.map(({ version }) => version), ["001"]);
  assert.deepEqual(plan.pending.map(({ version }) => version), ["002"]);
  assert.deepEqual(plan.mismatches, []);
});

test("statement parsing splits only on explicit delimiter lines", () => {
  const statements = splitMigrationStatements(
    "SELECT 1;\n-- statement-breakpoint\nSELECT 2;",
  );

  assert.deepEqual(statements, ["SELECT 1;", "SELECT 2;"]);
});

test("statement parsing preserves semicolons inside PostgreSQL blocks", () => {
  const block = `DO $$
BEGIN
  PERFORM 1;
  PERFORM 2;
END
$$
-- statement-breakpoint
CREATE INDEX example_idx ON example (id)`;
  const statements = splitMigrationStatements(block);

  assert.equal(statements.length, 2);
  assert.match(statements[0], /PERFORM 1;\n  PERFORM 2;/);
  assert.match(statements[1], /^CREATE INDEX/);
});

test("empty migrations are rejected", () => {
  assert.throws(() => splitMigrationStatements("\n-- comment only\n"), /non-empty SQL/);
});

function applicationSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return applicationSourceFiles(path);
    return /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

test("application runtime contains no schema DDL or ensure-table helpers", () => {
  const appDirectory = join(process.cwd(), "app");
  const forbidden = /CREATE TABLE|ALTER TABLE|CREATE INDEX|DROP TABLE|DO \$\$|ensure[A-Za-z]*Table/;
  const matches = applicationSourceFiles(appDirectory).filter((filename) =>
    forbidden.test(readFileSync(filename, "utf8")),
  );

  assert.deepEqual(matches, []);
});
