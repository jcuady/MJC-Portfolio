/**
 * Mobile/desktop press: name + face in view, no overflow, no process stations.
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
const OUT = join(process.cwd(), "scripts", "out", "mobile-stack-qa");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function measure(page) {
  return page.evaluate(() => {
    const navBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 56;
    const h1 = document.querySelector(".hero-display")?.getBoundingClientRect();
    const portrait = document.querySelector(".hero-portrait")?.getBoundingClientRect();
    const labels = [...document.querySelectorAll(".hero-station")];
    const visible = (r) => {
      if (!r) return false;
      const v = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      return r.width > 8 && v > 20;
    };
    return {
      navBottom: Math.round(navBottom),
      h1Top: h1 ? Math.round(h1.top) : null,
      h1Clear: !h1 || h1.top >= navBottom - 2,
      nameInView: visible(h1),
      portraitInView: visible(portrait),
      stationCount: labels.length,
      overflowX: document.documentElement.scrollWidth > innerWidth + 2,
      name: document.querySelector(".hero-display")?.innerText?.replace(/\s+/g, " ").trim() || "",
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
  const report = { frames: [] };

  for (const vp of [
    { id: "desktop", width: 1440, height: 900 },
    { id: "mobile", width: 390, height: 844, deviceScaleFactor: 2 },
  ]) {
    await page.setViewport(vp);
    await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));
    const m = await measure(page);
    const shot = `${vp.id}-hero.png`;
    await page.screenshot({ path: join(OUT, shot), fullPage: false });
    report.frames.push(shot);
    report[vp.id] = m;
    if (!/Malcolm Joaquin/i.test(m.name)) fails.push({ where: "name", vp: vp.id, m });
    if (!m.h1Clear) fails.push({ where: "nav-bleed", vp: vp.id, m });
    if (!m.nameInView) fails.push({ where: "name-out", vp: vp.id, m });
    if (!m.portraitInView) fails.push({ where: "portrait-out", vp: vp.id, m });
    if (m.overflowX) fails.push({ where: "overflow-x", vp: vp.id, m });
    if (m.stationCount !== 0) fails.push({ where: "stations-still-present", vp: vp.id, m });
  }

  writeFileSync(join(OUT, "report.json"), JSON.stringify({ fails, report }, null, 2));
  console.log(JSON.stringify({ failCount: fails.length, fails, out: OUT }, null, 2));
  await browser.close();
  assert(fails.length === 0, `MOBILE STACK: ${fails[0]?.where}`);
  console.log("\nVERIFY MOBILE STACK PASS");
}

main().catch((e) => {
  console.error("\nVERIFY MOBILE STACK FAIL:", e.message);
  process.exitCode = 1;
});
