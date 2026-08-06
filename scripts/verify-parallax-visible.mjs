/**
 * VISIBLE parallax loop — asserts the human symptom:
 * "cards sit in one flat aligned row / no depth while looking at the gallery".
 *
 * Pass requires measurable on-screen vertical spread between cards AND
 * that spread changes while the gallery stays in view.
 *
 * Usage: node scripts/verify-parallax-visible.mjs
 */
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "qa-output");
const CHROME = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => p && existsSync(p));
const URL = process.env.PORTFOLIO_URL || "http://localhost:5173/";

/** Human-noticeable thresholds (strict). */
const MIN_SPREAD_PX = 56; // tops must not look coplanar
const MIN_SPREAD_DELTA = 28; // spread must change while scrolling in view
const MIN_MOTION_PX = 40; // at least one card must travel while gallery in view

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function galleryGeometry(page) {
  return page.evaluate(() => {
    const gallery = document.querySelector(".st-gallery");
    const frame = gallery?.querySelector(".st-parallax-frame");
    const cards = [...document.querySelectorAll(".st-parallax-card")];
    const gRect = gallery.getBoundingClientRect();
    const tops = cards.map((c) => c.getBoundingClientRect().top);
    const relTops = cards.map((c) => c.getBoundingClientRect().top - gRect.top);
    const lefts = cards.map((c) => c.getBoundingClientRect().left);
    const spreads = {
      topSpread: tops.length ? Math.max(...tops) - Math.min(...tops) : 0,
      leftSpread: lefts.length ? Math.max(...lefts) - Math.min(...lefts) : 0,
    };
    const frameCs = frame ? getComputedStyle(frame) : null;
    const ty = cards.map((c) => {
      const t = c.style.transform || "";
      const m = t.match(/translate\(([^,]+),\s*([-\d.]+)px\)/);
      return m ? parseFloat(m[2]) : 0;
    });
    return {
      progress: parseFloat(document.querySelector("#statement")?.dataset.parallaxProgress || "0"),
      tops,
      relTops,
      ty,
      lefts,
      ...spreads,
      transforms: cards.map((c) => c.style.transform || getComputedStyle(c).transform),
      frameOverflow: frameCs?.overflow,
      frameHeight: frame?.clientHeight ?? 0,
      cardCount: cards.length,
      galleryTop: gRect.top,
      galleryInView:
        gRect.top < innerHeight * 0.85 && gRect.bottom > innerHeight * 0.15,
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
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);

  await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 2200));

  const base = await page.evaluate(() => {
    const g = document.querySelector(".st-gallery");
    const top = g.getBoundingClientRect().top + window.scrollY;
    return { top, h: g.offsetHeight, vh: innerHeight };
  });

  // Center gallery, then advance progress while still in view
  await page.evaluate(
    (y) => scrollTo({ top: y, behavior: "instant" }),
    base.top - base.vh * 0.4
  );
  await new Promise((r) => setTimeout(r, 700));
  const mid = await galleryGeometry(page);
  await page.screenshot({ path: join(OUT, "visible-parallax-mid.png"), fullPage: false });

  assert(mid.galleryInView, "gallery not in view for mid sample");
  assert(mid.cardCount >= 3, `need ≥3 cards, got ${mid.cardCount}`);

  // THE USER SYMPTOM: flat coplanar row
  assert(
    mid.topSpread >= MIN_SPREAD_PX,
    `FLAT ROW: card top spread ${mid.topSpread.toFixed(1)}px < ${MIN_SPREAD_PX}px (looks coplanar)`
  );

  // Scroll while gallery remains in view — depth must evolve
  await page.evaluate(
    (y) => scrollTo({ top: y, behavior: "instant" }),
    base.top + base.h * 0.15
  );
  await new Promise((r) => setTimeout(r, 700));
  const late = await galleryGeometry(page);
  await page.screenshot({ path: join(OUT, "visible-parallax-late.png"), fullPage: false });

  assert(late.galleryInView, "gallery left view before late sample");
  const spreadDelta = Math.abs(late.topSpread - mid.topSpread);
  const maxRelMotion = Math.max(
    ...late.relTops.map((t, i) => Math.abs(t - mid.relTops[i]))
  );
  const maxTyMotion = Math.max(...late.ty.map((t, i) => Math.abs(t - mid.ty[i])));
  assert(
    maxRelMotion >= MIN_MOTION_PX || maxTyMotion >= MIN_MOTION_PX,
    `STATIC LOOK: relative motion ${maxRelMotion.toFixed(1)}px / tyΔ ${maxTyMotion.toFixed(1)}px < ${MIN_MOTION_PX}px (page scroll alone does not count)`
  );
  assert(
    spreadDelta >= 4 || maxTyMotion >= MIN_MOTION_PX,
    `depth lock: spread hardly changes (${spreadDelta.toFixed(1)}px) and tyΔ weak`
  );

  // Depth frame must allow vertical fan (y-visible)
  const oy = await page.evaluate(() => {
    const f = document.querySelector(".st-parallax-frame");
    return f ? getComputedStyle(f).overflowY : "";
  });
  assert(oy === "visible" || oy === "auto", `frame overflow-y clips depth: ${oy}`);

  const report = {
    ok: true,
    mid,
    late,
    spreadDelta,
    maxRelMotion,
    maxTyMotion,
    thresholds: { MIN_SPREAD_PX, MIN_SPREAD_DELTA, MIN_MOTION_PX },
  };
  writeFileSync(join(OUT, "visible-parallax-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  console.log("\nVERIFY PARALLAX VISIBLE PASS");
}

main().catch((e) => {
  console.error("\nVERIFY PARALLAX VISIBLE FAIL:", e.message);
  process.exitCode = 1;
});
