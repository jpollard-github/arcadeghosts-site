import { expect, test, type Page } from "@playwright/test";
import { getAdminCredentials } from "./helpers/admin-env";

async function loginAsAdmin(page: Page) {
  const credentials = getAdminCredentials();

  test.skip(
    !credentials.username || !credentials.password,
    "Admin credentials are not configured for e2e login coverage.",
  );

  await page.goto("/admin");
  await page.getByLabel("Username").fill(credentials.username);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Log In" }).click();

  await expect(
    page.getByText("Signed in. Choose an admin tool."),
  ).toBeVisible();
}

test("admin dashboard supports sign in and sign out", async ({ page }) => {
  await page.goto("/admin");

  await expect(
    page.getByRole("heading", { name: "Dashboard" }),
  ).toBeVisible();
  await expect(
    page.getByText("Sign in once to manage the site."),
  ).toBeVisible();

  await loginAsAdmin(page);

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
    page.getByRole("link", { name: "Open Guestbook Review" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Open Edit Now" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Open Content Inbox" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Log Out" }).click();

  await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
  await expect(page.getByText("Signed out.")).toBeVisible();
});

test("authenticated admin can create, update, and delete a tiny thought", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/admin/tiny-thoughts");

  const token = Date.now().toString();
  const initialText = `Tiny thought e2e ${token}`;
  const updatedText = `Tiny thought updated ${token}`;

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
});

test("authenticated admin can create, update, and delete a project", async ({ page }) => {
  await loginAsAdmin(page);

  await page.goto("/admin/projects");

  const token = Date.now().toString();
  const title = `Project e2e ${token}`;
  const updatedTitle = `Project e2e updated ${token}`;
  const description = `Initial project description ${token}`;
  const updatedDescription = `Updated project description ${token}`;

  await expect(
    page.getByRole("heading", { name: "Edit Projects" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Add Project" })).toBeVisible();

  await page.getByRole("button", { name: "Add Project" }).click();
  await expect(page.getByText("New project draft added. Save it when you're ready.")).toBeVisible();

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
  await draftProjectCard.getByRole("button", { name: "Create Project" }).click({ force: true });

  await expect(page.getByText("Project created.")).toBeVisible();
  await expect(page.locator(`input[value="${title}"]`)).toBeVisible();

  const savedProjectCard = page
    .locator("article.admin-entry")
    .filter({ has: page.locator(`input[value="${title}"]`) });

  await savedProjectCard.getByLabel("Title").fill(updatedTitle);
  await savedProjectCard.getByLabel("Description").fill(updatedDescription);
  await savedProjectCard.getByRole("button", { name: "Save Project" }).click();

  await expect(page.getByText("Project saved.")).toBeVisible();
  await expect(page.locator(`input[value="${updatedTitle}"]`)).toBeVisible();

  const updatedProjectCard = page
    .locator("article.admin-entry")
    .filter({ has: page.locator(`input[value="${updatedTitle}"]`) });

  page.once("dialog", (dialog) => dialog.accept());
  await updatedProjectCard.getByRole("button", { name: "Delete" }).click();

  await expect(page.getByText("Project deleted.")).toBeVisible();
  await expect(updatedProjectCard).toHaveCount(0);
});

test("authenticated admin can open error previews", async ({ page }) => {
  await loginAsAdmin(page);

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
