/**
 * Principal QA device matrix + scroll record (newfixes.md).
 * Stills: scripts/out/device-matrix/
 * Scroll frames: scripts/out/device-record/
 */
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const CHROME = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => p && existsSync(p));
const URL = process.env.PORTFOLIO_URL || "http://localhost:5173/";
const STILLS = join(process.cwd(), "scripts", "out", "device-matrix");
const RECORD = join(process.cwd(), "scripts", "out", "device-record");

const VIEWPORTS = [
  { id: "320x568", width: 320, height: 568, deviceScaleFactor: 2 },
  { id: "360x800", width: 360, height: 800, deviceScaleFactor: 2 },
  { id: "375x812", width: 375, height: 812, deviceScaleFactor: 2 },
  { id: "390x844", width: 390, height: 844, deviceScaleFactor: 2 },
  { id: "412x915", width: 412, height: 915, deviceScaleFactor: 2 },
  { id: "430x932", width: 430, height: 932, deviceScaleFactor: 2 },
  { id: "844x390-land", width: 844, height: 390, deviceScaleFactor: 2 },
  { id: "932x430-land", width: 932, height: 430, deviceScaleFactor: 2 },
  { id: "768x1024", width: 768, height: 1024, deviceScaleFactor: 2 },
  { id: "820x1180", width: 820, height: 1180, deviceScaleFactor: 2 },
  { id: "834x1194", width: 834, height: 1194, deviceScaleFactor: 2 },
  { id: "1024x768-land", width: 1024, height: 768 },
  { id: "1180x820", width: 1180, height: 820 },
  { id: "1280x720", width: 1280, height: 720 },
  { id: "1366x768", width: 1366, height: 768 },
  { id: "1440x900", width: 1440, height: 900 },
  { id: "1536x864", width: 1536, height: 864 },
  { id: "1920x1080", width: 1920, height: 1080 },
  { id: "2560x1440", width: 2560, height: 1440 },
];

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function pageHealth(page) {
  return page.evaluate(() => {
    const overflowX = document.documentElement.scrollWidth > innerWidth + 2;
    const h1 = document.querySelector(".hero-display");
    const cta = document.querySelector(".hero-cta a");
    const nav = document.querySelector("header");
    const hr = h1?.getBoundingClientRect();
    const cr = cta?.getBoundingClientRect();
    const navBottom = nav?.getBoundingClientRect().bottom ?? 0;
    const visible = (r) => {
      if (!r) return false;
      const v = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      return r.width > 8 && v > 12;
    };
    const pillars = [...document.querySelectorAll(".transform-card li")].map((el) =>
      el.getBoundingClientRect()
    );
    let overlap = false;
    for (let i = 0; i < pillars.length; i += 1) {
      for (let j = i + 1; j < pillars.length; j += 1) {
        const a = pillars[i];
        const b = pillars[j];
        if (a.left < b.right - 2 && a.right > b.left + 2 && a.top < b.bottom - 2 && a.bottom > b.top + 2) {
          overlap = true;
        }
      }
    }
    return {
      overflowX,
      headlineInView: visible(hr),
      h1ClearsNav: !hr || hr.top >= navBottom - 2,
      ctaExists: Boolean(cta),
      transformOverlap: overlap,
    };
  });
}

async function main() {
  assert(CHROME, "Chrome not found");
  mkdirSync(STILLS, { recursive: true });
  mkdirSync(RECORD, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  const fails = [];
  const shots = [];

  for (const vp of VIEWPORTS) {
    await page.setViewport(vp);
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
    await new Promise((r) => setTimeout(r, 350));
    const h = await pageHealth(page);
    const file = `${vp.id}.png`;
    await page.screenshot({ path: join(STILLS, file), fullPage: false });
    shots.push(file);
    if (h.overflowX) fails.push({ vp: vp.id, where: "overflow-x" });
    if (!h.headlineInView) fails.push({ vp: vp.id, where: "headline-out" });
    if (!h.h1ClearsNav) fails.push({ vp: vp.id, where: "h1-under-nav" });
    if (!h.ctaExists) fails.push({ vp: vp.id, where: "cta-missing" });
    if (h.transformOverlap) fails.push({ vp: vp.id, where: "transform-overlap" });
  }

  for (const rec of [
    { id: "desk-scroll", width: 1440, height: 900, fracs: [0, 0.08, 0.18, 0.32, 0.5, 0.72, 0.9] },
    { id: "mob-scroll", width: 390, height: 844, dpr: 2, fracs: [0, 0.12, 0.28, 0.48, 0.7, 0.9] },
    { id: "land-scroll", width: 844, height: 390, dpr: 2, fracs: [0, 0.25, 0.55, 0.85] },
  ]) {
    await page.setViewport({
      width: rec.width,
      height: rec.height,
      deviceScaleFactor: rec.dpr || 1,
    });
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
    await new Promise((r) => setTimeout(r, 400));
    const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (const f of rec.fracs) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.max(0, max * f));
      await new Promise((r) => setTimeout(r, 220));
      const name = `${rec.id}-p${String(Math.round(f * 100)).padStart(2, "0")}.png`;
      await page.screenshot({ path: join(RECORD, name), fullPage: false });
    }
  }

  const report = { failCount: fails.length, fails, shots, stills: STILLS, record: RECORD };
  writeFileSync(join(STILLS, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  assert(fails.length === 0, `DEVICE MATRIX: ${fails[0]?.where} @ ${fails[0]?.vp}`);
  console.log("\nVERIFY DEVICE MATRIX PASS");
}

main().catch((e) => {
  console.error("\nVERIFY DEVICE MATRIX FAIL:", e.message);
  process.exitCode = 1;
});
