import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  isSameOriginAdminRequest,
  requireAdminJson,
} from "../../app/lib/admin-route";

function request(method: string, origin?: string, url = "https://arcadeghosts.org/api/admin/test") {
  return new Request(url, {
    method,
    headers: origin === undefined ? undefined : { Origin: origin },
  });
}

test("same-origin unsafe admin methods are allowed", () => {
  for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
    assert.equal(isSameOriginAdminRequest(request(method, "https://arcadeghosts.org")), true);
  }
});

test("unsafe admin methods reject absent, null, malformed, and wrong origins", () => {
  for (const origin of [
    undefined,
    "null",
    "not an origin",
    "http://arcadeghosts.org",
    "https://arcadeghosts.org:444",
    "https://admin.arcadeghosts.org",
    "https://arcadeghosts.org.evil.example",
  ]) {
    assert.equal(isSameOriginAdminRequest(request("POST", origin)), false);
  }
});

test("safe admin methods do not require an Origin header", () => {
  for (const method of ["GET", "HEAD", "OPTIONS"]) {
    assert.equal(isSameOriginAdminRequest(request(method)), true);
  }
});

test("same-origin unauthenticated request receives 401", async () => {
  const response = await requireAdminJson(
    request("POST", "https://arcadeghosts.org"),
    async () => false,
  );
  assert.equal(response?.status, 401);
  assert.deepEqual(await response?.json(), { error: "Admin login required." });
});

test("authenticated wrong-origin request receives 403 before authentication", async () => {
  let authenticationCalls = 0;
  const response = await requireAdminJson(
    request("DELETE", "https://evil.example"),
    async () => {
      authenticationCalls += 1;
      return true;
    },
  );

  assert.equal(response?.status, 403);
  assert.deepEqual(await response?.json(), { error: "Same-origin request required." });
  assert.equal(authenticationCalls, 0);
});

test("authenticated same-origin request is allowed", async () => {
  assert.equal(
    await requireAdminJson(request("PATCH", "https://arcadeghosts.org"), async () => true),
    null,
  );
});

function routeFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return routeFiles(path);
    return entry.name === "route.ts" ? [path] : [];
  });
}

test("protected admin routes use the shared request-aware guard", () => {
  const adminDirectory = join(process.cwd(), "app", "api", "admin");
  const protectedRoutes = routeFiles(adminDirectory).filter(
    (filename) => !filename.endsWith(join("session", "route.ts")),
  );

  for (const filename of protectedRoutes) {
    const source = readFileSync(filename, "utf8");
    const handlers = source.match(/export async function (?:GET|POST|PUT|PATCH|DELETE)\(/g) ?? [];
    const guards = source.match(/requireAdminJson\(request\)/g) ?? [];

    assert.doesNotMatch(source, /isAdminAuthenticated/);
    assert.doesNotMatch(source, /async function requireAdmin\(/);
    assert.doesNotMatch(source, /requireAdminJson\(\)/);
    assert.equal(guards.length, handlers.length, filename);
  }
});
