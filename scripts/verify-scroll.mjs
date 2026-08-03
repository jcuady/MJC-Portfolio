/**
 * Red-capable loop: hero scroll animation must NOT be static.
 * Tests BOTH prefers-reduced-motion modes (scrub must still work).
 *
 * Usage: node scripts/verify-scroll.mjs
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

async function runPass(page, reduced) {
  await page.emulateMediaFeatures([
    {
      name: "prefers-reduced-motion",
      value: reduced ? "reduce" : "no-preference",
    },
  ]);
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1700));

  const base = await page.evaluate(() => ({
    pinSpacers: document.querySelectorAll(".pin-spacer").length,
    hasHero: !!document.querySelector(".hero-pin"),
    spacerH: document.querySelector(".pin-spacer")?.offsetHeight || 0,
  }));

  assert(base.hasHero, "Missing .hero-pin");
  assert(base.pinSpacers >= 1, `No pin-spacer (pin dead). count=${base.pinSpacers}`);
  assert(base.spacerH > 1100, `Pin spacer too short: ${base.spacerH}`);

  const sample = async (frac) => {
    await page.evaluate((f) => {
      const spacer = document.querySelector(".pin-spacer");
      const total = spacer.offsetHeight - window.innerHeight;
      window.scrollTo({ top: Math.max(0, total * f), behavior: "instant" });
    }, frac);
    await new Promise((r) => setTimeout(r, 550));
    return page.evaluate(() => {
      const g = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return { op: "0" };
        return { op: getComputedStyle(el).opacity };
      };
      const stack = document.querySelector(".css-stack");
      return {
        spread: parseFloat(stack?.style.getPropertyValue("--spread") || "0"),
        intro: parseFloat(g(".chapter-intro").op),
        unstack: parseFloat(g(".chapter-unstack").op),
        analyze: parseFloat(g(".chapter-analyze").op),
        deliver: parseFloat(g(".chapter-deliver").op),
      };
    });
  };

  const a = await sample(0);
  const b = await sample(0.2);
  const c = await sample(0.32);
  const d = await sample(0.86);

  const introFaded = a.intro > 0.7 && c.intro < 0.25;
  const spreadGrew = Math.max(b.spread, c.spread, d.spread) > a.spread + 4;
  const storyMoved = b.unstack > 0.4 || c.analyze > 0.4 || d.deliver > 0.4;

  assert(introFaded, `[${reduced ? "reduce" : "motion"}] intro never fades`);
  assert(
    spreadGrew,
    `[${reduced ? "reduce" : "motion"}] stack spread static ${a.spread}→${c.spread}`
  );
  assert(storyMoved, `[${reduced ? "reduce" : "motion"}] no chapter text became visible`);

  return {
    mode: reduced ? "reduce" : "motion",
    pinSpacers: base.pinSpacers,
    spacerH: base.spacerH,
    a,
    b,
    c,
    d,
  };
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
