/**
 * Principal QA scroll strip — desktop + mobile hero frames across the pin.
 * Writes scripts/out/hero-video/ + report.json (frame paths + clip/dead-air metrics).
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
const OUT = join(process.cwd(), "scripts", "out", "hero-video");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function scrollPin(page, progress) {
  await page.evaluate((progress) => {
    const s = document.querySelectorAll(".pin-spacer")[0];
    if (!s) return;
    const room = Math.max(1, s.offsetHeight - innerHeight);
    window.scrollTo({ top: s.offsetTop + room * progress, behavior: "instant" });
  }, progress);
  await new Promise((r) => setTimeout(r, 380));
}

async function metrics(page) {
  return page.evaluate(() => {
    const navBottom =
      document.querySelector("header")?.getBoundingClientRect().bottom ?? 56;
    const nameEl = document.querySelector(".hero-display");
    const nameBox = nameEl?.getBoundingClientRect();
    const portrait = document.querySelector(".hero-portrait")?.getBoundingClientRect();
    const liveTop = Math.min(nameBox?.top ?? 999, portrait?.top ?? 999);
    return {
      navBottom: Math.round(navBottom),
      minTop: Math.round(liveTop),
      navClear: liveTop >= navBottom - 1,
      chapter: nameEl?.innerText?.replace(/\s+/g, " ").trim().slice(0, 48) ?? null,
      p: document.querySelector("[data-hero='press']")?.dataset?.p,
      mode: document.querySelector("[data-hero='press']")?.dataset?.motion,
    };
  });
}

async function runViewport(page, id, viewport, probes) {
  await page.setViewport(viewport);
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1400));
  const frames = [];
  for (const p of probes) {
    await scrollPin(page, p);
    const m = await metrics(page);
    const name = `${id}-p${String(Math.round(p * 100)).padStart(2, "0")}.png`;
    await page.screenshot({ path: join(OUT, name), fullPage: false });
    frames.push({ name, p, ...m });
  }
  return frames;
}

async function main() {
  assert(CHROME, "Chrome not found");
  mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);

  const probes = [0, 0.08, 0.12, 0.2, 0.26, 0.4, 0.54, 0.68, 0.82, 0.94];
  const shortProbes = [0, 0.26, 0.54, 0.9];
  const desktop = await runViewport(page, "desk", { width: 1440, height: 900 }, probes);
  const laptop = await runViewport(page, "laptop", { width: 1366, height: 768 }, shortProbes);
  const wideShort = await runViewport(page, "wide-short", { width: 1536, height: 720 }, shortProbes);
  const mobile = await runViewport(
    page,
    "mob",
    { width: 390, height: 844, deviceScaleFactor: 2 },
    probes
  );
  const landPhone = await runViewport(
    page,
    "land",
    { width: 844, height: 390, deviceScaleFactor: 2 },
    shortProbes
  );

  const fails = [];
  for (const group of [
    ["desk-nav-bleed", desktop],
    ["laptop-nav-bleed", laptop],
    ["wide-short-nav-bleed", wideShort],
    ["mob-nav-bleed", mobile],
    ["land-nav-bleed", landPhone],
  ]) {
    const [where, frames] = group;
    for (const f of frames) {
      if (!f.navClear) fails.push({ where, ...f });
    }
  }

  const report = { fails, desktop, laptop, wideShort, mobile, landPhone, out: OUT };
  writeFileSync(join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ failCount: fails.length, fails: fails.slice(0, 4), out: OUT }, null, 2));
  await browser.close();
  assert(fails.length === 0, `HERO VIDEO: ${fails[0]?.where} p=${fails[0]?.p}`);
  console.log("\nVERIFY HERO VIDEO PASS");
}

main().catch((e) => {
  console.error("\nVERIFY HERO VIDEO FAIL:", e.message);
  process.exitCode = 1;
});
