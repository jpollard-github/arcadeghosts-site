import { expect, test, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";
import {
  adminRequestOrigin,
  authenticateAdmin,
  cleanupTinyThoughtTestData,
  requireAdminCredentials,
} from "./helpers/admin-api";

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

test.describe("admin", { tag: "@database" }, () => {
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

      const publicThoughtsResponse = await page.request.get(
        "/api/tiny-thoughts?limit=60",
      );
      expect(publicThoughtsResponse.ok()).toBeTruthy();
      const publicThoughts = (await publicThoughtsResponse.json()) as {
        thoughts: Array<{ content: string }>;
      };
      expect(
        publicThoughts.thoughts.some((thought) => thought.content === updatedText),
      ).toBeTruthy();

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

    const token = randomUUID();
    const id = randomUUID();
    const title = `Project e2e ${token}`;
    const updatedTitle = `Project e2e updated ${token}`;
    const description = `Initial project description ${token}`;
    const updatedDescription = `Updated project description ${token}`;

    try {
      await page.goto("/admin/projects");

      await expect(
        page.getByRole("heading", { name: "Edit Projects" }),
      ).toBeVisible();
      const project = {
        id,
        type: "E2E Project",
        title,
        description,
        href: "",
        imageUrl: "",
        status: "active",
        phase: "",
        nextAction: "None",
        blockers: "",
        priority: 3,
        lastUpdatedAt: "",
      };
      const createResponse = await page.request.patch("/api/admin/projects", {
        headers: { Origin: adminRequestOrigin(page) },
        data: { project },
      });
      expect(createResponse.ok()).toBeTruthy();
      await page.getByRole("button", { name: "Refresh" }).click();

      const projectCard = () =>
        page.locator("article.admin-entry").filter({ hasText: token });

      await expect(projectCard()).toBeVisible();
      const updateResponse = await page.request.patch("/api/admin/projects", {
        headers: { Origin: adminRequestOrigin(page) },
        data: {
          project: { ...project, title: updatedTitle, description: updatedDescription },
        },
      });
      expect(updateResponse.ok()).toBeTruthy();

      const adminProjectsResponse = await page.request.get("/api/admin/projects");
      expect(adminProjectsResponse.ok()).toBeTruthy();
      const adminProjects = (await adminProjectsResponse.json()) as {
        projects: Array<{ title: string }>;
      };
      expect(
        adminProjects.projects.some((project) => project.title === updatedTitle),
      ).toBeTruthy();

      const deleteResponse = await page.request.delete("/api/admin/projects", {
        headers: { Origin: adminRequestOrigin(page) },
        data: { id },
      });
      expect(deleteResponse.ok()).toBeTruthy();
      const deletedProjectsResponse = await page.request.get("/api/admin/projects");
      const deletedProjects = (await deletedProjectsResponse.json()) as {
        projects: Array<{ id: string }>;
      };
      expect(deletedProjects.projects.some((project) => project.id === id)).toBeFalsy();
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
