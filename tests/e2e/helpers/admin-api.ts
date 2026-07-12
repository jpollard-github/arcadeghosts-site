import { expect, test, type Page } from "@playwright/test";
import { getAdminCredentials } from "./admin-env";

export function requireAdminCredentials() {
  const credentials = getAdminCredentials();
  test.skip(
    !credentials.username || !credentials.password,
    "Admin credentials are not configured for e2e login coverage.",
  );
  return credentials;
}

export function adminRequestOrigin(page: Page) {
  const currentUrl = page.url();
  if (currentUrl.startsWith("http://") || currentUrl.startsWith("https://")) {
    return new URL(currentUrl).origin;
  }
  const baseURL = test.info().project.use.baseURL;
  if (typeof baseURL === "string") return new URL(baseURL).origin;
  throw new Error("Playwright baseURL is required for admin API origin checks.");
}

export async function authenticateAdmin(page: Page) {
  const credentials = requireAdminCredentials();
  const response = await page.request.post("/api/admin/session", {
    headers: { Origin: adminRequestOrigin(page) },
    data: credentials,
  });
  expect(response.ok(), `Admin API login failed with status ${response.status()}`).toBeTruthy();
}

export async function createTinyThoughtFixture(page: Page, content: string) {
  const response = await page.request.post("/api/admin/tiny-thoughts", {
    headers: { Origin: adminRequestOrigin(page) },
    data: { content },
  });
  expect(response.ok(), `Tiny Thought fixture creation failed (${response.status()})`).toBeTruthy();
}

export async function cleanupTinyThoughtTestData(page: Page, token: string) {
  const listResponse = await page.request.get("/api/admin/tiny-thoughts");
  expect(listResponse.ok(), `Tiny Thought cleanup could not list thoughts (${listResponse.status()})`).toBeTruthy();
  const { thoughts } = (await listResponse.json()) as {
    thoughts: Array<{ id: string; content: string }>;
  };
  for (const thought of thoughts.filter(({ content }) => content.includes(token))) {
    const response = await page.request.delete("/api/admin/tiny-thoughts", {
      headers: { Origin: adminRequestOrigin(page) },
      data: { id: thought.id },
    });
    expect(response.ok(), `Tiny Thought cleanup failed for ${thought.id} (${response.status()})`).toBeTruthy();
  }
}
