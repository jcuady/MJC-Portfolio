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
    const name = [...document.querySelectorAll(".chapter-intro .chapter-line")]
      .map((e) => e.textContent.trim())
      .join(" ");
    const hint = document.querySelector(".hero-portrait-hint")?.textContent?.trim() || "";
    const pressed = document.querySelector(".hero-portrait")?.getAttribute("aria-pressed");
    const portraitBtn = document.querySelector(".hero-portrait");
    const grad = document.querySelector(".hero-portrait img[data-shot='grad']");
    const barong = document.querySelector(".hero-portrait img[data-shot='barong']");
    const chapter = document.querySelector(".chapter-intro");
    const cr = chapter?.getBoundingClientRect();
    const heroPin = document.querySelector(".hero-pin");
    const heroTop = heroPin?.getBoundingClientRect()?.top ?? 999;
    const nameEl = document.querySelector(".chapter-intro .hero-name, .chapter-intro h1");
    const nameInView = Boolean(
      nameEl &&
        (() => {
          const r = nameEl.getBoundingClientRect();
          // Majority of the name block must sit in the viewport (not education section)
          const visible = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
          return r.width > 0 && visible > Math.min(40, r.height * 0.5);
        })()
    );

    return {
      name,
      hint,
      pressed,
      gradOp: grad ? getComputedStyle(grad).opacity : null,
      barongOp: barong ? getComputedStyle(barong).opacity : null,
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
      portraitOk: Boolean(portraitBtn && grad && (grad.naturalWidth || 0) > 0),
      overflowClip: chapter && (cr.bottom > innerHeight + 8 || cr.height < 80),
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
    // Portrait must exist in intro chapter
    await page.waitForSelector(".chapter-intro [data-shot='grad']", { timeout: 10000 });
    await page.waitForFunction(
      () => {
        const img = document.querySelector(".chapter-intro [data-shot='grad']");
        return img && img.naturalWidth > 0;
      },
      { timeout: 10000 }
    );

    const m = await heroMetrics(page);
    const shotName = `${vp.id}-hero`;
    await shot(page, shotName);
    report.shots.push(shotName);

    // Hero shot must actually show the intro (metrics must not scroll away first)
    if (m.scrollY > 40 || m.heroTop > 80 || !m.nameInView) {
      report.fails.push({ vp: vp.id, where: "hero-not-in-viewport", m });
    }
    if (!/Malcolm Joaquin/i.test(m.name) || !/Cuady/i.test(m.name)) {
      report.fails.push({ vp: vp.id, where: "hero-name", m });
    }
    // Intro must NOT show the old operations tagline — CTA only
    const tagline = await page.evaluate(() => {
      const body = document.querySelector(".chapter-intro .chapter-body");
      return body ? body.textContent.trim() : "";
    });
    if (/manual operations/i.test(tagline) || /five layers from messy/i.test(tagline)) {
      report.fails.push({ vp: vp.id, where: "intro-tagline-still-present", tagline });
    }
    if (tagline.length > 0) {
      report.fails.push({ vp: vp.id, where: "intro-body-should-be-empty", tagline });
    }
    const hasCta = await page.evaluate(
      () => !!document.querySelector(".chapter-intro .chapter-cta a[href='#projects']")
    );
    if (!hasCta) report.fails.push({ vp: vp.id, where: "intro-cta-missing" });
    const ctaInView = await page.evaluate(() => {
      const cta = document.querySelector(".chapter-intro .chapter-cta");
      if (!cta) return false;
      const r = cta.getBoundingClientRect();
      const visible = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      return visible > 20;
    });
    if (!ctaInView) report.fails.push({ vp: vp.id, where: "intro-cta-clipped" });
    // Tagline must not appear anywhere in the pinned hero viewport text
    const heroText = await page.evaluate(() => {
      const pin = document.querySelector(".hero-sticky");
      return (pin?.innerText || "").replace(/\s+/g, " ");
    });
    if (/manual operations/i.test(heroText) || /five layers from messy/i.test(heroText)) {
      report.fails.push({ vp: vp.id, where: "intro-tagline-in-viewport-text" });
    }
    // Process tower must be labeled and in the hero viewport
    const towerOk = await page.evaluate(() => {
      const tower = document.querySelector(".process-tower");
      const labels = [...document.querySelectorAll(".process-plate__label")].map((e) =>
        e.textContent.trim()
      );
      const r = tower?.getBoundingClientRect();
      const visible = r && r.width > 40 && r.bottom > 40 && r.top < innerHeight;
      return {
        visible: Boolean(visible),
        labels,
        ok: visible && labels.join(",") === "Analyze,Design,Build,Solve,Deliver",
      };
    });
    if (!towerOk.ok) report.fails.push({ vp: vp.id, where: "process-tower", towerOk });
    if (!m.portraitOk || !m.introVisible) {
      report.fails.push({ vp: vp.id, where: "hero-portrait", m });
    }
    // At rest must show graduation, not barong
    if (parseFloat(m.gradOp) < 0.7 || parseFloat(m.barongOp) > 0.3) {
      report.fails.push({ vp: vp.id, where: "portrait-wrong-shot", m });
    }
    if (m.pressed === "true" || !/^Grad/i.test(m.hint || "")) {
      report.fails.push({ vp: vp.id, where: "portrait-hint-mismatch", m });
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
