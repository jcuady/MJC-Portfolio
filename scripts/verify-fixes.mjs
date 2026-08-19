/**
 * newfixes.md seams (TDD):
 * - Desktop profile aligns with left stack and recruiter
 * - One visible MJC mark in the navbar
 * - Four real case studies
 * - Project Management + Product & Delivery + Agile delivery
 * - Transform columns do not overlap
 * - Mobile: proof below portrait
 * - No overflow-x at orientation viewports
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
const OUT = join(process.cwd(), "scripts", "out", "fixes-qa");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function desktopSeams(page) {
  return page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, w: r.width, h: r.height };
    };
    const intro = box(".hero-intro");
    const proof = box(".hero-proof-card");
    const profile = box(".profile-card");
    const recruiter = box(".recruiter-card");
    const transform = box(".transform-card");
    const logos = [...document.querySelectorAll("header img.nav-logo")].filter((img) => {
      const cs = getComputedStyle(img);
      return cs.display !== "none" && cs.visibility !== "hidden" && Number(cs.opacity) > 0.2;
    });
    const work = [...document.querySelectorAll(".work-card__item")].map((el) =>
      (el.textContent || "").replace(/\s+/g, " ").trim()
    );
    const roles = (document.querySelector(".profile-roles")?.innerText || "").replace(/\s+/g, " ");
    const heroText = document.querySelector("[data-hero='bento']")?.innerText || "";
    const pillars = [...document.querySelectorAll(".transform-card li")].map((el) => {
      const r = el.getBoundingClientRect();
      return { t: r.top, b: r.bottom, l: r.left, r: r.right, text: el.textContent.trim() };
    });
    let overlap = false;
    for (let i = 0; i < pillars.length; i += 1) {
      for (let j = i + 1; j < pillars.length; j += 1) {
        const a = pillars[i];
        const b = pillars[j];
        const hit = a.l < b.r - 2 && a.r > b.l + 2 && a.t < b.b - 2 && a.b > b.t + 2;
        if (hit) overlap = true;
      }
    }
    const portrait = document.querySelector(".profile-card__shot img");
    const card = document.querySelector(".profile-card");
    const pr = portrait?.getBoundingClientRect();
    const cr = card?.getBoundingClientRect();
    const portraitShare = cr && pr && cr.height ? pr.height / cr.height : 0;
    return {
      intro,
      proof,
      profile,
      recruiter,
      transform,
      visibleNavLogos: logos.length,
      workCount: work.length,
      workJoined: work.join(" | "),
      hasPm: /Project Management/i.test(roles),
      hasDelivery: /Product & Delivery/i.test(heroText),
      hasAgile: /Agile delivery/i.test(heroText),
      transformOverlap: overlap,
      pillarCount: pillars.length,
      portraitShare,
      overflowX: document.documentElement.scrollWidth > innerWidth + 2,
      alignTop: intro && profile ? Math.abs(intro.top - profile.top) : 999,
      alignBottom: recruiter && profile ? Math.abs(recruiter.bottom - profile.bottom) : 999,
      workBox: box(".work-card"),
      stackBox: box(".stack-card"),
      credsBox: box(".system-card"),
      uxBox: box(".ux-card"),
      slack: ["stack-card", "system-card", "ux-card", "work-card"].reduce((acc, cls) => {
        const el = document.querySelector(`.${cls}`);
        if (!el) {
          acc[cls] = 999;
          return acc;
        }
        const r = el.getBoundingClientRect();
        const kids = [...el.children].filter((c) => {
          const cs = getComputedStyle(c);
          return cs.display !== "none" && c.getBoundingClientRect().height > 2;
        });
        const last = kids[kids.length - 1]?.getBoundingClientRect();
        acc[cls] = last ? r.bottom - last.bottom : 999;
        return acc;
      }, {}),
      certCount: document.querySelectorAll(".system-card__list li, .system-card__featured").length,
      stackHasFrontend: /Frontend/i.test(document.querySelector(".stack-card")?.innerText || ""),
    };
  });
}

async function mobileSeams(page) {
  return page.evaluate(() => {
    const box = (sel) => document.querySelector(sel)?.getBoundingClientRect() || null;
    const intro = box(".hero-intro");
    const portrait = box(".profile-card");
    const proof = box(".hero-proof-card");
    const cta = box(".hero-cta");
    const hook = box(".hero-hook");
    const brand = box(".nav-bar__brand");
    const themeBtnEl = document.querySelector(".nav-bar__actions .nav-icon-btn:not(.nav-bar__menu)");
    const menuBtnEl = document.querySelector(".nav-bar__menu");
    const glyphBox = (el) =>
      (el?.querySelector(".nav-burger, svg") || el)?.getBoundingClientRect() || null;
    const themeBtn = themeBtnEl?.getBoundingClientRect();
    const menuBtn = menuBtnEl?.getBoundingClientRect();
    const themeGlyph = glyphBox(themeBtnEl);
    const menuGlyph = glyphBox(menuBtnEl);
    const mid = (r) => (r ? (r.top + r.bottom) / 2 : null);
    const ctas = [...document.querySelectorAll(".hero-cta a")].map((el) => {
      const r = el.getBoundingClientRect();
      return { t: r.top, b: r.bottom, l: r.left, r: r.right, w: r.width, h: r.height };
    });
    let ctaOverlap = false;
    for (let i = 0; i < ctas.length; i += 1) {
      for (let j = i + 1; j < ctas.length; j += 1) {
        const a = ctas[i];
        const b = ctas[j];
        if (a.l < b.r - 2 && a.r > b.l + 2 && a.t < b.b - 2 && a.b > b.t + 2) ctaOverlap = true;
      }
    }
    const hookInside =
      Boolean(intro && hook) && hook.left >= intro.left - 1 && hook.right <= intro.right + 1;
    const ctasInside = ctas.every((r) => intro && r.l >= intro.left - 1 && r.r <= intro.right + 1);
    return {
      overflowX: document.documentElement.scrollWidth > innerWidth + 2,
      introBeforePortrait: Boolean(intro && portrait && intro.top <= portrait.top + 8),
      proofAfterPortrait: Boolean(proof && portrait && proof.top >= portrait.top - 2),
      ctaBeforePortrait: Boolean(cta && portrait && cta.bottom <= portrait.top + 12),
      hookInside,
      hookRight: hook ? Math.round(hook.right) : null,
      introRight: intro ? Math.round(intro.right) : null,
      navDeltaTheme: brand && themeBtn ? Math.abs(mid(brand) - mid(themeBtn)) : 99,
      navDeltaMenu: brand && menuBtn ? Math.abs(mid(brand) - mid(menuBtn)) : 99,
      navDeltaPair: themeBtn && menuBtn ? Math.abs(mid(themeBtn) - mid(menuBtn)) : 99,
      glyphDelta: themeGlyph && menuGlyph ? Math.abs(mid(themeGlyph) - mid(menuGlyph)) : 99,
      menuVisible: Boolean(menuBtn && menuBtn.width > 8),
      ctaOverlap,
      ctasInside,
      ctaMinH: ctas.length ? Math.min(...ctas.map((t) => t.h)) : 0,
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
  const fails = [];

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 900));
  const desk = await desktopSeams(page);
  await page.screenshot({ path: join(OUT, "desk-1440.png"), fullPage: false });

  if (desk.visibleNavLogos !== 1) fails.push(`nav logos visible=${desk.visibleNavLogos}`);
  if (desk.workCount !== 4) fails.push(`selected work count ${desk.workCount}`);
  for (const name of ["Kadokohi Coffee", "Offgrid Lifestyle", "MGC Architecture", "Hakum Auto Care"]) {
    if (!desk.workJoined.includes(name)) fails.push(`missing case ${name}`);
  }
  if (!desk.hasPm) fails.push("missing Project Management pill");
  if (!desk.hasDelivery) fails.push("missing Product & Delivery proof");
  if (!desk.hasAgile) fails.push("missing Agile delivery highlight");
  if (desk.transformOverlap) fails.push("transform text overlap");
  if (desk.overflowX) fails.push("desktop overflow-x");
  if (desk.alignTop > 20) fails.push(`profile/intro top misaligned ${desk.alignTop}`);
  if (desk.alignBottom > 28) fails.push(`profile/recruiter bottom misaligned ${desk.alignBottom}`);
  if (desk.portraitShare < 0.55) fails.push(`portrait too small share=${desk.portraitShare.toFixed(2)}`);
  if (!desk.stackHasFrontend) fails.push("stack missing Frontend group");
  if (desk.certCount < 4) fails.push(`creds underfilled count=${desk.certCount}`);
  if (desk.workBox && desk.stackBox && Math.abs(desk.workBox.top - desk.stackBox.top) > 8) {
    fails.push("work/stack top misaligned");
  }
  if (desk.workBox && desk.uxBox && Math.abs(desk.workBox.bottom - desk.uxBox.bottom) > 12) {
    fails.push(`work/ux bottom gap ${Math.abs(desk.workBox.bottom - desk.uxBox.bottom)}`);
  }
  for (const cls of ["stack-card", "system-card", "ux-card"]) {
    if ((desk.slack?.[cls] ?? 999) > 72) fails.push(`${cls} empty slack ${desk.slack[cls].toFixed(0)}`);
  }

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 700));
  const mob = await mobileSeams(page);
  await page.screenshot({ path: join(OUT, "mob-390.png"), fullPage: false });
  if (mob.overflowX) fails.push("mobile overflow-x");
  if (!mob.introBeforePortrait) fails.push("mobile intro after portrait");
  if (!mob.ctaBeforePortrait) fails.push("mobile CTA after portrait");
  if (!mob.proofAfterPortrait) fails.push("mobile proof not after portrait");
  if (!mob.hookInside) fails.push(`hero hook clipped r=${mob.hookRight} intro=${mob.introRight}`);
  if (!mob.ctasInside) fails.push("hero CTAs overflow intro card");
  if (mob.ctaOverlap) fails.push("hero CTAs overlap");
  if (mob.ctaMinH < 44) fails.push(`hero CTA too short ${mob.ctaMinH}`);
  if (!mob.menuVisible) fails.push("hamburger missing");
  if (mob.navDeltaTheme > 3) fails.push(`theme toggle not centered with logo ${mob.navDeltaTheme}`);
  if (mob.navDeltaMenu > 3) fails.push(`hamburger not centered with logo ${mob.navDeltaMenu}`);
  if (mob.navDeltaPair > 2) fails.push(`hamburger/theme misaligned ${mob.navDeltaPair}`);
  if (mob.glyphDelta > 2) fails.push(`hamburger glyph not level with theme ${mob.glyphDelta}`);

  await page.click(".nav-bar__menu");
  await new Promise((r) => setTimeout(r, 400));
  const sheet = await page.evaluate(() => {
    const sheetEl = document.querySelector("#mobile-nav-sheet");
    const links = [...document.querySelectorAll("#mobile-nav-sheet a")];
    const menu = document.querySelector(".nav-bar__menu")?.getBoundingClientRect();
    const brand = document.querySelector(".nav-bar__brand")?.getBoundingClientRect();
    const mid = (r) => (r.top + r.bottom) / 2;
    return {
      open: Boolean(sheetEl),
      linkCount: links.length,
      overflowX: document.documentElement.scrollWidth > innerWidth + 2,
      menuMid: menu && brand ? Math.abs(mid(menu) - mid(brand)) : 99,
    };
  });
  await page.screenshot({ path: join(OUT, "mob-390-menu.png"), fullPage: false });
  if (!sheet.open) fails.push("mobile sheet did not open");
  if (sheet.linkCount < 5) fails.push(`sheet links ${sheet.linkCount}`);
  if (sheet.overflowX) fails.push("menu-open overflow-x");
  if (sheet.menuMid > 3) fails.push(`open-menu button misaligned ${sheet.menuMid}`);
  await page.click(".nav-bar__menu");
  await new Promise((r) => setTimeout(r, 250));

  await page.setViewport({ width: 360, height: 740, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 500));
  const mob360 = await mobileSeams(page);
  await page.screenshot({ path: join(OUT, "mob-360.png"), fullPage: false });
  if (mob360.overflowX) fails.push("360 overflow-x");
  if (!mob360.hookInside) fails.push("360 hook clipped");
  if (mob360.navDeltaMenu > 3) fails.push(`360 hamburger misaligned ${mob360.navDeltaMenu}`);

  for (const vp of [
    { id: "land", width: 844, height: 390 },
    { id: "tab", width: 768, height: 1024 },
    { id: "wide", width: 1920, height: 1080 },
  ]) {
    await page.setViewport(vp);
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
    await new Promise((r) => setTimeout(r, 400));
    const ox = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
    await page.screenshot({ path: join(OUT, `${vp.id}.png`), fullPage: false });
    if (ox) fails.push(`overflow-x ${vp.id}`);
    if (vp.id === "tab") {
      const tabFill = await page.evaluate(() => {
        const work = document.querySelector(".work-card")?.getBoundingClientRect();
        const stack = document.querySelector(".stack-card")?.getBoundingClientRect();
        const ux = document.querySelector(".ux-card")?.getBoundingClientRect();
        return {
          top: work && stack ? Math.abs(work.top - stack.top) : 999,
          bottom: work && ux ? Math.abs(work.bottom - ux.bottom) : 999,
        };
      });
      if (tabFill.top > 8) fails.push(`tab work/stack top ${tabFill.top}`);
      if (tabFill.bottom > 16) fails.push(`tab work/ux bottom ${tabFill.bottom}`);
    }
  }

  writeFileSync(join(OUT, "report.json"), JSON.stringify({ fails, desk, mob, mob360 }, null, 2));
  console.log(JSON.stringify({ failCount: fails.length, fails, out: OUT }, null, 2));
  await browser.close();
  assert(fails.length === 0, fails[0]);
  console.log("\nVERIFY FIXES PASS");
}

main().catch((e) => {
  console.error("\nVERIFY FIXES FAIL:", e.message);
  process.exitCode = 1;
});
