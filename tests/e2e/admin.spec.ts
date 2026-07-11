import { expect, test, type Page } from "@playwright/test";
import { getAdminCredentials } from "./helpers/admin-env";

function requireAdminCredentials() {
  const credentials = getAdminCredentials();

  test.skip(
    !credentials.username || !credentials.password,
    "Admin credentials are not configured for e2e login coverage.",
  );

  return credentials;
}

function adminRequestOrigin(page: Page) {
  const currentUrl = page.url();
  if (currentUrl.startsWith("http://") || currentUrl.startsWith("https://")) {
    return new URL(currentUrl).origin;
  }

  const baseURL = test.info().project.use.baseURL;
  if (typeof baseURL === "string") {
    return new URL(baseURL).origin;
  }

  throw new Error("Playwright baseURL is required for admin API origin checks.");
}

async function authenticateAdmin(page: Page) {
  const credentials = requireAdminCredentials();
  const response = await page.request.post("/api/admin/session", {
    headers: { Origin: adminRequestOrigin(page) },
    data: {
      username: credentials.username,
      password: credentials.password,
    },
  });

  expect(
    response.ok(),
    `Admin API login failed with status ${response.status()}`,
  ).toBeTruthy();
}

async function cleanupProjectTestData(page: Page, token: string) {
  const listResponse = await page.request.get("/api/admin/projects");

  expect(
    listResponse.ok(),
    `Project cleanup could not list projects (status ${listResponse.status()})`,
  ).toBeTruthy();

  const { projects } = (await listResponse.json()) as {
    projects: Array<{ id: string; title: string; description: string }>;
  };
  const testProjects = projects.filter(
    (project) =>
      project.title.includes(token) || project.description.includes(token),
  );

  for (const project of testProjects) {
    const deleteResponse = await page.request.delete("/api/admin/projects", {
      headers: { Origin: adminRequestOrigin(page) },
      data: { id: project.id },
    });

    expect(
      deleteResponse.ok(),
      `Project cleanup failed for ${project.id} (status ${deleteResponse.status()})`,
    ).toBeTruthy();
  }
}

async function cleanupTinyThoughtTestData(page: Page, token: string) {
  const listResponse = await page.request.get("/api/admin/tiny-thoughts");

  expect(
    listResponse.ok(),
    `Tiny Thought cleanup could not list thoughts (status ${listResponse.status()})`,
  ).toBeTruthy();

  const { thoughts } = (await listResponse.json()) as {
    thoughts: Array<{ id: string; content: string }>;
  };
  const testThoughts = thoughts.filter((thought) => thought.content.includes(token));

  for (const thought of testThoughts) {
    const deleteResponse = await page.request.delete("/api/admin/tiny-thoughts", {
      headers: { Origin: adminRequestOrigin(page) },
      data: { id: thought.id },
    });

    expect(
      deleteResponse.ok(),
      `Tiny Thought cleanup failed for ${thought.id} (status ${deleteResponse.status()})`,
    ).toBeTruthy();
  }
}

