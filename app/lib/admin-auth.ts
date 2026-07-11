import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
export const ADMIN_SESSION_FUTURE_TOLERANCE_SECONDS = 60;
export const ADMIN_SESSION_SECRET_MIN_BYTES = 32;
export const ADMIN_COOKIE_NAME = "arcadeghosts_admin";
export const ADMIN_PRODUCTION_COOKIE_NAME = "__Host-arcadeghosts_admin";

const sessionVersion = 1;
const maximumEncodedPayloadLength = 4096;
const credentialVersionDomain = "arcadeghosts-admin-credentials-v1";

export type AdminAuthConfig = {
  username: string;
  password: string;
  secret: string;
};

type AdminAuthEnvironment = Partial<
  Record<"ADMIN_USERNAME" | "ADMIN_PASSWORD" | "ADMIN_SESSION_SECRET", string | undefined>
>;

export type AdminSessionPayload = {
  v: 1;
  sub: string;
  iat: number;
  exp: number;
  jti: string;
  cv: string;
};

type CreateAdminSessionTokenOptions = AdminAuthConfig & {
  now?: number;
  sessionId?: string;
};

type VerifyAdminSessionTokenOptions = AdminAuthConfig & {
  now?: number;
};

function constantTimeEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function unixSeconds(value = Date.now()) {
  return Math.floor(value / 1000);
}

function validSecret(secret: string) {
  return Buffer.byteLength(secret, "utf8") >= ADMIN_SESSION_SECRET_MIN_BYTES;
}

function signEncodedPayload(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload, "utf8").digest("base64url");
}

function credentialVersion({ username, password, secret }: AdminAuthConfig) {
  return createHmac("sha256", secret)
    .update(credentialVersionDomain, "utf8")
    .update("\0", "utf8")
    .update(username, "utf8")
    .update("\0", "utf8")
    .update(password, "utf8")
    .digest("base64url");
}

function isCanonicalBase64url(value: string) {
  if (!value || !/^[A-Za-z0-9_-]+$/.test(value)) {
    return false;
  }

  try {
    return Buffer.from(value, "base64url").toString("base64url") === value;
  } catch {
    return false;
  }
}

function isAdminSessionPayload(value: unknown): value is AdminSessionPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    payload.v === sessionVersion &&
    typeof payload.sub === "string" &&
    payload.sub.length > 0 &&
    payload.sub.length <= 256 &&
    typeof payload.iat === "number" &&
    Number.isSafeInteger(payload.iat) &&
    typeof payload.exp === "number" &&
    Number.isSafeInteger(payload.exp) &&
    typeof payload.jti === "string" &&
    payload.jti.length >= 16 &&
    payload.jti.length <= 256 &&
    typeof payload.cv === "string" &&
    payload.cv.length > 0 &&
    payload.cv.length <= 256
  );
}

export function getAdminAuthConfig(
  environment: AdminAuthEnvironment = process.env as AdminAuthEnvironment,
): AdminAuthConfig | null {
  const username = environment.ADMIN_USERNAME ?? "";
  const password = environment.ADMIN_PASSWORD ?? "";
  const secret = environment.ADMIN_SESSION_SECRET ?? "";

  if (!username || !password || !validSecret(secret)) {
    return null;
  }

  return { username, password, secret };
}

export function isAdminAuthConfigured(
  environment: AdminAuthEnvironment = process.env as AdminAuthEnvironment,
) {
  return getAdminAuthConfig(environment) !== null;
}

export function createAdminSessionToken({
  username,
  password,
  secret,
  now = unixSeconds(),
  sessionId = randomBytes(24).toString("base64url"),
}: CreateAdminSessionTokenOptions) {
  if (!username || !password || !validSecret(secret)) {
    throw new Error("Admin authentication is not configured.");
  }

  const payload: AdminSessionPayload = {
    v: sessionVersion,
    sub: username,
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE_SECONDS,
    jti: sessionId,
    cv: credentialVersion({ username, password, secret }),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encodedPayload}.${signEncodedPayload(encodedPayload, secret)}`;
}

export function verifyAdminSessionToken(
  token: string,
  { username, password, secret, now = unixSeconds() }: VerifyAdminSessionTokenOptions,
) {
  try {
    if (!token || !username || !password || !validSecret(secret)) {
      return false;
    }

    const segments = token.split(".");
    if (segments.length !== 2) {
      return false;
    }

    const [encodedPayload, signature] = segments;
    if (
      encodedPayload.length > maximumEncodedPayloadLength ||
      !isCanonicalBase64url(encodedPayload) ||
      !isCanonicalBase64url(signature)
    ) {
      return false;
    }

    const expectedSignature = signEncodedPayload(encodedPayload, secret);
    if (!constantTimeEquals(signature, expectedSignature)) {
      return false;
    }

    const decoded = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const payload = JSON.parse(decoded) as unknown;
    if (!isAdminSessionPayload(payload)) {
      return false;
    }

    if (
      payload.sub !== username ||
      !constantTimeEquals(payload.cv, credentialVersion({ username, password, secret })) ||
      payload.exp <= payload.iat ||
      payload.exp - payload.iat > ADMIN_SESSION_MAX_AGE_SECONDS ||
      payload.iat > now + ADMIN_SESSION_FUTURE_TOLERANCE_SECONDS ||
      now >= payload.exp
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function getAdminCookieName(nodeEnvironment = process.env.NODE_ENV) {
  return nodeEnvironment === "production" ? ADMIN_PRODUCTION_COOKIE_NAME : ADMIN_COOKIE_NAME;
}

export function getAdminCookieOptions(nodeEnvironment = process.env.NODE_ENV) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: nodeEnvironment === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}

export function getAdminCookieNamesToClear(nodeEnvironment = process.env.NODE_ENV) {
  return Array.from(new Set([getAdminCookieName(nodeEnvironment), ADMIN_COOKIE_NAME]));
}

export function verifyAdminCredentials(username: string, password: string) {
  const config = getAdminAuthConfig();

  if (!config || !username || !password) {
    return false;
  }

  return (
    constantTimeEquals(username, config.username) &&
    constantTimeEquals(password, config.password)
  );
}

export async function isAdminAuthenticated() {
  const config = getAdminAuthConfig();
  if (!config) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminCookieName())?.value ?? "";
  return verifyAdminSessionToken(token, config);
}

export async function setAdminSession() {
  const config = getAdminAuthConfig();
  if (!config) {
    throw new Error("Admin authentication is not configured.");
  }

  const cookieStore = await cookies();
  for (const name of getAdminCookieNamesToClear()) {
    cookieStore.delete(name);
  }
  cookieStore.set(
    getAdminCookieName(),
    createAdminSessionToken(config),
    getAdminCookieOptions(),
  );
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  for (const name of getAdminCookieNamesToClear()) {
    cookieStore.delete(name);
  }
}
