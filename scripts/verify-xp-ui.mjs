import puppeteer from "puppeteer-core";
import { existsSync } from "fs";

const CHROME = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => p && existsSync(p));
const URL = process.env.PORTFOLIO_URL || "http://127.0.0.1:4173/";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const viewports = [
  { id: "m375", width: 375, height: 667, isMobile: true, deviceScaleFactor: 2 },
  { id: "t768", width: 768, height: 1024, isMobile: true, deviceScaleFactor: 2 },
  { id: "d1440", width: 1440, height: 900, deviceScaleFactor: 1 },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();

for (const vp of viewports) {
  await page.setViewport(vp);
  await page.goto(URL + "#experience", { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.getElementById("experience")?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 500));

  const mobileVisible = await page.evaluate(() => {
    const el = document.querySelector(".xp-mobile");
    if (!el) return false;
    const cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden" && el.offsetParent !== null;
  });

  if (mobileVisible) {
    await page.click(".xp-mobile-step:nth-child(3)");
    await new Promise((r) => setTimeout(r, 300));
  } else {
    // Desktop: jump mid-career so lower rail + foot are visible
    await page.evaluate(() => {
      const track = document.querySelector(".xp-track");
      if (!track) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + track.offsetHeight * 0.75);
    });
    await new Promise((r) => setTimeout(r, 700));
    // Activate Beepa via rail (step 03)
    const beepa = await page.$('.xp-rail__btn[aria-label*="Beepa"]');
    if (beepa) {
      await beepa.click();
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  const m = await page.evaluate((mobile) => {
    const root = mobile
      ? document.querySelector(".xp-mobile")
      : document.querySelector(".xp-track") || document.querySelector("#experience");
    const overflowX = document.documentElement.scrollWidth > innerWidth + 2;
    const stack = root?.querySelector(".xp-snap__stack");
    const chips = root?.querySelectorAll(".xp-snap__tech-chip").length || 0;
    const foot = root?.querySelector(".xp-rail__foot");
    const list = root?.querySelector(".xp-rail__list");
    let overlap = false;
    if (foot && list && getComputedStyle(foot).display !== "none") {
      const fr = foot.getBoundingClientRect();
      overlap = [...list.querySelectorAll(".xp-rail__item")].some((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > fr.top + 2 && r.top < fr.bottom - 2 && r.height > 0;
      });
    }
    return {
      overflowX,
      hasStack: Boolean(stack),
      chips,
      overlap,
      footText: foot?.textContent?.replace(/\s+/g, " ").trim() || null,
    };
  }, mobileVisible);

  assert(!m.overflowX, `${vp.id}: horizontal overflow`);
  assert(!m.overlap, `${vp.id}: rail foot overlaps steps`);
  assert(m.hasStack && m.chips > 0, `${vp.id}: missing tech stack chips (${m.chips})`);
  console.log("PASS", vp.id, JSON.stringify(m));
}

await browser.close();
console.log("PASS responsive experience smoke");
