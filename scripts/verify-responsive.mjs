/**
 * Responsive / orientation QA seam:
 * - Hero paints full name + portrait
 * - Portrait hint matches visible photo at rest (graduation)
 * - DLSU education logo has transparent corners (no black box)
 * - No document overflow-x across mobile/tablet/desktop/landscape/zoom
 * Screenshots → scripts/qa-output/responsive/
 *
 * Usage: PORTFOLIO_URL=http://localhost:5173/ node scripts/verify-responsive.mjs
 */
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "qa-output", "responsive");
const CHROME = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => p && existsSync(p));
const URL = process.env.PORTFOLIO_URL || "http://localhost:5173/";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const VIEWPORTS = [
  { id: "mobile", width: 390, height: 844, deviceScaleFactor: 2 },
  { id: "mobile-zoom125", width: 390, height: 844, deviceScaleFactor: 2.5 },
  { id: "tablet", width: 768, height: 1024, deviceScaleFactor: 2 },
  { id: "desktop", width: 1440, height: 900, deviceScaleFactor: 1 },
  { id: "landscape-phone", width: 844, height: 390, deviceScaleFactor: 2 },
  { id: "landscape-tablet", width: 1024, height: 768, deviceScaleFactor: 1 },
];

async function shot(page, name) {
  mkdirSync(OUT, { recursive: true });
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  return path;
}

async function heroMetrics(page) {
  return page.evaluate(() => {
    const name = (document.querySelector(".hero-display")?.innerText || "").replace(/\s+/g, " ").trim();
    const profileName = (document.querySelector(".profile-name")?.innerText || "").replace(/\s+/g, " ").trim();
    const portrait = document.querySelector(".hero-portrait img") || document.querySelector(".hero-portrait");
    const chapter = document.querySelector(".hero-lede");
    const cr = chapter?.getBoundingClientRect();
    const heroPin = document.querySelector(".hero-pin");
    const heroTop = heroPin?.getBoundingClientRect()?.top ?? 999;
    const nameEl = document.querySelector(".hero-display");
    const nameInView = Boolean(
      nameEl &&
        (() => {
          const r = nameEl.getBoundingClientRect();
          const visible = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
          return r.width > 0 && visible > Math.min(40, r.height * 0.5);
        })()
    );
    const pr = document.querySelector(".hero-portrait")?.getBoundingClientRect();

    return {
      name,
      profileName,
      overflowX: document.documentElement.scrollWidth > innerWidth + 2,
      docW: document.documentElement.scrollWidth,
      vw: innerWidth,
      scrollY: window.scrollY,
      heroTop,
      nameInView,
      introVisible:
        chapter &&
        parseFloat(getComputedStyle(chapter).opacity) > 0.5 &&
        getComputedStyle(chapter).visibility !== "hidden",
      portraitOk: Boolean(portrait && (portrait.naturalWidth || portrait.clientWidth || 0) > 0),
      introBeforePortrait: Boolean(cr && pr && cr.top <= pr.top + 8),
      overflowClip: chapter && cr.height < 80,
    };
  });
}

