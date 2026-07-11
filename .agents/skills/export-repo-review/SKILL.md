---
name: arcadeghosts-export-repo-review
description: Create the ArcadeGhosts repository-review ZIP using the existing npm script and reveal the generated archive in macOS Finder. Use when Jason asks to package, zip, export, attach, or reveal the current repo for a ChatGPT or external code review.
---

1. Read the repository `AGENTS.md` before running commands.
2. Confirm the current working directory is the repository root and that `package.json` contains the `zip:repo-review` script. Do not recreate or modify the packaging script as part of this workflow.
3. Run:

   ```bash
   npm run zip:repo-review
   ```

4. Capture the relative archive path printed by the script on the line beginning with `Created `. Resolve it to an absolute path from the repository root.
5. Verify that the resulting path:
   - exists
   - is a regular `.zip` file
   - has a size greater than zero
6. On macOS, reveal that exact archive in Finder with:

   ```bash
   open -R "/absolute/path/to/archive.zip"
   ```

   Quote the path. Do not open the ZIP itself and do not reveal only the containing directory.

7. If the `Created ` line cannot be parsed, locate the newest `.zip` directly under `repo-reviews/` that was created or modified by the command. Do not select an older archive merely because it has a similar filename.
8. If `open` is unavailable or the environment is not macOS, do not claim Finder was opened. Print the absolute archive path so Jason can reveal it manually.
9. Return a concise result containing:
   - whether `npm run zip:repo-review` succeeded
   - the absolute archive path
   - the archive size
   - whether Finder was successfully asked to reveal it
   - the file and image counts printed by the packaging script, when available

Do not run unrelated verification, alter repository files, delete previous review archives, or commit the generated ZIP.
