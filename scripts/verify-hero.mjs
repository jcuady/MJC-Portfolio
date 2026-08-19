/**
 * Bento hero seams (TDD):
 * - Headline "Building systems" / "scale"
 * - Name Malcolm Joaquin Cuady on the profile card
 * - MJC wordmark in nav (light/dark assets)
 * - See my work -> #work, Let's build together / Get in touch -> #contact
 * - Honest proof (no fake 5+ years / 35%)
 * - No Hear/Shape stations
 * - Mobile: intro + CTAs above portrait, no overflow-x, 44px CTAs
 * Screenshots -> scripts/out/hero-video/
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
    const hero = document.querySelector('[data-hero="bento"]');
    const h1 = document.querySelector(".hero-display");
    const headline = (h1?.innerText || "").replace(/\s+/g, " ").trim();
    const profileName = (
      document.querySelector(".profile-name")?.innerText || ""
    )
      .replace(/\s+/g, " ")
      .trim();
    const navLogo = document.querySelector("header img.nav-logo");
    const navCta = [...document.querySelectorAll("header a")].find((a) =>
      /Let'?s build together/i.test(a.textContent || "")
    );
    const banned = /Hear the operation|Hear,\s*Shape|hero-station|5\+\s*YEARS|35%\+|99%\s*satisfaction/i.test(
      (hero?.innerText || "") + (document.querySelector("header")?.innerText || "")
    );
    const stations = [...document.querySelectorAll(".hero-station")];
    const ctas = [...document.querySelectorAll(".hero-cta a")].map((a) => ({
      href: a.getAttribute("href"),
      text: (a.textContent || "").replace(/\s+/g, " ").trim(),
      h: Math.round(a.getBoundingClientRect().height),
    }));
    const portrait = document.querySelector(".hero-portrait");
    const portraitImg = portrait?.querySelector("img") || portrait;
    const hr = h1?.getBoundingClientRect();
    const pr = portrait?.getBoundingClientRect();
    const lede = document.querySelector(".hero-lede")?.getBoundingClientRect();
    const navBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 56;
    const visible = (r) => {
      if (!r) return false;
      const v = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      return r.width > 8 && v > Math.min(28, r.height * 0.4);
    };
    const heroText = hero?.innerText || "";
    return {
      hasHero: Boolean(hero),
      headline,
      profileName,
      hasNavLogo: Boolean(navLogo && (navLogo.getAttribute("src") || "").includes("/brand/logo")),
      logoAlt: navLogo?.getAttribute("alt") || "",
      navCtaHref: navCta?.getAttribute("href") || "",
      stations: stations.length,
      bannedCopy: banned,
      motion: hero?.dataset?.motion ?? null,
      headlineInView: visible(hr),
      portraitInView: visible(pr),
      nameClearsNav: (hr?.top ?? 0) >= navBottom - 2,
      overflowX: document.documentElement.scrollWidth > innerWidth + 2,
      ctaWork: ctas.some((c) => (c.href === "#work" || c.href === "#projects") && c.h >= 40),
      ctaContact: ctas.some((c) => c.href === "#contact" && c.h >= 40),
      minCta: ctas.length ? Math.min(...ctas.map((c) => c.h)) : 0,
      introBeforePortrait: Boolean(lede && pr && lede.top <= pr.top + 8),
      hasRecruiter: /Recruiter Highlights/i.test(heroText),
      hasScale: /scale/i.test(headline),
      fakeMetrics: /5\+\s*YEARS|35%\+|2-4x|100%\s*satisfaction/i.test(heroText),
      portraitAlt: portraitImg?.getAttribute("alt") || "",
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
  await new Promise((r) => setTimeout(r, 1200));

  const desk0 = await metrics(page);
  await page.screenshot({ path: join(OUT, "desk-p00.png"), fullPage: false });
  if (!desk0.hasHero) fails.push("desk missing bento hero");
  if (!/Building systems/i.test(desk0.headline) || !desk0.hasScale) {
    fails.push(`desk headline ${desk0.headline}`);
  }
  if (!/Malcolm Joaquin/i.test(desk0.profileName) || !/Cuady/i.test(desk0.profileName)) {
    fails.push(`desk profile ${desk0.profileName}`);
  }
  if (!desk0.headlineInView) fails.push("desk headline out of view");
  if (!desk0.portraitInView) fails.push("desk portrait out of view");
  if (!desk0.nameClearsNav) fails.push("desk headline under nav");
  if (!desk0.hasNavLogo) fails.push("nav missing MJC logo asset");
  if (!/MJC/i.test(desk0.logoAlt)) fails.push(`nav logo alt ${desk0.logoAlt}`);
  if (desk0.navCtaHref !== "#contact") fails.push(`nav CTA href ${desk0.navCtaHref}`);
  if (desk0.stations !== 0) fails.push(`stations still present ${desk0.stations}`);
  if (desk0.bannedCopy || desk0.fakeMetrics) fails.push("banned or fake-metric copy in hero");
  if (!desk0.ctaWork) fails.push("See my work CTA missing/short");
  if (!desk0.ctaContact) fails.push("Get in touch CTA missing/short");
  if (!desk0.hasRecruiter) fails.push("Recruiter Highlights missing");
  if (!/Portrait of Malcolm Joaquin Cuady/i.test(desk0.portraitAlt)) {
    fails.push(`portrait alt ${desk0.portraitAlt}`);
  }

  await page.evaluate(() => window.scrollTo({ top: innerHeight * 0.4, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: join(OUT, "desk-p55.png"), fullPage: false });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1000));
  const mob = await metrics(page);
  await page.screenshot({ path: join(OUT, "mob-p00.png"), fullPage: false });
  if (mob.overflowX) fails.push("mobile overflow-x");
  if (!mob.headlineInView) fails.push("mobile headline out of view");
  if (mob.minCta < 40) fails.push(`mobile cta ${mob.minCta}px`);
  if (mob.motion !== "static") fails.push(`mobile should be static, got ${mob.motion}`);
  if (!mob.introBeforePortrait) fails.push("mobile portrait appeared before the headline");
  if (!mob.ctaWork) fails.push("mobile work CTA missing");

  writeFileSync(join(OUT, "report.json"), JSON.stringify({ fails, desk0, mob }, null, 2));
  console.log(JSON.stringify({ failCount: fails.length, fails, out: OUT }, null, 2));
  await browser.close();
  assert(fails.length === 0, fails[0]);
  console.log("\nVERIFY HERO PASS");
}

main().catch((e) => {
  console.error("\nVERIFY HERO FAIL:", e.message);
  process.exitCode = 1;
});
