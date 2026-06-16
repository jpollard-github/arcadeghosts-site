import { del, put } from "@vercel/blob";

type PutBlobOptions = Parameters<typeof put>[2];

function readWriteToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim().replace(/^["']|["']$/g, "");
}

function withLocalReadWriteToken<T extends object>(options: T): T & { token?: string } {
  const token = readWriteToken();

  if (!token) {
    return options as T & { token?: string };
  }

  return {
    ...options,
    token,
  };
}

export function putTinyThoughtBlob(
  pathname: string,
  body: Parameters<typeof put>[1],
  options: PutBlobOptions,
) {
  return put(pathname, body, withLocalReadWriteToken(options));
}

export function putProjectBlob(
  pathname: string,
  body: Parameters<typeof put>[1],
  options: PutBlobOptions,
) {
  return put(pathname, body, withLocalReadWriteToken(options));
}

export function deleteTinyThoughtBlobs(urls: string[]) {
  return del(urls, withLocalReadWriteToken({}));
}
