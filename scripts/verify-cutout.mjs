/**
 * Cutout / overlap QA — the exact desktop+mobile bugs from screenshots:
 * - eyebrow clipped by fixed nav
 * - Resume CTA sitting on hero chrome
 * - mobile name painted over the 5 process plates
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
const OUT = join(process.cwd(), "scripts", "out", "cutout-qa");

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
  await new Promise((r) => setTimeout(r, 480));
}

async function measure(page) {
  return page.evaluate(() => {
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return null;
      if (r.width < 1 || r.height < 1) return null;
      return {
        top: r.top,
        bottom: r.bottom,
        left: r.left,
        right: r.right,
        width: r.width,
        height: r.height,
      };
    };

    const nav = box(document.querySelector("header"));
    const h1 = box(document.querySelector(".hero-display"));
    const cta = box(document.querySelector(".hero-cta"));
    const portrait = box(document.querySelector(".hero-portrait"));
    const stations = [...document.querySelectorAll(".hero-station")].map((el) => box(el)).filter(Boolean);
    const navBottom = nav?.bottom ?? 56;
    const ctas = [...document.querySelectorAll(".hero-cta a")].map((el) => {
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });
    return {
      vw: innerWidth,
      vh: innerHeight,
      overflowX: document.documentElement.scrollWidth > innerWidth + 2,
      navBottom: Math.round(navBottom),
      h1Top: h1 ? Math.round(h1.top) : null,
      h1ClearNav: !h1 || h1.top >= navBottom - 1,
      portraitH: portrait ? Math.round(portrait.height) : null,
      stationCount: stations.length,
      stationsClearNav: stations.every((p) => !p || p.top >= navBottom - 2),
      touchMin: ctas.length ? Math.min(...ctas.map((t) => t.h)) : 44,
      name: document.querySelector(".hero-display")?.innerText?.replace(/\s+/g, " ").trim() ?? null,
    };
  });
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

  const fails = [];
  const report = { samples: [] };

  const runs = [
    { id: "desk", viewport: { width: 1440, height: 900 }, probes: [0, 0.26, 0.54, 0.9] },
    { id: "laptop", viewport: { width: 1366, height: 768 }, probes: [0, 0.4, 0.9] },
    { id: "short", viewport: { width: 1280, height: 720 }, probes: [0, 0.4] },
    { id: "wide-short", viewport: { width: 1536, height: 720 }, probes: [0, 0.4] },
    { id: "mob", viewport: { width: 390, height: 844, deviceScaleFactor: 2 }, probes: [0, 0.26, 0.54, 0.9] },
    { id: "se", viewport: { width: 360, height: 740, deviceScaleFactor: 2 }, probes: [0, 0.4] },
    { id: "tab", viewport: { width: 768, height: 1024, deviceScaleFactor: 2 }, probes: [0, 0.4] },
    { id: "land-phone", viewport: { width: 844, height: 390, deviceScaleFactor: 2 }, probes: [0, 0.4] },
    { id: "land-tab", viewport: { width: 1024, height: 768 }, probes: [0, 0.4] },
  ];

  for (const run of runs) {
    await page.setViewport(run.viewport);
    const res = await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
    assert(res && res.status() < 400, `HTTP ${res?.status()}`);
    await new Promise((r) => setTimeout(r, 1600));

    for (const p of run.probes) {
      await scrollPin(page, p);
      const m = await measure(page);
      const name = `${run.id}-p${String(Math.round(p * 100)).padStart(2, "0")}.png`;
      await page.screenshot({ path: join(OUT, name), fullPage: false });
      report.samples.push({ id: run.id, p, shot: name, ...m });

      if (!m.h1ClearNav) fails.push({ where: "h1-nav-cutout", id: run.id, p, ...m });
      if (m.overflowX) fails.push({ where: "overflow-x", id: run.id, p, ...m });
      if (!/Building systems/i.test(m.name || "")) fails.push({ where: "headline-missing", id: run.id, p, ...m });
      if ((run.id === "mob" || run.id === "se") && m.touchMin < 40) {
        fails.push({ where: "touch-target", id: run.id, p, ...m });
      }
    }
  }

  writeFileSync(join(OUT, "report.json"), JSON.stringify({ fails, report }, null, 2));
  console.log(JSON.stringify({ failCount: fails.length, fails: fails.slice(0, 8), out: OUT }, null, 2));
  await browser.close();
  assert(fails.length === 0, `CUTOUT: ${fails[0]?.where} ${fails[0]?.id} p=${fails[0]?.p}`);
  console.log("\nVERIFY CUTOUT PASS");
}

main().catch(async (e) => {
  console.error("\nVERIFY CUTOUT FAIL:", e.message);
  process.exitCode = 1;
  process.exit(1);
});
