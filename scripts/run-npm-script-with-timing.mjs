import { spawn } from "node:child_process";

const scriptName = process.argv[2];
const forwardedArgs = process.argv.slice(3);

if (!scriptName) {
  console.error("Usage: node scripts/run-npm-script-with-timing.mjs <npm-script-name>");
  process.exit(1);
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const startedAt = Date.now();
const startedLabel = new Date(startedAt).toISOString();

const commandParts = ["npm", "run", scriptName];
if (forwardedArgs.length > 0) {
  commandParts.push("--", ...forwardedArgs);
}

console.log(`[timed] ${commandParts.join(" ")}`);
console.log(`[timed] started ${startedLabel}`);

const child = spawn(npmCommand, ["run", scriptName, ...(forwardedArgs.length > 0 ? ["--", ...forwardedArgs] : [])], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});

child.on("error", (error) => {
  const elapsedMs = Date.now() - startedAt;
  console.error(`[timed] failed to start npm run ${scriptName}`);
  console.error(`[timed] error: ${error.message}`);
  console.error(`[timed] elapsed ${formatDuration(elapsedMs)}`);
  process.exit(1);
});

child.on("close", (code, signal) => {
  const completedAt = Date.now();
  const elapsedMs = completedAt - startedAt;

  console.log(`[timed] completed ${new Date(completedAt).toISOString()}`);
  console.log(`[timed] elapsed ${formatDuration(elapsedMs)}`);
  if (signal) {
    console.log(`[timed] exit signal ${signal}`);
    process.exit(1);
  }

  console.log(`[timed] exit code ${code ?? 1}`);
  process.exit(code ?? 1);
});

function formatDuration(durationMs) {
  if (durationMs < 1000) {
    return `${durationMs}ms`;
  }

  const seconds = durationMs / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds - minutes * 60;
  return `${minutes}m ${remainingSeconds.toFixed(2)}s`;
}
