/**
 * Hero chapter exclusivity — catches ghosted dual-chapter text (mobile screenshot bug).
 * Seam: at most one dominant chapter; titles must not AABB-overlap.
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

async function scrollPin(page, progress, settleMs = 120) {
  await page.evaluate((progress) => {
    const spacers = [...document.querySelectorAll(".pin-spacer")];
    const s = spacers[0];
    if (!s) return;
    const room = Math.max(1, s.offsetHeight - innerHeight);
    window.scrollTo({ top: s.offsetTop + room * progress, behavior: "instant" });
  }, progress);
  await new Promise((r) => setTimeout(r, settleMs));
}

async function measureChapters(page) {
  return page.evaluate(() => {
    const h1s = [...document.querySelectorAll(".hero-display")];
    return {
      liveCount: h1s.length,
      liveIds: ["hero-display"],
      overlaps: [],
      overflowX: document.documentElement.scrollWidth > innerWidth + 2,
      name: h1s[0]?.innerText?.replace(/\s+/g, " ").trim() || "",
    };
  });
}

async function main() {
  assert(CHROME, "Chrome not found");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);

  const samples = [
    0, 0.11, 0.13, 0.2, 0.25, 0.27, 0.39, 0.41, 0.53, 0.55, 0.67, 0.69, 0.81, 0.83, 0.93, 0.96,
  ];
  const fails = [];

  for (const vp of [
    { id: "mobile", width: 390, height: 844 },
    { id: "desktop", width: 1440, height: 900 },
    { id: "landscape", width: 844, height: 390 },
    { id: "tablet", width: 768, height: 1024 },
  ]) {
    await page.setViewport(vp);
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1600));
    const probe = vp.id === "tablet" ? [0, 0.27, 0.55, 0.83] : samples;
    for (const p of probe) {
      await scrollPin(page, p, p === 0 ? 400 : 90);
      const m = await measureChapters(page);
      if (m.liveCount !== 1) fails.push({ where: "h1-count", vp: vp.id, p, ...m });
      if (!/Building systems/i.test(m.name || "")) fails.push({ where: "headline-missing", vp: vp.id, p, ...m });
      if (m.overlaps.length) fails.push({ where: "title-overlap", vp: vp.id, p, ...m });
      if (m.overflowX) fails.push({ where: "overflow-x", vp: vp.id, p, ...m });
    }
  }

  console.log(JSON.stringify({ failCount: fails.length, fails: fails.slice(0, 12) }, null, 2));
  await browser.close();
  assert(fails.length === 0, `HERO CHAPTERS: ${fails[0]?.where} @ ${fails[0]?.vp} p=${fails[0]?.p}`);
  console.log("\nVERIFY HERO CHAPTERS PASS");
}

main().catch((e) => {
  console.error("\nVERIFY HERO CHAPTERS FAIL:", e.message);
  process.exitCode = 1;
});
