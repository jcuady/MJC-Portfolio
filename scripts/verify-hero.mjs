/**
 * Hero press seams (TDD / principal QA):
 * - Full name + face in view
 * - No MJC initials in hero or nav mark
 * - No Hear/Shape/Wire/Cut/Live stations
 * - Desktop pin advances data-p
 * - Mobile: no overflow-x, 44px CTAs, portrait first
 * Screenshots → scripts/out/hero-video/
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

async function metrics(page) {
  return page.evaluate(() => {
    const hero = document.querySelector('[data-hero="press"]');
    const h1 = document.querySelector(".hero-display");
    const name = (h1?.innerText || "").replace(/\s+/g, " ").trim();
    const navMark = document.querySelector(".nav-wordmark")?.textContent?.trim() || "";
    const logoSvg = document.querySelector("header svg text");
    const grad = document.querySelector(".hero-portrait img[data-shot='grad']");
    const banned = /Hear the operation|Hear,\s*Shape|hero-station/i.test(
      document.querySelector(".hero-sticky")?.innerText || ""
    );
    const stations = [...document.querySelectorAll(".hero-station")];
    const ctas = [...document.querySelectorAll(".hero-cta a")].map((a) => ({
      href: a.getAttribute("href"),
      h: Math.round(a.getBoundingClientRect().height),
    }));
    const hr = h1?.getBoundingClientRect();
    const pr = document.querySelector(".hero-portrait")?.getBoundingClientRect();
    const navBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 56;
    const visible = (r) => {
      if (!r) return false;
      const v = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      return r.width > 8 && v > Math.min(28, r.height * 0.4);
    };
    return {
      hasHero: Boolean(hero),
      name,
      navMark,
      hasMjcSvg: Boolean(logoSvg),
      stations: stations.length,
      bannedCopy: banned,
      p: hero?.dataset?.p ?? null,
      step: hero?.dataset?.step ?? null,
      motion: hero?.dataset?.motion ?? null,
      nameInView: visible(hr),
      portraitInView: visible(pr),
      nameClearsNav: (hr?.top ?? 0) >= navBottom - 2,
      gradOp: grad ? getComputedStyle(grad).opacity : null,
      overflowX: document.documentElement.scrollWidth > innerWidth + 2,
      ctaProjects: ctas.some((c) => c.href === "#projects" && c.h >= 40),
      minCta: ctas.length ? Math.min(...ctas.map((c) => c.h)) : 0,
    };
  });
}

async function scrollPin(page, progress) {
  await page.evaluate((progress) => {
    const s = document.querySelectorAll(".pin-spacer")[0];
    if (!s) {
      window.scrollTo({ top: innerHeight * progress, behavior: "instant" });
      return;
    }
    const room = Math.max(1, s.offsetHeight - innerHeight);
    window.scrollTo({ top: s.offsetTop + room * progress, behavior: "instant" });
  }, progress);
  await new Promise((r) => setTimeout(r, 420));
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
  const fails = [];

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1200));

  const desk0 = await metrics(page);
  await page.screenshot({ path: join(OUT, "desk-p00.png"), fullPage: false });
  if (!desk0.hasHero) fails.push("desk missing press hero");
  if (!/Malcolm Joaquin/i.test(desk0.name) || !/Cuady/i.test(desk0.name)) fails.push(`desk name ${desk0.name}`);
  if (!desk0.nameInView) fails.push("desk name out of view");
  if (!desk0.portraitInView) fails.push("desk portrait out of view");
  if (!desk0.nameClearsNav) fails.push("desk name under nav");
  if (desk0.hasMjcSvg) fails.push("nav still has MJC svg wordmark");
  if (!/Malcolm Cuady/i.test(desk0.navMark)) fails.push(`nav wordmark ${desk0.navMark}`);
  if (desk0.stations !== 0) fails.push(`stations still present ${desk0.stations}`);
  if (desk0.bannedCopy) fails.push("banned Hear/Shape copy still in hero");
  if (parseFloat(desk0.gradOp) < 0.7) fails.push("grad shot not default");
  if (!desk0.ctaProjects) fails.push("projects CTA missing/short");

  await scrollPin(page, 0.55);
  const deskMid = await metrics(page);
  await page.screenshot({ path: join(OUT, "desk-p55.png"), fullPage: false });
  if (desk0.motion === "pin") {
    const a = Number(desk0.p);
    const b = Number(deskMid.p);
    if (!(b > a)) fails.push(`desktop pin did not advance ${a}→${b}`);
  }
  if (!/Malcolm Joaquin/i.test(deskMid.name)) fails.push("name vanished mid-pin");

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1000));
  const mob = await metrics(page);
  await page.screenshot({ path: join(OUT, "mob-p00.png"), fullPage: false });
  if (mob.overflowX) fails.push("mobile overflow-x");
  if (!mob.nameInView) fails.push("mobile name out of view");
  if (!mob.portraitInView) fails.push("mobile portrait out of view");
  if (mob.minCta < 40) fails.push(`mobile cta ${mob.minCta}px`);
  if (mob.motion !== "static") fails.push(`mobile should be static, got ${mob.motion}`);

  writeFileSync(join(OUT, "report.json"), JSON.stringify({ fails, desk0, deskMid, mob }, null, 2));
  console.log(JSON.stringify({ failCount: fails.length, fails, out: OUT }, null, 2));
  await browser.close();
  assert(fails.length === 0, fails[0]);
  console.log("\nVERIFY HERO PASS");
}

main().catch((e) => {
  console.error("\nVERIFY HERO FAIL:", e.message);
  process.exitCode = 1;
});
