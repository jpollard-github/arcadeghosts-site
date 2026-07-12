import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ??
  process.env.STORAGE_DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.STORAGE_POSTGRES_URL;

export function getSiteSql() {
  if (!connectionString) {
    throw new Error(
      "Missing pooled Neon connection string. Set DATABASE_URL, STORAGE_DATABASE_URL, POSTGRES_URL, or STORAGE_POSTGRES_URL.",
    );
  }

  return neon(connectionString);
}
