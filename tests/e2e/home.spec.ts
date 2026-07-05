import { expect, test } from "@playwright/test";

test("homepage renders the hero and key sections", async ({ page }) => {
  await page.goto("/");
  const mainNav = page.getByRole("navigation", { name: "Main navigation" });

  await expect(
    page.getByText("A living portfolio for software, writing, and who is Jason."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Useful tools with a curious little heartbeat.",
    }),
  ).toBeVisible();
  await expect(
    mainNav.locator('a[href="#screening"]'),
  ).toBeVisible();
  await expect(
    mainNav.locator('a[href="mailto:jason@arcadeghosts.org"]'),
  ).toHaveAttribute("href", "mailto:jason@arcadeghosts.org");
  await expect(
    mainNav.getByRole("link", { name: "Work With Me", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: "Shipped, active, paused, and becoming.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Games, rooms, and playable static.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Who I am and how I think.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Start Here", exact: true }).first(),
  ).toHaveAttribute("href", "#start-here");
  await expect(
    page.locator(".hero-actions"),
  ).toHaveCount(0);
  await expect(page.getByText("80s Dev Terminal")).toHaveCount(0);
});

test("homepage navigation reaches the screening section", async ({ page }) => {
  await page.goto("/");
  const mainNav = page.getByRole("navigation", { name: "Main navigation" });

  await mainNav.locator('a[href="#screening"]').click();

  await expect(page).toHaveURL(/#screening$/);
  await expect(
    page.getByRole("heading", {
      name: "A few screen stories still glowing in the lobby.",
    }),
  ).toBeVisible();
});

test("terminal page shows help and project link output", async ({ page }) => {
  await page.goto("/terminal");

  await expect(
    page.getByText("80s Dev Terminal"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "RESET" }),
  ).toBeVisible();
  await expect(
    page.getByText("Type help for commands."),
  ).toBeVisible();
  await expect(
    page.getByText("currently exploring: AI tools, VS Code extensions, weird web toys"),
  ).toBeVisible();

  const terminalInput = page.getByLabel("Terminal command");

  await terminalInput.fill("help");
  await terminalInput.press("Enter");

  await expect(
    page.getByText("Available commands:"),
  ).toBeVisible();
  await expect(
    page.getByText("help  reset  hello  projects  about  music  cats  arcade  contact"),
  ).toBeVisible();

  await terminalInput.fill("hello");
  await terminalInput.press("Enter");

  await expect(
    page.getByText(/^hello$/),
  ).toBeVisible();

  await terminalInput.fill("projects");
  await terminalInput.press("Enter");

  const projectLink = page.getByRole("link", { name: "Open projects in a new tab" });
  await expect(projectLink).toBeVisible();
  await expect(projectLink).toHaveAttribute("target", "_blank");
  await expect(projectLink).toHaveAttribute("href", "/#projects");

  await page.getByRole("button", { name: "Reset" }).click();

  const terminal = page.getByRole("region", { name: "80s developer terminal" });

  await expect(
    terminal.getByText("Jason Pollard", { exact: true }),
  ).toBeVisible();
  await expect(
    terminal.getByText("Project archive loaded."),
  ).not.toBeVisible();
});
