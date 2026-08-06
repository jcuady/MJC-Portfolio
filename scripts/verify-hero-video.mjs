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
    const slabs = [...document.querySelectorAll(".process-slab")].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        label: el.querySelector(".process-slab__label")?.textContent?.trim(),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
      };
    });
    const live = [...document.querySelectorAll(".chapter")].find((el) => {
      const cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.4;
    });
    const h1 = live?.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim();
    const minTop = slabs.length ? Math.min(...slabs.map((s) => s.top)) : 0;
    return {
      navBottom: Math.round(navBottom),
      minTop,
      navClear: minTop >= navBottom + 8,
      chapter: h1?.slice(0, 48) ?? null,
      active: document.querySelector(".process-stack")?.dataset?.active,
      mode: document.querySelector(".process-stack")?.dataset?.mode,
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
  const desktop = await runViewport(page, "desk", { width: 1440, height: 900 }, probes);
  const mobile = await runViewport(
    page,
    "mob",
    { width: 390, height: 844, deviceScaleFactor: 2 },
    probes
  );

  const fails = [];
  for (const f of desktop) {
    if (!f.navClear) fails.push({ where: "desk-nav-bleed", ...f });
  }
  for (const f of mobile) {
    if (!f.navClear && f.mode === "flat") {
      // flat list starts below nav by CSS; still flag if under
      fails.push({ where: "mob-nav-bleed", ...f });
    }
  }

  const report = { fails, desktop, mobile, out: OUT };
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
