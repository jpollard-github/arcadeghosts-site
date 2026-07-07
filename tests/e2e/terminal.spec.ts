import { expect, test } from "@playwright/test";

const commandCases = [
  {
    command: "hello",
    lines: ["hello"],
    linkLabel: "Open homepage in a new tab",
    href: "/",
  },
  {
    command: "projects",
    lines: [
      "Project archive loaded.",
      "Shipped experiments, active builds, and curious little works-in-progress are ready.",
    ],
    linkLabel: "Open projects in a new tab",
    href: "/#projects",
  },
  {
    command: "about",
    lines: [
      "Background file opened.",
      "Builder of useful tools, reflective systems, writing spaces, games, and quiet signals.",
    ],
    linkLabel: "Open about in a new tab",
    href: "/#about",
  },
  {
    command: "music",
    lines: [
      "Music room signal is strong.",
      "Synths, fluorescent weather, tenderness, and ranked listening history await.",
    ],
    linkLabel: "Open music in a new tab",
    href: "/music",
  },
  {
    command: "cats",
    lines: [
      "Cat gallery unlocked.",
      "Tiny chaos professionals are available for immediate morale support.",
    ],
    linkLabel: "Open cats in a new tab",
    href: "/#cats",
  },
  {
    command: "arcade",
    lines: [
      "Arcade row is humming.",
      "Quarter-light favorites and old cabinet memories are standing by.",
    ],
    linkLabel: "Open arcade in a new tab",
    href: "/arcade",
  },
  {
    command: "contact",
    lines: [
      "Best contact route found.",
      "Email works better than smoke, static, or messages hidden in the trees.",
    ],
    linkLabel: "Email Jason in a new tab",
    href: "mailto:jason@arcadeghosts.org",
  },
] as const;

test("terminal page commands expose the expected output and links", async ({ page }) => {
  await page.goto("/terminal");
  await expect(page.getByRole("heading", { name: "The green-screen room has its own door now." })).toBeVisible();

  const terminalInput = page.getByLabel("Terminal command");
  await expect(terminalInput).toBeVisible();

  await terminalInput.fill("help");
  await terminalInput.press("Enter");

  await expect(page.getByText("Available commands:")).toBeVisible();
  await expect(
    page.getByText("help  reset  hello  projects  about  music  cats  arcade  contact"),
  ).toBeVisible();

  for (const commandCase of commandCases) {
    await terminalInput.fill(commandCase.command);
    await terminalInput.press("Enter");

    for (const line of commandCase.lines) {
      await expect(page.getByText(line, { exact: true })).toBeVisible();
    }

    const link = page.getByRole("link", { name: commandCase.linkLabel }).last();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noreferrer/);
    await expect(link).toHaveAttribute("href", commandCase.href);
  }
});

test("terminal page reset clears command history back to the profile", async ({ page }) => {
  await page.goto("/terminal");
  await expect(page.getByRole("heading", { name: "The green-screen room has its own door now." })).toBeVisible();

  const terminalInput = page.getByLabel("Terminal command");
  await expect(terminalInput).toBeVisible();
  await terminalInput.fill("music");
  await terminalInput.press("Enter");

  await expect(page.getByText("Music room signal is strong.", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "RESET" }).click();

  const terminal = page.getByRole("region", { name: "80s developer terminal" });
  await expect(terminal.getByText("Jason Pollard", { exact: true })).toBeVisible();
  await expect(terminal.getByText("Music room signal is strong.", { exact: true })).not.toBeVisible();
});
