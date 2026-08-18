/**
 * Asserts one exclusive story frame — catches multi-chapter bleach and
 * Statement→Experience bleed (the exact user screenshots).
 */
import puppeteer from "puppeteer-core";
import { existsSync } from "fs";

const CHROME = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => p && existsSync(p));

const URL = process.env.PORTFOLIO_URL || "http://localhost:5173/";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function frame(page) {
  return page.evaluate(() => {
    const isOn = (el, floor = 0.2) => {
      if (!el) return false;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") return false;
      if (parseFloat(cs.opacity) < floor) return false;
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      // Require meaningful intersection (not just 1px peek / offscreen math)
      const visibleH = Math.min(r.bottom, vh - 40) - Math.max(r.top, 40);
      return visibleH > 48 && r.width > 10;
    };

    const chapters = [...document.querySelectorAll(".chapter")].filter((el) => isOn(el, 0.45));
    const statementH2 = document.querySelector(".statement-pin h2");
    const statementCopy = document.querySelector(".st-copy");
    const xp = document.querySelector("#experience .section-title");

    const statementOn = isOn(statementH2, 0.25) || isOn(statementCopy, 0.25);
    const experienceOn = isOn(xp, 0.25);

    return {
      y: Math.round(scrollY),
      chapterCount: chapters.length,
      ids: chapters.map((c) => [...c.classList].find((x) => /^chapter-/.test(x) && x !== "chapter")),
      statementOn,
      experienceOn,
      bleed: statementOn && experienceOn,
      multi: chapters.length > 1,
    };
  });
}

async function scrollPin(page, spacerIndex, progress) {
  await page.evaluate(
    ({ spacerIndex, progress }) => {
      const spacers = [...document.querySelectorAll(".pin-spacer")];
      const s = spacers[spacerIndex];
      if (!s) {
        window.scrollTo({ top: document.documentElement.scrollHeight * progress, behavior: "instant" });
        return;
      }
      const room = Math.max(1, s.offsetHeight - innerHeight);
      window.scrollTo({ top: s.offsetTop + room * progress, behavior: "instant" });
    },
    { spacerIndex, progress }
  );
  await new Promise((r) => setTimeout(r, 500));
}

async function scrollExperience(page, progress) {
  await page.evaluate((progress) => {
    const track = document.querySelector(".xp-track");
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const room = Math.max(1, track.offsetHeight - innerHeight);
    window.scrollTo({ top: top + room * progress, behavior: "instant" });
  }, progress);
  await new Promise((r) => setTimeout(r, 550));
}

