/**
 * Mobile stack must stay fully below the fixed nav (no clip) with tight copy gap.
 * Seam: .process-slab getBoundingClientRect vs nav bottom; stack→h1 gap.
 * Also records scroll frames (visual QA "video" strip).
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
const OUT = join(process.cwd(), "scripts", "out", "mobile-stack-qa");

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
  await new Promise((r) => setTimeout(r, 450));
}

async function measure(page) {
  return page.evaluate(() => {
    const navEl =
      document.querySelector("header") ||
      document.querySelector("nav")?.closest("header") ||
      document.querySelector("nav");
    const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 56;
    const slabs = [...document.querySelectorAll(".process-slab")].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        top: r.top,
        bottom: r.bottom,
        h: r.height,
        label: el.querySelector(".process-slab__label, .process-plate__label")?.textContent?.trim(),
      };
    });
    const visual = document.querySelector(".hero-visual")?.getBoundingClientRect();
    const copy = document.querySelector(".hero-copy")?.getBoundingClientRect();
    const stack = document.querySelector(".process-stack, .process-tower");
    const stackR = stack?.getBoundingClientRect();
    const live = [...document.querySelectorAll(".chapter")].find((el) => {
      const cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.4;
    });
    const h1 = live?.querySelector("h1");
    const h1R = h1?.getBoundingClientRect();
    const clipped = slabs.filter((s) => s.h > 8 && s.top < navBottom - 2);
    // Prefer layout gap (copy top − visual bottom) — avoids false overlap when
    // absolute chapter text is measured against overflowing stack paint.
    const layoutGap =
      visual && copy ? Math.round(copy.top - visual.bottom) : null;
    const textGap =
      stackR && h1R ? Math.round(h1R.top - stackR.bottom) : null;
    return {
      navBottom: Math.round(navBottom),
      slabCount: slabs.length,
      clippedCount: clipped.length,
      clippedLabels: clipped.map((c) => c.label),
      visualH: visual ? Math.round(visual.height) : null,
      visualBottom: visual ? Math.round(visual.bottom) : null,
      copyTop: copy ? Math.round(copy.top) : null,
      stackTop: stackR ? Math.round(stackR.top) : null,
      stackBottom: stackR ? Math.round(stackR.bottom) : null,
      h1Top: h1R ? Math.round(h1R.top) : null,
      gap: layoutGap,
      textGap,
      overflowX: document.documentElement.scrollWidth > innerWidth + 2,
      allVisible:
        slabs.length === 5 &&
        clipped.length === 0 &&
        slabs.every((s) => s.h > 8 && s.bottom > navBottom && s.top < innerHeight),
      visualOk: visual != null && visual.height >= 160,
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
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  const res = await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
  assert(res?.status() === 200, `HTTP ${res?.status()}`);
  await new Promise((r) => setTimeout(r, 1800));

  const fails = [];
  const report = { frames: [], samples: [] };
  const probes = [0, 0.12, 0.26, 0.4, 0.54, 0.7, 0.9];

  for (const p of probes) {
    await scrollPin(page, p);
    const m = await measure(page);
    const name = `mobile-p${String(Math.round(p * 100)).padStart(2, "0")}.png`;
    const path = join(OUT, name);
    await page.screenshot({ path, fullPage: false });
    report.frames.push(name);
    report.samples.push({ p, ...m });
    if (!m.allVisible || m.clippedCount > 0) {
      fails.push({ where: "slab-clipped", p, ...m });
    }
    if (!m.visualOk) {
      fails.push({ where: "visual-collapsed", p, ...m });
    }
    if (m.gap != null && (m.gap < 8 || m.gap > 140)) {
      fails.push({ where: "stack-copy-gap", p, ...m });
    }
    if (m.textGap != null && m.textGap > 120) {
      fails.push({ where: "copy-dead-air", p, ...m });
    }
    if (m.textGap != null && m.textGap < 8) {
      fails.push({ where: "stack-copy-overlap", p, ...m });
    }
    if (m.overflowX) fails.push({ where: "overflow-x", p, ...m });
  }

  // Desktop smoke: fan must fill the stage and stay below nav
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1400));
  await scrollPin(page, 0.4);
  const desk = await measure(page);
  const deskFan = await page.evaluate(() => {
    const slabs = [...document.querySelectorAll(".process-slab")].map((el) =>
      el.getBoundingClientRect()
    );
    if (slabs.length < 2) return { fanSpan: 0, minW: 0, inView: 0 };
    const tops = slabs.map((r) => r.top);
    const bottoms = slabs.map((r) => r.bottom);
    const fanSpan = Math.max(...bottoms) - Math.min(...tops);
    const minW = Math.min(...slabs.map((r) => r.width));
    const inView = slabs.filter(
      (r) => r.height > 20 && r.bottom > 60 && r.top < innerHeight - 40
    ).length;
    const overflow = getComputedStyle(document.querySelector(".hero-canvas--tower")).overflow;
    return {
      fanSpan: Math.round(fanSpan),
      minW: Math.round(minW),
      inView,
      overflow,
      mode: document.querySelector(".process-stack")?.dataset?.mode,
    };
  });
  await page.screenshot({ path: join(OUT, "desktop-p40.png"), fullPage: false });
  report.frames.push("desktop-p40.png");
  report.desktopFan = deskFan;
  if (desk.clippedCount > 0) fails.push({ where: "desktop-clip", ...desk });
  if (deskFan.mode !== "fan") fails.push({ where: "desktop-mode", ...deskFan });
  if (deskFan.inView < 5) fails.push({ where: "desktop-slabs-missing", ...deskFan });
  if (deskFan.fanSpan < 140) fails.push({ where: "desktop-fan-collapsed", ...deskFan });
  if (deskFan.minW < 280) fails.push({ where: "desktop-stack-narrow", ...deskFan });
  if (deskFan.overflow !== "visible") fails.push({ where: "desktop-overflow-clip", ...deskFan });
  // Nav bleed: top slab must stay clear of fixed header (user dark-smear bug)
  const navBleed = await page.evaluate(() => {
    const navBottom =
      document.querySelector("header")?.getBoundingClientRect().bottom ?? 56;
    const slabs = [...document.querySelectorAll(".process-slab")].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        label: el.querySelector(".process-slab__label")?.textContent?.trim(),
        top: r.top,
      };
    });
    const minTop = Math.min(...slabs.map((s) => s.top));
    return {
      navBottom: Math.round(navBottom),
      minTop: Math.round(minTop),
      clear: minTop >= navBottom + 10,
      offender: slabs.find((s) => s.top < navBottom + 10)?.label ?? null,
    };
  });
  report.navBleed = navBleed;
  if (!navBleed.clear) fails.push({ where: "desktop-nav-bleed", ...navBleed });

  // Mobile dead-air: body→chrome gap must not dominate the viewport
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1400));
  await scrollPin(page, 0.54);
  const deadAir = await page.evaluate(() => {
    const live = [...document.querySelectorAll(".chapter")].find((el) => {
      const cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.4;
    });
    const body = live?.querySelector(".chapter-body")?.getBoundingClientRect();
    const h1 = live?.querySelector("h1")?.getBoundingClientRect();
    const chrome = document.querySelector(".hero-chrome")?.getBoundingClientRect();
    const contentBottom = Math.max(body?.bottom ?? 0, h1?.bottom ?? 0);
    const gap = chrome && contentBottom ? chrome.top - contentBottom : 999;
    return {
      gap: Math.round(gap),
      contentBottom: Math.round(contentBottom),
      chromeTop: chrome ? Math.round(chrome.top) : null,
      vh: innerHeight,
    };
  });
  report.deadAir = deadAir;
  await page.screenshot({ path: join(OUT, "mobile-dead-air-check.png"), fullPage: false });
  report.frames.push("mobile-dead-air-check.png");
  if (deadAir.gap > 420) fails.push({ where: "mobile-dead-air", ...deadAir });
  // Overlap: stack must clear the live headline
  const overlap = await page.evaluate(() => {
    const stack = document.querySelector(".process-stack")?.getBoundingClientRect();
    const live = [...document.querySelectorAll(".chapter")].find((el) =>
      el.classList.contains("is-active")
    );
    const h1 = live?.querySelector("h1")?.getBoundingClientRect();
    if (!stack || !h1) return { ok: true };
    return {
      ok: h1.top >= stack.bottom - 2,
      stackBottom: Math.round(stack.bottom),
      h1Top: Math.round(h1.top),
      overlap: Math.round(stack.bottom - h1.top),
    };
  });
  report.overlap = overlap;
  if (!overlap.ok) fails.push({ where: "mobile-stack-copy-overlap", ...overlap });

  writeFileSync(join(OUT, "report.json"), JSON.stringify({ fails, report }, null, 2));
  console.log(JSON.stringify({ failCount: fails.length, fails: fails.slice(0, 6), out: OUT }, null, 2));
  await browser.close();
  assert(fails.length === 0, `MOBILE STACK: ${fails[0]?.where} p=${fails[0]?.p}`);
  console.log("\nVERIFY MOBILE STACK PASS");
}

main().catch((e) => {
  console.error("\nVERIFY MOBILE STACK FAIL:", e.message);
  process.exitCode = 1;
});
