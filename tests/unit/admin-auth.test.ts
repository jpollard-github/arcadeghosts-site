import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_PRODUCTION_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  getAdminCookieName,
  getAdminCookieNamesToClear,
  getAdminCookieOptions,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
  type AdminSessionPayload,
} from "../../app/lib/admin-auth";

const auth = {
  username: "jason",
  password: "correct horse battery staple",
  secret: "0123456789abcdef0123456789abcdef0123456789abcdef",
};
const now = 1_800_000_000;

function token(sessionId = "session-id-1234567890") {
  return createAdminSessionToken({ ...auth, now, sessionId });
}

function decodePayload(value: string) {
  const [encodedPayload] = value.split(".");
  return JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSessionPayload;
}

function signedToken(payloadText: string, secret = auth.secret) {
  const encoded = Buffer.from(payloadText, "utf8").toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function tokenWithPayload(payload: AdminSessionPayload) {
  return signedToken(JSON.stringify(payload));
}

test("valid admin session authenticates before expiration", () => {
  assert.equal(verifyAdminSessionToken(token(), { ...auth, now: now + 1 }), true);
});

test("admin session is rejected exactly at and after expiration", () => {
  const value = token();
  assert.equal(
    verifyAdminSessionToken(value, { ...auth, now: now + ADMIN_SESSION_MAX_AGE_SECONDS }),
    false,
  );
  assert.equal(
    verifyAdminSessionToken(value, { ...auth, now: now + ADMIN_SESSION_MAX_AGE_SECONDS + 1 }),
    false,
  );
});

test("modified payload and signature are rejected", () => {
  const value = token();
  const [payload, signature] = value.split(".");
  const changedPayload = `${payload.slice(0, -1)}${payload.endsWith("A") ? "B" : "A"}`;
  const changedSignature = `${signature.startsWith("A") ? "B" : "A"}${signature.slice(1)}`;

  assert.equal(verifyAdminSessionToken(`${changedPayload}.${signature}`, { ...auth, now }), false);
  assert.equal(verifyAdminSessionToken(`${payload}.${changedSignature}`, { ...auth, now }), false);
});

test("malformed tokens are rejected without throwing", () => {
  for (const value of ["", "one-segment", "a.b.c", "%%%.abc", "abc.%%%"] ) {
    assert.doesNotThrow(() => verifyAdminSessionToken(value, { ...auth, now }));
    assert.equal(verifyAdminSessionToken(value, { ...auth, now }), false);
  }
});

test("invalid JSON and unsupported token version are rejected", () => {
  assert.equal(verifyAdminSessionToken(signedToken("not-json"), { ...auth, now }), false);

  const payload = decodePayload(token());
  assert.equal(
    verifyAdminSessionToken(
      tokenWithPayload({ ...payload, v: 2 as AdminSessionPayload["v"] }),
      { ...auth, now },
    ),
    false,
  );
});

test("wrong username and credential rotation invalidate sessions", () => {
  const value = token();
  assert.equal(
    verifyAdminSessionToken(value, { ...auth, username: "someone-else", now }),
    false,
  );
  assert.equal(
    verifyAdminSessionToken(value, { ...auth, password: "rotated-password", now }),
    false,
  );
  assert.equal(
    verifyAdminSessionToken(value, { ...auth, secret: `${auth.secret}-rotated`, now }),
    false,
  );
});

test("invalid timestamp relationships and excessive lifetime are rejected", () => {
  const payload = decodePayload(token());
  assert.equal(
    verifyAdminSessionToken(tokenWithPayload({ ...payload, exp: payload.iat }), { ...auth, now }),
    false,
  );
  assert.equal(
    verifyAdminSessionToken(
      tokenWithPayload({ ...payload, exp: payload.iat + ADMIN_SESSION_MAX_AGE_SECONDS + 1 }),
      { ...auth, now },
    ),
    false,
  );
  assert.equal(
    verifyAdminSessionToken(
      tokenWithPayload({ ...payload, iat: now + 61, exp: now + 120 }),
      { ...auth, now },
    ),
    false,
  );
});

test("separate random session ids produce different tokens", () => {
  assert.notEqual(token("session-id-aaaaaaaa"), token("session-id-bbbbbbbb"));
});

test("missing or short session secret is invalid configuration", () => {
  assert.equal(
    isAdminAuthConfigured({
      ADMIN_USERNAME: auth.username,
      ADMIN_PASSWORD: auth.password,
      ADMIN_SESSION_SECRET: "",
    }),
    false,
  );
  assert.equal(
    isAdminAuthConfigured({
      ADMIN_USERNAME: auth.username,
      ADMIN_PASSWORD: auth.password,
      ADMIN_SESSION_SECRET: "too-short",
    }),
    false,
  );
  assert.equal(
    isAdminAuthConfigured({
      ADMIN_USERNAME: auth.username,
      ADMIN_PASSWORD: auth.password,
      ADMIN_SESSION_SECRET: "é".repeat(16),
    }),
    true,
  );
});

test("token payload contains no plaintext password or session secret", () => {
  const value = token();
  const payloadText = Buffer.from(value.split(".")[0], "base64url").toString("utf8");
  assert.doesNotMatch(payloadText, new RegExp(auth.password));
  assert.doesNotMatch(payloadText, new RegExp(auth.secret));
});

test("production and development cookie names and options are hardened", () => {
  assert.equal(getAdminCookieName("production"), ADMIN_PRODUCTION_COOKIE_NAME);
  assert.equal(getAdminCookieName("development"), ADMIN_COOKIE_NAME);

  const production = getAdminCookieOptions("production");
  assert.deepEqual(production, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  assert.equal("domain" in production, false);
  assert.equal(getAdminCookieOptions("development").secure, false);
});

test("cookie cleanup includes active and legacy production names", () => {
  assert.deepEqual(getAdminCookieNamesToClear("production"), [
    ADMIN_PRODUCTION_COOKIE_NAME,
    ADMIN_COOKIE_NAME,
  ]);
  assert.deepEqual(getAdminCookieNamesToClear("development"), [ADMIN_COOKIE_NAME]);
});