async function educationMetrics(page) {
  return page.evaluate(() => {
    const logo = document.querySelector("#education .edu-dlsu-logo");
    let logoBlackBox = null;
    if (logo) {
      // Sample corners without forcing page scroll — caller already scrolled #education into view
      const c = document.createElement("canvas");
      const w = Math.min(64, logo.naturalWidth || 64);
      const h = Math.min(64, logo.naturalHeight || 64);
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      try {
        ctx.drawImage(logo, 0, 0, w, h);
        const corners = [
          ctx.getImageData(1, 1, 1, 1).data,
          ctx.getImageData(w - 2, 1, 1, 1).data,
          ctx.getImageData(1, h - 2, 1, 1).data,
          ctx.getImageData(w - 2, h - 2, 1, 1).data,
        ];
        logoBlackBox = corners.some(
          ([r, g, b, a]) => a > 200 && r < 25 && g < 25 && b < 25
        );
      } catch {
        logoBlackBox = "tainted-or-unloaded";
      }
    }
    return {
      logoSrc: logo?.currentSrc || logo?.src || null,
      logoNatural: logo?.naturalWidth || 0,
      logoBlackBox,
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
  const report = { fails: [], shots: [] };

  for (const vp of VIEWPORTS) {
    await page.setViewport(vp);
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
    await page.evaluate(() => {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 1600));
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      document.querySelector(".hero-pin")?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.waitForSelector(".hero-portrait img, img.hero-portrait", { timeout: 10000 });
    await page.waitForFunction(
      () => {
        const img = document.querySelector(".hero-portrait img") || document.querySelector("img.hero-portrait");
        return img && img.naturalWidth > 0;
      },
      { timeout: 10000 }
    );

    const m = await heroMetrics(page);
    const shotName = `${vp.id}-hero`;
    await shot(page, shotName);
    report.shots.push(shotName);

    if (m.scrollY > 40 || m.heroTop > 80 || !m.nameInView) {
      report.fails.push({ vp: vp.id, where: "hero-not-in-viewport", m });
    }
    if (!/Building systems/i.test(m.name) || !/scale/i.test(m.name)) {
      report.fails.push({ vp: vp.id, where: "hero-headline", m });
    }
    if (!/Malcolm Joaquin/i.test(m.profileName) || !/Cuady/i.test(m.profileName)) {
      report.fails.push({ vp: vp.id, where: "hero-profile-name", m });
    }
    const tagline = await page.evaluate(() => {
      const body = document.querySelector(".hero-hook");
      return body ? body.textContent.trim() : "";
    });
    if (/five layers from messy/i.test(tagline)) {
      report.fails.push({ vp: vp.id, where: "intro-tagline-still-present", tagline });
    }
    if (!/digital systems/i.test(tagline)) {
      report.fails.push({ vp: vp.id, where: "intro-thesis-missing", tagline });
    }
    const hasCta = await page.evaluate(
      () =>
        !!document.querySelector(".hero-cta a[href='#work']") ||
        !!document.querySelector(".hero-cta a[href='#projects']")
    );
    if (!hasCta) report.fails.push({ vp: vp.id, where: "intro-cta-missing" });
    const ctaInView = await page.evaluate(() => {
      const cta = document.querySelector(".hero-cta");
      if (!cta) return false;
      const r = cta.getBoundingClientRect();
      const visible = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      return visible > 20;
    });
    if (!ctaInView) report.fails.push({ vp: vp.id, where: "intro-cta-clipped" });
    const heroText = await page.evaluate(() => {
      const pin = document.querySelector(".hero-sticky");
      return (pin?.innerText || "").replace(/\s+/g, " ");
    });
    if (/five layers from messy/i.test(heroText)) {
      report.fails.push({ vp: vp.id, where: "intro-tagline-in-viewport-text" });
    }
    const processOk = await page.evaluate(() => {
      const stations = document.querySelectorAll(".hero-station").length;
      const root = document.querySelector("[data-hero='bento']") || document.querySelector(".hero-sticky");
      const banned = /Hear the operation|Hear · Shape|Leave it live|5\+\s*YEARS|35%\+/i.test(
        root?.innerText || ""
      );
      const grid = document.querySelector(".hero-bento-grid");
      const r = grid?.getBoundingClientRect();
      const painted = r && r.width > 40 && r.height > 40 && r.top < innerHeight;
      return { stations, banned, painted, ok: stations === 0 && !banned && painted };
    });
    if (!processOk.ok) report.fails.push({ vp: vp.id, where: "process-stations-removed", processOk });
    if (!m.portraitOk || !m.introVisible) {
      report.fails.push({ vp: vp.id, where: "hero-portrait", m });
    }
    if (!m.introBeforePortrait) {
      report.fails.push({ vp: vp.id, where: "intro-after-portrait", m });
    }
    if (m.overflowX) {
      report.fails.push({ vp: vp.id, where: "overflow-x", m });
    }

    // Education logo check — AFTER hero shot, and only on selected viewports
    if (vp.id === "desktop" || vp.id === "tablet" || vp.id === "mobile") {
      await page.evaluate(() => {
        document.querySelector("#education")?.scrollIntoView({ block: "start" });
      });
      await new Promise((r) => setTimeout(r, 600));
      const em = await educationMetrics(page);
      await shot(page, `${vp.id}-education`);
      report.shots.push(`${vp.id}-education`);
      if (!em.logoSrc || em.logoNatural < 16) {
        report.fails.push({ vp: vp.id, where: "dlsu-logo-missing", em });
      }
      if (em.logoBlackBox === true) {
        report.fails.push({ vp: vp.id, where: "dlsu-logo-black-box", em });
      }
      if (em.logoBlackBox === "tainted-or-unloaded" && em.logoNatural > 16) {
        report.fails.push({ vp: vp.id, where: "dlsu-logo-unreadable", em });
      }
    }
  }

  writeFileSync(join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  assert(report.fails.length === 0, `RESPONSIVE FAIL: ${report.fails[0]?.where} @ ${report.fails[0]?.vp}`);
  console.log("\nVERIFY RESPONSIVE PASS");
}

main().catch((e) => {
  console.error("\nVERIFY RESPONSIVE FAIL:", e.message);
  process.exitCode = 1;
});