async function main() {
  assert(CHROME, "Chrome not found");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  const res = await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
  assert(res?.status() === 200, `HTTP ${res?.status()}`);
  await new Promise((r) => setTimeout(r, 1800));

  const fails = [];

  // Hero must paint real copy at top — catches collapsed text column / blank mint frame
  await page.evaluate(() => scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 400));
  const heroPaint = await page.evaluate(() => {
    const h1 = document.querySelector(".hero-display");
    const lede = document.querySelector(".hero-lede");
    if (!h1 || !lede) return { ok: false, reason: "missing" };
    const hs = getComputedStyle(h1);
    const hr = h1.getBoundingClientRect();
    const lr = lede.getBoundingClientRect();
    return {
      ok:
        parseFloat(hs.opacity) > 0.5 &&
        hs.visibility !== "hidden" &&
        hr.height > 28 &&
        hr.width > 40 &&
        lr.height > 80 &&
        /Malcolm/i.test(h1.textContent),
      copyH: Math.round(lr.height),
      lineH: Math.round(hr.height),
      opacity: hs.opacity,
      text: h1.textContent.trim().slice(0, 24),
    };
  });
  if (!heroPaint.ok) fails.push({ where: "hero-blank", ...heroPaint });

  // Mid-chapter dwells (avoid exact handoff ticks where scrub lag is mid-fade)
  for (const p of [0, 0.08, 0.2, 0.33, 0.47, 0.61, 0.75, 0.88, 0.97]) {
    await scrollPin(page, 0, p);
    const f = await frame(page);
    if (f.chapterCount > 1) fails.push({ where: "hero", ...f });
  }

  // Statement samples
  for (const p of [0.05, 0.4, 0.8]) {
    await scrollPin(page, 1, p);
    const f = await frame(page);
    if (f.multi) fails.push({ where: "statement-multi", ...f });
    if (f.bleed) fails.push({ where: "statement-bleed", ...f });
  }

  // Experience must never show Statement type; spine must show ALL steps (no clip)
  for (const p of [0.1, 0.45, 0.85]) {
    await scrollExperience(page, p);
    const f = await frame(page);
    if (f.bleed || (f.experienceOn && f.statementOn)) {
      fails.push({ where: "experience-bleed", ...f });
    }
    if (f.multi) fails.push({ where: "experience-chapters", ...f });
  }
  // Fresh land on Experience start — wait for career ST remount after layout
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2200));
  await scrollExperience(page, 0.04);
  await new Promise((r) => setTimeout(r, 400));
  const spine = await page.evaluate(() => {
    const sticky = document.querySelector(".xp-sticky");
    const nums = [...document.querySelectorAll(".xp-num")];
    const visible = nums.filter((el) => {
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      return r.height > 4 && r.top >= 40 && r.top < vh - 8 && r.bottom > 56;
    });
    const cards = [...document.querySelectorAll(".xp-card")];
    const on = cards.find((c) => parseFloat(getComputedStyle(c).opacity) > 0.5);
    const stepText = on?.querySelector("p.font-mono")?.textContent || "";
    const stuck = sticky && Math.abs(sticky.getBoundingClientRect().top) < 4;
    const progress = parseFloat(sticky?.dataset.progress || "1");
    return {
      numCount: nums.length,
      visibleNums: visible.length,
      stepText: stepText.trim(),
      stuck,
      progress,
      xpTop: sticky ? Math.round(sticky.getBoundingClientRect().top) : null,
      ok: nums.length >= 10 && visible.length === nums.length && stuck && progress < 0.2,
    };
  });
  if (!spine.ok) fails.push({ where: "xp-spine-clip", ...spine });
  // Step 01 should match latest role (resume order)
  if (spine.stepText && !/STEP 01/i.test(spine.stepText)) {
    fails.push({ where: "xp-order-not-latest-first", ...spine });
  }

  // At scroll 0, Experience must not be fixed over the hero
  await page.setViewport({ width: 1440, height: 900 });
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1600));
  await page.evaluate(() => scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 300));
  const topState = await page.evaluate(() => {
    const xp = document.querySelector("#experience");
    const hero = document.querySelector(".hero-pin");
    const cs = xp ? getComputedStyle(xp) : null;
    const xr = xp?.getBoundingClientRect();
    const hr = hero?.getBoundingClientRect();
    return {
      xpPos: cs?.position,
      xpTop: xr ? Math.round(xr.top) : null,
      heroTop: hr ? Math.round(hr.top) : null,
      xpCoversHero: Boolean(xr && hr && xr.top < 80 && hr.top < 80 && cs?.position === "fixed"),
    };
  });
  if (topState.xpCoversHero) fails.push({ where: "xp-covers-hero", ...topState });

  // Mobile viewport pass — chapters exclusive + career cards not clipped
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1600));
  for (const p of [0, 0.3, 0.65]) {
    await scrollPin(page, 0, p);
    const f = await frame(page);
    if (f.multi) fails.push({ where: "mobile-hero", ...f });
  }
  const mobileXp = await page.evaluate(() => {
    const el = document.querySelector("#experience");
    const cards = [...document.querySelectorAll(".xp-m-card")];
    if (!el || !cards.length) return { ok: false, reason: "missing" };
    el.scrollIntoView({ block: "start" });
    const h = el.getBoundingClientRect().height;
    const last = cards[cards.length - 1].getBoundingClientRect();
    // Stacked career must taller than one viewport and not stuck at 100svh clip
    return {
      ok: h > innerHeight * 1.15 && last.bottom > 40,
      height: Math.round(h),
      vh: innerHeight,
      lastBottom: Math.round(last.bottom),
      cardCount: cards.length,
    };
  });
  if (!mobileXp.ok) fails.push({ where: "mobile-xp-clip", ...mobileXp });

  // Landscape phone — exclusive chapters + no horizontal doc overflow
  await page.setViewport({ width: 844, height: 390 });
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1600));
  for (const p of [0, 0.33, 0.7]) {
    await scrollPin(page, 0, p);
    const f = await frame(page);
    if (f.multi) fails.push({ where: "landscape-hero", ...f });
  }
  const landscape = await page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const vw = innerWidth;
    return { overflowX: docW > vw + 2, docW, vw };
  });
  if (landscape.overflowX) fails.push({ where: "landscape-overflow-x", ...landscape });

  console.log(JSON.stringify({ failCount: fails.length, fails: fails.slice(0, 10) }, null, 2));
  await browser.close();
  assert(fails.length === 0, `OVERLAP: ${fails[0]?.where} chapters=${fails[0]?.ids} y=${fails[0]?.y}`);
  console.log("\nVERIFY OVERLAP PASS");
}

main().catch((e) => {
  console.error("\nVERIFY OVERLAP FAIL:", e.message);
  process.exitCode = 1;
});
