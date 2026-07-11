import {
  clearAdminSession,
  isAdminAuthenticated,
  isAdminAuthConfigured,
  setAdminSession,
  verifyAdminCredentials,
} from "../../../lib/admin-auth";
import { parseJsonBody, requireSameOriginJson } from "../../../lib/admin-route";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    authenticated: await isAdminAuthenticated(),
    configured: isAdminAuthConfigured(),
  });
}

export async function POST(request: Request) {
  const invalidOrigin = requireSameOriginJson(request);
  if (invalidOrigin) {
    return invalidOrigin;
  }

  const body = await parseJsonBody(request);
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!isAdminAuthConfigured()) {
    return Response.json(
      { error: "Admin authentication is not configured." },
      { status: 500 },
    );
  }

  if (!verifyAdminCredentials(username, password)) {
    return Response.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  await setAdminSession();
  return Response.json({ authenticated: true });
}

export async function DELETE(request: Request) {
  const invalidOrigin = requireSameOriginJson(request);
  if (invalidOrigin) {
    return invalidOrigin;
  }

  await clearAdminSession();
  return Response.json({ authenticated: false });
}
