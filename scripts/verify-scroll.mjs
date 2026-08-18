/**
 * Hero press scroll: desktop pin must advance progress; reduced-motion stays static.
 */
import puppeteer from "puppeteer-core";
import { existsSync } from "fs";

const CHROME = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => p && existsSync(p));
const URL = process.env.PORTFOLIO_URL || "http://localhost:5173/";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function sample(page, frac) {
  await page.evaluate((f) => {
    const spacer = document.querySelector(".pin-spacer");
    if (!spacer) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    const total = spacer.offsetHeight - window.innerHeight;
    window.scrollTo({ top: Math.max(0, total * f), behavior: "instant" });
  }, frac);
  await new Promise((r) => setTimeout(r, 500));
  return page.evaluate(() => {
    const hero = document.querySelector("[data-hero='press']");
    const name = document.querySelector(".hero-display")?.innerText?.replace(/\s+/g, " ").trim() || "";
    return {
      p: Number(hero?.dataset?.p ?? 0),
      motion: hero?.dataset?.motion ?? null,
      name,
    };
  });
}

async function runPass(page, reduced) {
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" },
  ]);
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1400));

  const a = await sample(page, 0);
  const c = await sample(page, 0.5);
  const d = await sample(page, 0.9);
  assert(/Malcolm Joaquin/i.test(a.name), `[${reduced ? "reduce" : "motion"}] name missing`);
  assert(/Malcolm Joaquin/i.test(d.name), `[${reduced ? "reduce" : "motion"}] name vanished`);

  if (reduced) {
    assert(a.motion === "static", `reduce should be static, got ${a.motion}`);
    return { mode: "reduce", a, c, d };
  }

  assert(a.motion === "pin", `motion should pin, got ${a.motion}`);
  assert(c.p > a.p || d.p > a.p, `pin progress static ${a.p}→${c.p}→${d.p}`);
  return { mode: "motion", a, c, d };
}

async function main() {
  assert(CHROME, "Chrome not found");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const res = await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 15000 }).catch((e) => {
    throw new Error(`localhost down at ${URL}: ${e.message}`);
  });
  assert(res?.status() === 200, `HTTP ${res?.status()}`);
  const motion = await runPass(page, false);
  const reduce = await runPass(page, true);
  console.log(JSON.stringify({ motion, reduce }, null, 2));
  await browser.close();
  console.log("\nVERIFY PASS — scroll story live under both motion prefs");
}

main().catch((err) => {
  console.error("\nVERIFY FAIL:", err.message);
  process.exitCode = 1;
});
