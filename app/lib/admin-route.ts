import { isAdminAuthenticated } from "./admin-auth";

const safeAdminMethods = new Set(["GET", "HEAD", "OPTIONS"]);

export function jsonError(error: string, status = 400) {
  return Response.json({ error }, { status });
}

export async function parseJsonBody(request: Request) {
  return (await request.json().catch(() => ({}))) as Record<string, unknown>;
}

export function isSameOriginAdminRequest(request: Request) {
  if (safeAdminMethods.has(request.method.toUpperCase())) {
    return true;
  }

  const origin = request.headers.get("origin");
  if (!origin || origin === "null") {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    const expectedOrigin = new URL(request.url).origin;

    return origin === parsedOrigin.origin && parsedOrigin.origin === expectedOrigin;
  } catch {
    return false;
  }
}

export function requireSameOriginJson(request: Request) {
  return isSameOriginAdminRequest(request)
    ? null
    : jsonError("Same-origin request required.", 403);
}

export async function requireAdminJson(
  request: Request,
  authenticate: () => Promise<boolean> = isAdminAuthenticated,
) {
  const invalidOrigin = requireSameOriginJson(request);
  if (invalidOrigin) {
    return invalidOrigin;
  }

  if (!(await authenticate())) {
    return jsonError("Admin login required.", 401);
  }

  return null;
}

export function logRouteError(context: string, error: unknown) {
  console.error(context, error);
}

export function routeFailure(context: string, message: string, error: unknown, status = 500) {
  logRouteError(context, error);
  return jsonError(message, status);
}