test.describe("admin", () => {
  test.describe.configure({ mode: "serial" });

  test("admin dashboard supports sign in and sign out", async ({ page }) => {
    const credentials = requireAdminCredentials();

    await page.goto("/admin");

    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
    await expect(
      page.getByText("Sign in once to manage the site."),
    ).toBeVisible();

    await page.getByLabel("Username").fill(credentials.username);
    await page.getByLabel("Password").fill(credentials.password);
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(
      page.getByText("Signed in. Choose an admin tool."),
    ).toBeVisible();

    await expect(page.locator(".admin-dashboard-grid .admin-action-link")).toHaveCount(3);
    await expect(
      page.getByRole("link", { name: "Open Tiny Thoughts" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open Edit Projects" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open Error Previews" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open Edit Now" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Open Content Inbox" }),
    ).toHaveCount(0);

    await page.getByRole("button", { name: "Log Out" }).click();

    await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
    await expect(page.getByText("Signed out.")).toBeVisible();
    const sessionResponse = await page.request.get("/api/admin/session");
    expect(sessionResponse.ok()).toBeTruthy();
    expect(await sessionResponse.json()).toMatchObject({
      authenticated: false,
    });
  });

  test("authenticated admin can create, update, and delete a tiny thought", async ({
    page,
  }) => {
    await authenticateAdmin(page);

    const token = Date.now().toString();
    const initialText = `Tiny thought e2e ${token}`;
    const updatedText = `Tiny thought updated ${token}`;

    try {
      await page.goto("/admin/tiny-thoughts");

      await expect(
        page.getByRole("heading", { name: "Tiny Thoughts" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();
      await page.getByLabel("Thought").fill(initialText);
      await page.getByRole("button", { name: "Create Thought" }).click();

      const thoughtCard = page.locator("article.admin-entry").filter({
        hasText: initialText,
      });
      await expect(thoughtCard).toBeVisible();

      await thoughtCard.getByRole("button", { name: "Edit" }).click();
      await expect(page.getByText("Editing tiny thought.")).toBeVisible();
      await expect(page.getByLabel("Thought")).toHaveValue(initialText);

      await page.getByLabel("Thought").fill(updatedText);
      await page.getByRole("button", { name: "Update Thought" }).click();

      await expect(page.getByText("Tiny thought updated.")).toBeVisible();

      const updatedThoughtCard = page.locator("article.admin-entry").filter({
        hasText: updatedText,
      });
      await expect(updatedThoughtCard).toBeVisible();

      page.once("dialog", (dialog) => dialog.accept());
      await updatedThoughtCard.getByRole("button", { name: "Delete" }).click();

      await expect(page.getByText("Tiny thought deleted.")).toBeVisible();
      await expect(
        page.locator("article.admin-entry").filter({ hasText: updatedText }),
      ).toHaveCount(0);
    } finally {
      await cleanupTinyThoughtTestData(page, token);
    }
  });

  test("authenticated admin can create, update, and delete a project", async ({ page }) => {
    await authenticateAdmin(page);

    const token = Date.now().toString();
    const title = `Project e2e ${token}`;
    const updatedTitle = `Project e2e updated ${token}`;
    const description = `Initial project description ${token}`;
    const updatedDescription = `Updated project description ${token}`;

    try {
      await page.goto("/admin/projects");

      await expect(
        page.getByRole("heading", { name: "Edit Projects" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Add Project" })).toBeVisible();

      await page.getByRole("button", { name: "Add Project" }).click();
      await expect(
        page.getByText("New project draft added. Save it when you're ready."),
      ).toBeVisible();

      const draftProjectCard = page
        .locator("article.admin-entry")
        .filter({ has: page.getByRole("button", { name: "Create Project" }) })
        .last();

      await draftProjectCard.getByLabel("Type").fill("E2E Project");
      await draftProjectCard.getByLabel("Title").fill(title);
      await draftProjectCard.getByLabel("Description").fill(description);
      await expect(draftProjectCard.getByLabel("Description")).toHaveValue(description);
      await expect(
        draftProjectCard.getByRole("button", { name: "Create Project" }),
      ).toBeEnabled();
      await draftProjectCard
        .getByRole("button", { name: "Create Project" })
        .click({ force: true });

      await expect(page.getByText("Project created.")).toBeVisible();

      const projectCard = () =>
        page.locator("article.admin-entry").filter({ hasText: token });

      await expect(projectCard()).toBeVisible();
      await projectCard().getByLabel("Description").fill(updatedDescription);
      await projectCard().getByLabel("Title").fill(updatedTitle);
      await projectCard().getByRole("button", { name: "Save Project" }).click();

      await expect(page.getByText("Project saved.")).toBeVisible();
      await expect(projectCard().getByLabel("Title")).toHaveValue(updatedTitle);

      page.once("dialog", (dialog) => dialog.accept());
      await projectCard().getByRole("button", { name: "Delete" }).click();

      await expect(page.getByText("Project deleted.")).toBeVisible();
      await expect(projectCard()).toHaveCount(0);
    } finally {
      await cleanupProjectTestData(page, token);
    }
  });

  test("authenticated admin can open error previews", async ({ page }) => {
    await authenticateAdmin(page);
    await page.goto("/admin/error-previews");

    await expect(
      page.getByRole("heading", { name: "Error Previews" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open 404 Preview" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open 500 Preview" }),
    ).toBeVisible();
  });
});
