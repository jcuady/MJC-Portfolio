/**
 * Responsive + orientation gate (skill matrix).
 * Overflow-x, touch 44px, body >= 16px, CTA/nav, landscape content.
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
const OUT = join(process.cwd(), "scripts", "out", "orientation-qa");

const VIEWPORTS = [
  { id: "375x667", width: 375, height: 667, dpr: 2, touch: true },
  { id: "393x852", width: 393, height: 852, dpr: 3, touch: true },
  { id: "430x932", width: 430, height: 932, dpr: 3, touch: true },
  { id: "667x375-land", width: 667, height: 375, dpr: 2, touch: true, land: true },
  { id: "768x1024", width: 768, height: 1024, dpr: 2, touch: true },
  { id: "1024x1366", width: 1024, height: 1366, dpr: 2, touch: true },
  { id: "1024x768-land", width: 1024, height: 768, dpr: 1, land: true },
  { id: "1280x800", width: 1280, height: 800, dpr: 1 },
  { id: "1440x900", width: 1440, height: 900, dpr: 1 },
  { id: "1920x1080", width: 1920, height: 1080, dpr: 1 },
];

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function audit(page) {
  return page.evaluate(() => {
    const overflowX = document.documentElement.scrollWidth > innerWidth + 2;
    const body = document.querySelector(".hero-hook");
    const bodyPx = body ? parseFloat(getComputedStyle(body).fontSize) : 0;
    const ctas = [...document.querySelectorAll(".hero-cta a, .nav-bar__cta, .nav-icon-btn, .nav-bar__menu")].filter(
      (el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 1 && r.height > 1;
      }
    );
    const touch = ctas.map((el) => {
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height, tag: el.className.slice(0, 40) };
    });
    const smallTouch = touch.filter((t) => t.w < 44 - 0.5 || t.h < 44 - 0.5);
    const nav = document.querySelector("header");
    const menu = document.querySelector(".nav-bar__menu");
    const links = document.querySelector(".nav-bar__links");
    const menuCs = menu ? getComputedStyle(menu) : null;
    const linksCs = links ? getComputedStyle(links) : null;
    const menuShown = Boolean(menu && menuCs.display !== "none" && menu.getBoundingClientRect().width > 8);
    const linksShown = Boolean(links && linksCs.display !== "none" && links.getBoundingClientRect().width > 8);
    const h1 = document.querySelector(".hero-display");
    const hr = h1?.getBoundingClientRect();
    const navBottom = nav?.getBoundingClientRect().bottom ?? 0;
    const h1Visible = Boolean(hr && hr.width > 8 && Math.min(hr.bottom, innerHeight) - Math.max(hr.top, 0) > 12);
    const cta = document.querySelector(".hero-cta a");
    const cr = cta?.getBoundingClientRect();
    const ctaVisible = Boolean(cr && cr.width > 8);
    const work = [...document.querySelectorAll(".work-card__item")].map((el) =>
      (el.textContent || "").replace(/\s+/g, " ").trim()
    );
    const hook = document.querySelector(".hero-hook")?.getBoundingClientRect();
    const intro = document.querySelector(".hero-intro")?.getBoundingClientRect();
    const hookInside = Boolean(
      hook && intro && hook.left >= intro.left - 2 && hook.right <= intro.right + 2
    );
    return {
      overflowX,
      docW: document.documentElement.scrollWidth,
      vw: innerWidth,
      vh: innerHeight,
      bodyPx,
      smallTouch,
      menuShown,
      linksShown,
      navOk: menuShown || linksShown,
      h1ClearsNav: !hr || hr.top >= navBottom - 2,
      h1Visible,
      ctaVisible,
      workCount: work.length,
      hookInside,
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
  const rows = [];
  const fails = [];

  for (const vp of VIEWPORTS) {
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr || 1,
      isMobile: Boolean(vp.touch),
      hasTouch: Boolean(vp.touch),
    });
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
    await new Promise((r) => setTimeout(r, 500));
    const m = await audit(page);
    await page.screenshot({ path: join(OUT, `${vp.id}.png`), fullPage: false });
    const verdict = [];
    if (m.overflowX) verdict.push("overflow-x");
    if (vp.touch && m.smallTouch.length) {
      verdict.push(`touch ${JSON.stringify(m.smallTouch)}`);
    }
    if (vp.width <= 430 && m.bodyPx < 16) verdict.push(`body ${m.bodyPx}px`);
    if (!m.navOk) verdict.push("nav missing");
    if (!m.h1ClearsNav) verdict.push("h1 under nav");
    if (!m.h1Visible) verdict.push("h1 not in view");
    if (!m.ctaVisible) verdict.push("cta missing");
    if (m.workCount !== 4) verdict.push(`work ${m.workCount}`);
    if (!m.hookInside) verdict.push("hook clip");
    if (vp.width < 768 && m.linksShown && !m.menuShown) {
      /* desktop links on phone is a fail */
      verdict.push("desktop nav on phone");
    }
    rows.push({
      vp: vp.id,
      overflowX: m.overflowX,
      bodyPx: m.bodyPx,
      menuShown: m.menuShown,
      linksShown: m.linksShown,
      h1Visible: m.h1Visible,
      verdict: verdict.length ? verdict.join("; ") : "PASS",
    });
    if (verdict.length) fails.push(`${vp.id}: ${verdict.join("; ")}`);
  }

  writeFileSync(join(OUT, "report.json"), JSON.stringify({ fails, rows }, null, 2));
  console.log(JSON.stringify({ failCount: fails.length, fails, rows, out: OUT }, null, 2));
  await browser.close();
  assert(fails.length === 0, fails[0]);
  console.log("\nVERIFY ORIENTATION PASS");
}

main().catch((e) => {
  console.error("\nVERIFY ORIENTATION FAIL:", e.message);
  process.exitCode = 1;
});
