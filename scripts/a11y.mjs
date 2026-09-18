import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const target = process.argv[2];
if (!target || !/^https?:\/\//.test(target)) {
  console.error("Usage: node scripts/a11y.mjs <http(s) URL>");
  process.exit(2);
}

const cli = process.env.PLAYWRIGHT_CLI || "playwright-cli";
const session = `paystack-a11y-${process.pid}`;
const axePath = fileURLToPath(import.meta.resolve("axe-core/axe.js"));
const axeSource = readFileSync(axePath, "utf8");
const temporaryDirectory = mkdtempSync(join(tmpdir(), "paystack-axe-"));
const codePath = join(temporaryDirectory, "audit.js");

// run-code executes this function in a real Chromium page. axe's colour
// contrast checks cannot run accurately in jsdom.
writeFileSync(codePath, `async page => {
  // Keep entrance masks from hiding content while contrast is measured.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.addScriptTag({ content: ${JSON.stringify(axeSource)} });
  const result = [];
  for (const [view, selector] of [["landing", "#top"], ["timeline", "#timeline"], ["ending", "#ending"]]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    const violations = await page.evaluate(async (sectionSelector) => {
      const audit = await window.axe.run(document.querySelector(sectionSelector), { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"] } });
      return audit.violations.map(({ id, impact, description, nodes }) => ({
        id, impact, description,
        nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      }));
    }, selector);
    result.push({ view, violations });
  }
  return JSON.stringify(result);
}`);

function run(...args) {
  const result = spawnSync(cli, [`-s=${session}`, ...args], { cwd: temporaryDirectory, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  if (result.error?.code === "ENOENT") {
    throw new Error(`${cli} was not found. Install the official @playwright/cli or set PLAYWRIGHT_CLI to its executable path.`);
  }
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `${cli} failed`);
  return result.stdout;
}

try {
  run("open", target, "--browser=chrome");
  const output = run("--raw", "run-code", `--filename=${codePath}`);
  const encoded = JSON.parse(output.trim());
  const audits = typeof encoded === "string" ? JSON.parse(encoded) : encoded;
  console.log(JSON.stringify(audits, null, 2));
  if (audits.some(({ violations }) => violations.length)) process.exitCode = 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
} finally {
  try { run("close"); } catch { /* The session may never have opened. */ }
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
