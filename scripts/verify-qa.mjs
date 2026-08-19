/**
 * Full-experience QA seam (TDD):
 * 1) Experience must open at Step 01 — not stuck at 10/10 (poisoned ST start)
 * 2) Career progress must advance while scrolling the sticky track
 * 3) Hero GSAP scrub must move stack + chapter opacity
 * 4) No localhost 404s for app assets (manifest included)
 * 5) Walkthrough screenshots written to scripts/qa-output/
 *
 * Usage: PORTFOLIO_URL=http://localhost:4173/ node scripts/verify-qa.mjs
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

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function shot(page, name) {
  mkdirSync(OUT, { recursive: true });
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  return path;
}

async function main() {
  assert(CHROME, "Chrome not found");
  mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);

  const localFails = [];
  page.on("response", (r) => {
    const u = r.url();
    if (!u.startsWith(URL.replace(/\/$/, "")) && !u.includes("localhost:5173") && !u.includes("localhost:4173")) {
      return;
    }
    if (r.status() === 404) localFails.push(`404 ${u}`);
  });

  const res = await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
  assert(res?.status() === 200, `HTTP ${res?.status()}`);
  // Career mounts after pin layout — wait past remount window
  await new Promise((r) => setTimeout(r, 2400));

  await shot(page, "01-hero-top");

  // ── Hero scrub live ──
  const heroA = await page.evaluate(() => {
    const hero = document.querySelector("[data-hero='bento']");
    return {
      step: Number(hero?.dataset?.step ?? -9),
      motion: hero?.dataset?.motion ?? null,
      name: document.querySelector(".hero-display")?.innerText?.replace(/\s+/g, " ").trim() || "",
      labels: [...document.querySelectorAll(".hero-station")].length,
      p: Number(hero?.dataset?.p ?? 0),
    };
  });
  await page.evaluate(() => {
    const s = document.querySelector(".pin-spacer");
    if (!s) return;
    const room = Math.max(1, s.offsetHeight - innerHeight);
    scrollTo({ top: room * 0.5, behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 700));
  const heroB = await page.evaluate(() => {
    const hero = document.querySelector("[data-hero='bento']");
    return {
      p: Number(hero?.dataset?.p ?? 0),
      name: document.querySelector(".hero-display")?.innerText?.replace(/\s+/g, " ").trim() || "",
    };
  });
  await shot(page, "02-hero-mid");
  assert(/Building systems/i.test(heroA.name), `hero headline missing: ${heroA.name}`);
  assert(heroA.labels === 0, `stations still present: ${heroA.labels}`);
  if (heroA.motion === "pin") {
    assert(heroB.p > heroA.p, `hero pin static ${heroA.p}→${heroB.p}`);
  }
  assert(/Building systems/i.test(heroB.name), "headline vanished mid-hero");

  // ── Experience entry: MUST be Step 01, not 10/10 ──
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => {
    const track = document.querySelector(".xp-track");
    const top = track.getBoundingClientRect().top + window.scrollY;
    scrollTo({ top: top + 24, behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 900));
  await shot(page, "03-experience-start");

  const xpStart = await page.evaluate(() => {
    const sticky = document.querySelector(".xp-sticky");
    const track = document.querySelector(".xp-track");
    const counter = document.querySelector(".xp-counter")?.textContent?.trim() || "";
    const cards = [...document.querySelectorAll(".xp-card")];
    const on = cards.find((c) => parseFloat(getComputedStyle(c).opacity) > 0.5);
    const step = on?.querySelector("p.font-mono")?.textContent?.trim() || "";
    const pinEnd = [...document.querySelectorAll(".pin-spacer")].reduce(
      (m, s) => Math.max(m, s.offsetTop + s.offsetHeight),
      0
    );
    const trackTop = Math.round(track.getBoundingClientRect().top + window.scrollY);
    const start = Number(sticky?.dataset.start || 0);
    const end = Number(sticky?.dataset.end || 0);
    const progress = parseFloat(sticky?.dataset.progress || "1");
    return { counter, step, start, end, progress, trackTop, pinEnd, scrollY: Math.round(scrollY) };
  });

  assert(xpStart.trackTop > 800, `experience too high trackTop=${xpStart.trackTop}`);
  assert(
    Math.abs(xpStart.start - xpStart.trackTop) < 160,
    `poisoned career start=${xpStart.start} trackTop=${xpStart.trackTop} pinEnd=${xpStart.pinEnd}`
  );
  assert(xpStart.progress < 0.2, `Experience stuck near end on entry: progress=${xpStart.progress}`);
  assert(/01\s*\/\s*10/i.test(xpStart.counter), `counter not 01/10: "${xpStart.counter}"`);
  assert(/STEP 01/i.test(xpStart.step), `card not Step 01: "${xpStart.step}"`);

  // ── Career advances ──
  await page.evaluate(() => {
    const track = document.querySelector(".xp-track");
    const top = track.getBoundingClientRect().top + window.scrollY;
    const room = Math.max(1, track.offsetHeight - innerHeight);
    scrollTo({ top: top + room * 0.45, behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 900));
  await shot(page, "04-experience-mid");
  const xpMid = await page.evaluate(() => ({
    counter: document.querySelector(".xp-counter")?.textContent?.trim(),
    progress: parseFloat(document.querySelector(".xp-sticky")?.dataset.progress || "0"),
    step:
      [...document.querySelectorAll(".xp-card")]
        .find((c) => parseFloat(getComputedStyle(c).opacity) > 0.5)
        ?.querySelector("p.font-mono")
        ?.textContent?.trim() || "",
  }));
  assert(xpMid.progress > 0.3, `career did not advance: ${xpMid.progress}`);
  assert(!/01\s*\/\s*10/i.test(xpMid.counter), `career still on 01 at mid: ${xpMid.counter}`);

  // ── Manifest (local) ──
  const manifestOk = await page.evaluate(async () => {
    const link = document.querySelector('link[rel="manifest"]');
    if (!link) return { ok: false, reason: "no-link" };
    const r = await fetch(link.href);
    if (!r.ok) return { ok: false, reason: `http-${r.status}` };
    const text = await r.text();
    try {
      const j = JSON.parse(text);
      return { ok: Boolean(j.name), name: j.name };
    } catch {
      return { ok: false, reason: "json-parse", head: text.slice(0, 40) };
    }
  });
  assert(manifestOk.ok, `manifest broken: ${JSON.stringify(manifestOk)}`);

  // Localhost 404s only (third-party 503 from github-readme-stats is out of scope)
  assert(localFails.length === 0, `local 404s: ${localFails.join("; ")}`);

  // Mobile smoke
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1600));
  await page.evaluate(() => scrollTo({ top: 400, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 500));
  await shot(page, "05-mobile-hero");
  const mobileOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth + 2
  );
  assert(!mobileOverflow, "mobile horizontal overflow");

  const report = {
    ok: true,
    heroA,
    heroB,
    xpStart,
    xpMid,
    manifestOk,
    shots: ["01-hero-top", "02-hero-mid", "03-experience-start", "04-experience-mid", "05-mobile-hero"],
  };
  writeFileSync(join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log("\nVERIFY QA PASS");
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error("\nVERIFY QA FAIL:", e.message);
  process.exitCode = 1;
});
