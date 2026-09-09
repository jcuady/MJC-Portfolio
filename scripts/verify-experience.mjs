/**
 * Experience bento + pin seams (TDD).
 * Usage: PORTFOLIO_URL=http://127.0.0.1:4173/ node scripts/verify-experience.mjs
 */
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "qa-output", "experience");
const CHROME = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => p && existsSync(p));
const URL = process.env.PORTFOLIO_URL || "http://127.0.0.1:4173/";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  assert(CHROME, "Chrome not found");
  mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  // Desktop pin story
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });

  const desk = await page.evaluate(() => {
    const track = document.querySelector(".xp-track");
    const sticky = document.querySelector(".xp-sticky");
    const cards = document.querySelectorAll(".xp-card");
    const rail = document.querySelector(".xp-rail");
    const snap = document.querySelector(".xp-snap");
    const impact = document.querySelector(".xp-impact");
    const overflowX = document.documentElement.scrollWidth > innerWidth + 2;
    const title = document.querySelector("#experience .section-title")?.textContent?.trim();
    return {
      title,
      track: Boolean(track),
      sticky: Boolean(sticky),
      cards: cards.length,
      rail: Boolean(rail),
      snap: Boolean(snap),
      impact: Boolean(impact),
      overflowX,
      firstRole: document.querySelector(".xp-card .xp-role-card__title")?.textContent?.trim() || "",
    };
  });

  assert(desk.title === "Experience", `title=${desk.title}`);
  assert(desk.track && desk.sticky, "missing track/sticky");
  assert(desk.cards === 12, `cards=${desk.cards}`);
  assert(desk.rail && desk.snap && desk.impact, "missing bento parts");
  assert(!desk.overflowX, "desktop horizontal overflow");
  assert(/Nexvision/i.test(desk.firstRole) || /Lead Full-Stack/i.test(desk.firstRole), "order not latest-first");

  // Scroll into career mid
  await page.evaluate(() => {
    const track = document.querySelector(".xp-track");
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + track.offsetHeight * 0.45);
  });
  await new Promise((r) => setTimeout(r, 700));

  const mid = await page.evaluate(() => ({
    progress: parseFloat(document.querySelector(".xp-sticky")?.dataset.progress || "0"),
    counter: document.querySelector(".xp-counter")?.textContent?.trim() || "",
    activeRail: document.querySelector(".xp-rail__item.is-active .xp-num")?.textContent?.trim() || "",
  }));
  assert(mid.progress > 0.25, `career progress=${mid.progress}`);
  assert(!/^01\s*\/\s*12$/i.test(mid.counter), `still on 01: ${mid.counter}`);

  await page.screenshot({ path: join(OUT, "desktop-mid.png") });
  console.log("PASS desktop experience pin");

  // Mobile
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto(URL + "#experience", { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.getElementById("experience")?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 400));

  const mobile = await page.evaluate(() => {
    const rail = document.querySelector(".xp-mobile-rail");
    const steps = document.querySelectorAll(".xp-mobile-step");
    const cards = document.querySelectorAll(".xp-m-card");
    const overflowX = document.documentElement.scrollWidth > innerWidth + 2;
    return {
      rail: Boolean(rail),
      steps: steps.length,
      cards: cards.length,
      overflowX,
    };
  });
  assert(mobile.rail && mobile.steps === 12, `mobile rail steps=${mobile.steps}`);
  assert(mobile.cards >= 12, `mobile cards=${mobile.cards}`);
  assert(!mobile.overflowX, "mobile horizontal overflow");

  // Tap step 03 — Beepa (Nexvision, Optrizo, Beepa)
  await page.click('.xp-mobile-step:nth-child(3)');
  await new Promise((r) => setTimeout(r, 200));
  const step3 = await page.evaluate(
    () => document.querySelector(".xp-mobile-stack .xp-role-card__title")?.textContent?.trim() || ""
  );
  assert(/Beepa|BPO|Freelance/i.test(step3), `step3 title=${step3}`);

  await page.screenshot({ path: join(OUT, "mobile-step3.png") });
  console.log("PASS mobile experience rail");

  // Wide
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  const wideOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth + 2
  );
  assert(!wideOverflow, "1920 overflow");
  console.log("PASS wide viewport");

  await browser.close();
  console.log("PASS verify-experience");
}

main().catch((err) => {
  console.error("FAIL", err.message);
  process.exit(1);
});
