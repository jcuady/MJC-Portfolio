/**
 * Certifications completeness + modal smoke test.
 * Usage: PORTFOLIO_URL=http://localhost:4173/ node scripts/verify-certs.mjs
 */
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "qa-output", "certs");
const CHROME = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => p && existsSync(p));
const URL = process.env.PORTFOLIO_URL || "http://localhost:4173/";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const EXPECTED = 17;

async function main() {
  assert(CHROME, "Chrome not found");
  mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  const viewports = [
    { id: "mobile-375", width: 375, height: 667, deviceScaleFactor: 2, isMobile: true },
    { id: "tablet-768", width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true },
    { id: "desktop-1440", width: 1440, height: 900, deviceScaleFactor: 1 },
  ];

  for (const vp of viewports) {
    await page.setViewport(vp);
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });

    const navHasCerts = await page.evaluate(() =>
      [...document.querySelectorAll("a")].some((a) => (a.getAttribute("href") || "").includes("#certifications"))
    );
    assert(navHasCerts, `${vp.id}: nav missing #certifications`);

    await page.evaluate(() => {
      document.getElementById("certifications")?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 400));

    const metrics = await page.evaluate((expected) => {
      const section = document.getElementById("certifications");
      const cardTriggers = document.querySelectorAll(".system-card .cert-trigger");
      const ledgerTriggers = document.querySelectorAll(".certs-section .cert-trigger");
      const countBadge = document.querySelector(".certs-section__count span")?.textContent?.trim();
      const overflowX = document.documentElement.scrollWidth > innerWidth + 2;
      return {
        sectionOk: Boolean(section),
        cardCount: cardTriggers.length,
        ledgerCount: ledgerTriggers.length,
        countBadge,
        overflowX,
        expected,
      };
    }, EXPECTED);

    assert(metrics.sectionOk, `${vp.id}: #certifications missing`);
    assert(
      metrics.cardCount === EXPECTED,
      `${vp.id}: system card triggers ${metrics.cardCount} != ${EXPECTED}`
    );
    assert(
      metrics.ledgerCount === EXPECTED,
      `${vp.id}: ledger triggers ${metrics.ledgerCount} != ${EXPECTED}`
    );
    assert(metrics.countBadge === String(EXPECTED), `${vp.id}: badge ${metrics.countBadge}`);
    assert(!metrics.overflowX, `${vp.id}: horizontal overflow`);

    // Open modal from first ledger trigger
    await page.click(".certs-section .cert-trigger");
    await page.waitForSelector(".cert-modal", { timeout: 5000 });
    const modalOk = await page.evaluate(() => {
      const dialog = document.querySelector('.cert-modal [role="dialog"]');
      const close = document.querySelector(".cert-modal__close");
      const cr = close?.getBoundingClientRect();
      return {
        dialog: Boolean(dialog),
        closeMin: Boolean(cr && cr.width >= 44 && cr.height >= 44),
      };
    });
    assert(modalOk.dialog, `${vp.id}: modal dialog missing`);
    assert(modalOk.closeMin, `${vp.id}: close button < 44px`);

    await page.screenshot({ path: join(OUT, `${vp.id}-modal.png`) });
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.querySelector(".cert-modal"), { timeout: 3000 });

    await page.screenshot({ path: join(OUT, `${vp.id}-section.png`), fullPage: false });
    console.log(`PASS ${vp.id}`);
  }

  // Desktop hover peek (fine pointer)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.getElementById("certifications")?.scrollIntoView());
  await new Promise((r) => setTimeout(r, 300));
  const first = await page.$(".certs-section .cert-trigger");
  const box = await first.boundingBox();
  assert(box, "no trigger box");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await new Promise((r) => setTimeout(r, 350));
  const peek = await page.$(".cert-hover-peek");
  // Peek may fail if PDF iframe blocked in headless; still soft-check
  if (peek) {
    await page.screenshot({ path: join(OUT, "desktop-hover-peek.png") });
    console.log("PASS hover peek visible");
  } else {
    console.log("WARN hover peek not visible in headless (click modal still required)");
  }

  await browser.close();
  console.log(`PASS certifications verify (${EXPECTED} complete)`);
}

main().catch((err) => {
  console.error("FAIL", err.message);
  process.exit(1);
});
