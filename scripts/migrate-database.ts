import { neon } from "@neondatabase/serverless";
import {
  loadMigrationFiles,
  migrationDirectory,
  migrationLabel,
  planMigrations,
  type AppliedMigration,
  type MigrationPlan,
} from "./database-migrations";

type MigrationRow = {
  version: string;
  filename: string;
  checksum: string;
  applied_at: string;
};

function getMigrationSql() {
  const connectionString =
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.STORAGE_DATABASE_URL_UNPOOLED ??
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "Missing migration connection string. Set DATABASE_URL_UNPOOLED, POSTGRES_URL_NON_POOLING, STORAGE_DATABASE_URL_UNPOOLED, or DATABASE_URL.",
    );
  }

  return neon(connectionString);
}

const historyTableSql = `
  CREATE TABLE IF NOT EXISTS site_schema_migrations (
    version TEXT PRIMARY KEY,
    filename TEXT NOT NULL UNIQUE,
    checksum TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

function toAppliedMigration(row: MigrationRow): AppliedMigration {
  return {
    version: row.version,
    filename: row.filename,
    checksum: row.checksum,
    appliedAt: row.applied_at,
  };
}

function printPlan(plan: MigrationPlan) {
  console.log(`Applied: ${plan.applied.length}`);
  for (const migration of plan.applied) {
    console.log(`  ${migrationLabel(migration)}`);
  }

  console.log(`Pending: ${plan.pending.length}`);
  for (const migration of plan.pending) {
    console.log(`  ${migrationLabel(migration)}`);
  }

  console.log(`Checksum mismatches: ${plan.mismatches.length}`);
  for (const mismatch of plan.mismatches) {
    console.log(`  ${mismatch.version} (${mismatch.filename}): ${mismatch.reason}`);
  }
}

async function readAppliedMigrations(
  sql: ReturnType<typeof getMigrationSql>,
  createHistoryTable: boolean,
) {
  if (createHistoryTable) {
    await sql.query(historyTableSql);
  } else {
    const rows = await sql.query(
      "SELECT to_regclass(current_schema() || '.site_schema_migrations') AS table_name",
    );
    if (!rows[0]?.table_name) {
      return [];
    }
  }

  const rows = await sql.query(
    `SELECT version, filename, checksum, applied_at
     FROM site_schema_migrations
     ORDER BY version ASC`,
  );
  return (rows as MigrationRow[]).map(toAppliedMigration);
}

async function main() {
  const statusOnly = process.argv.slice(2).includes("--status");
  const unexpectedArguments = process.argv.slice(2).filter((argument) => argument !== "--status");
  if (unexpectedArguments.length) {
    throw new Error(`Unknown migration argument: ${unexpectedArguments.join(", ")}`);
  }

  const migrations = loadMigrationFiles(migrationDirectory());
  const sql = getMigrationSql();
  const appliedMigrations = await readAppliedMigrations(sql, !statusOnly);
  const plan = planMigrations(migrations, appliedMigrations);

  if (statusOnly) {
    printPlan(plan);
    if (plan.mismatches.length) process.exitCode = 1;
    return;
  }

  if (plan.mismatches.length) {
    printPlan(plan);
    throw new Error("Applied migration history does not match the repository files.");
  }

  for (const migration of plan.pending) {
    const queries = migration.statements.map((statement) => sql.query(statement));
    queries.push(
      sql.query(
        `INSERT INTO site_schema_migrations (version, filename, checksum)
         VALUES ($1, $2, $3)`,
        [migration.version, migration.filename, migration.checksum],
      ),
    );
    await sql.transaction(queries);
    console.log(`Applied ${migrationLabel(migration)}`);
  }

  const finalApplied = await readAppliedMigrations(sql, false);
  printPlan(planMigrations(migrations, finalApplied));
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown migration failure.";
  console.error(`Database migration failed: ${message}`);
  process.exitCode = 1;
});
