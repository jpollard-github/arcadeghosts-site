import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ??
  process.env.STORAGE_DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.STORAGE_POSTGRES_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.STORAGE_POSTGRES_URL_NON_POOLING ??
  process.env.STORAGE_DATABASE_URL_UNPOOLED ??
  process.env.NEON_DATABASE_URL;

export function getSiteSql() {
  if (!connectionString) {
    throw new Error(
      "Missing Neon connection string. Set DATABASE_URL, STORAGE_DATABASE_URL, POSTGRES_URL, STORAGE_POSTGRES_URL, POSTGRES_URL_NON_POOLING, STORAGE_POSTGRES_URL_NON_POOLING, or NEON_DATABASE_URL.",
    );
  }

  return neon(connectionString);
}
