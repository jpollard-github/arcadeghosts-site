import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const migrationFilenamePattern = /^(\d+)_([a-z0-9]+(?:_[a-z0-9]+)*)\.sql$/;
const statementBreakpoint = "-- statement-breakpoint";

export type MigrationFile = {
  version: string;
  filename: string;
  checksum: string;
  sql: string;
  statements: string[];
};

export type AppliedMigration = {
  version: string;
  filename: string;
  checksum: string;
  appliedAt?: string;
};

export type MigrationMismatch = {
  version: string;
  filename: string;
  reason: string;
};

export type MigrationPlan = {
  applied: MigrationFile[];
  pending: MigrationFile[];
  mismatches: MigrationMismatch[];
};

export function parseMigrationFilename(filename: string) {
  const match = migrationFilenamePattern.exec(filename);

  if (!match) {
    throw new Error(
      `Malformed migration filename "${filename}". Expected <number>_<lowercase_name>.sql.`,
    );
  }

  return {
    version: match[1],
    numericVersion: BigInt(match[1]),
  };
}

export function checksumMigration(sql: string) {
  return createHash("sha256").update(sql, "utf8").digest("hex");
}

function containsExecutableSql(statement: string) {
  return statement
    .split(/\r?\n/)
    .some((line) => line.trim() && !line.trim().startsWith("--"));
}

export function splitMigrationStatements(sql: string) {
  const normalized = sql.replace(/\r\n/g, "\n");
  const statements = normalized
    .split("\n")
    .reduce<string[]>((parts, line) => {
      if (line === statementBreakpoint) {
        parts.push("");
      } else {
        parts[parts.length - 1] += `${line}\n`;
      }
      return parts;
    }, [""])
    .map((statement) => statement.trim());

  if (!statements.length || statements.some((statement) => !containsExecutableSql(statement))) {
    throw new Error(
      "Migration files must contain non-empty SQL statements separated by exact -- statement-breakpoint lines.",
    );
  }

  return statements;
}

export function loadMigrationFiles(directory: string): MigrationFile[] {
  const filenames = readdirSync(directory).filter((filename) => filename.endsWith(".sql"));
  const parsed = filenames.map((filename) => ({
    filename,
    ...parseMigrationFilename(filename),
  }));
  const versions = new Set<string>();

  for (const migration of parsed) {
    const canonicalVersion = migration.numericVersion.toString();
    if (versions.has(canonicalVersion)) {
      throw new Error(`Duplicate migration version ${migration.version}.`);
    }
    versions.add(canonicalVersion);
  }

  return parsed
    .sort((left, right) => {
      if (left.numericVersion < right.numericVersion) return -1;
      if (left.numericVersion > right.numericVersion) return 1;
      return left.filename.localeCompare(right.filename);
    })
    .map(({ filename, version }) => {
      const sql = readFileSync(join(directory, filename), "utf8");
      return {
        version,
        filename,
        checksum: checksumMigration(sql),
        sql,
        statements: splitMigrationStatements(sql),
      };
    });
}

export function planMigrations(
  migrations: MigrationFile[],
  appliedMigrations: AppliedMigration[],
): MigrationPlan {
  const filesByVersion = new Map(migrations.map((migration) => [migration.version, migration]));
  const appliedByVersion = new Map(
    appliedMigrations.map((migration) => [migration.version, migration]),
  );
  const applied: MigrationFile[] = [];
  const pending: MigrationFile[] = [];
  const mismatches: MigrationMismatch[] = [];

  for (const migration of migrations) {
    const record = appliedByVersion.get(migration.version);
    if (!record) {
      pending.push(migration);
      continue;
    }

    if (record.filename !== migration.filename) {
      mismatches.push({
        version: migration.version,
        filename: migration.filename,
        reason: `database records filename "${record.filename}"`,
      });
    } else if (record.checksum !== migration.checksum) {
      mismatches.push({
        version: migration.version,
        filename: migration.filename,
        reason: "checksum differs from the applied migration",
      });
    } else {
      applied.push(migration);
    }
  }

  for (const record of appliedMigrations) {
    if (!filesByVersion.has(record.version)) {
      mismatches.push({
        version: record.version,
        filename: record.filename,
        reason: "applied migration file is missing from the repository",
      });
    }
  }

  return { applied, pending, mismatches };
}

export function migrationDirectory(rootDirectory = process.cwd()) {
  return join(rootDirectory, "db", "migrations");
}

export function migrationLabel(migration: Pick<MigrationFile, "version" | "filename">) {
  return `${migration.version} (${basename(migration.filename)})`;
}
