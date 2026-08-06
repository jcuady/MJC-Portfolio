/**
 * Strict parallax QA — progress from live section rect (data-parallax-progress).
 * Samples must be taken while #statement intersects the viewport.
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

async function sample(page) {
  return page.evaluate(() => {
    const sec = document.querySelector("#statement");
    const r = sec.getBoundingClientRect();
    const cards = [...document.querySelectorAll(".st-parallax-card")].map((el) => {
      const t = getComputedStyle(el).transform;
      let y = 0;
      if (t && t !== "none") {
        const m3 = t.match(/matrix3d\(([^)]+)\)/);
        if (m3) y = parseFloat(m3[1].split(",")[13]);
        else {
          const m = t.match(/matrix\(([^)]+)\)/);
          if (m) y = parseFloat(m[1].split(",")[5]);
        }
      }
      return { speed: Number(el.dataset.speed), y };
    });
    return {
      progress: parseFloat(sec.dataset.parallaxProgress || "0"),
      intersecting: r.bottom > 80 && r.top < innerHeight - 80,
      secTop: r.top,
      cards,
      rail: document.querySelector(".st-parallax-rail")?.style?.transform || "",
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
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);

  const res = await page.goto(URL, { waitUntil: "networkidle0", timeout: 45000 });
  assert(res?.status() === 200, `HTTP ${res?.status()}`);
  await new Promise((r) => setTimeout(r, 2800));

  const meta = await page.evaluate(async () => {
    const icon = document.querySelector('link[rel="icon"]');
    const iconHref = icon?.getAttribute("href") || "";
    const r = await fetch(new URL(iconHref, location.href));
    return {
      title: document.title,
      iconHref,
      iconStatus: r.status,
      hasDigital: /digital transformation/i.test(document.title),
      hasName: /malcolm/i.test(document.title),
    };
  });
  assert(meta.hasName && meta.hasDigital, `title: "${meta.title}"`);
  assert(meta.iconHref.includes("icon.svg") && meta.iconStatus === 200, "favicon fail");

  const galleryOk = await page.evaluate(() => ({
    cards: document.querySelectorAll(".st-parallax-card").length,
    cta: Boolean(document.querySelector('[data-testid="consult-cta"]')),
    spacers: document.querySelectorAll(".pin-spacer").length,
  }));
  assert(galleryOk.cards >= 3 && galleryOk.cta, "gallery/cta missing");
  assert(galleryOk.spacers === 1, `expected only hero pin (no statement pin), got ${galleryOk.spacers}`);

  const top = await page.evaluate(() => {
    const el = document.querySelector("#statement");
    return el.getBoundingClientRect().top + window.scrollY;
  });
  const h = await page.evaluate(() => document.querySelector("#statement").offsetHeight);
  const vh = 900;

  // On-screen samples: section entering / mid / nearly leaving
  const positions = [
    { name: "enter", y: top - vh * 0.35 },
    { name: "mid", y: top + h * 0.25 },
    { name: "late", y: top + h * 0.55 },
  ];

  const samples = {};
  for (const pos of positions) {
    await page.evaluate((y) => scrollTo({ top: Math.max(0, y), behavior: "instant" }), pos.y);
    await new Promise((r) => setTimeout(r, 650));
    samples[pos.name] = await sample(page);
    await page.screenshot({ path: join(OUT, `parallax-${pos.name}.png`) });
    assert(
      samples[pos.name].intersecting,
      `${pos.name}: statement not intersecting viewport (top=${samples[pos.name].secTop})`
    );
  }

  const a = samples.enter;
  const c = samples.late;
  assert(c.progress > a.progress + 0.08, `progress stuck: ${a.progress} → ${c.progress}`);

  const deltas = a.cards.map((card, i) => ({
    speed: card.speed,
    dy: c.cards[i].y - card.y,
  }));

  for (const d of deltas) {
    assert(Math.abs(d.dy) > 10, `card speed=${d.speed} |dy|=${Math.abs(d.dy).toFixed(2)} dead`);
  }

  const slow = [...deltas].sort((x, y) => x.speed - y.speed)[0];
  const fast = [...deltas].sort((x, y) => x.speed - y.speed).at(-1);
  assert(
    Math.abs(fast.dy) > Math.abs(slow.dy) + 5,
    `depth fail fast=${Math.abs(fast.dy).toFixed(1)} slow=${Math.abs(slow.dy).toFixed(1)}`
  );

  assert(/translate/i.test(c.rail), "rail transform missing");

  await page.evaluate(() =>
    document.querySelector('[data-testid="consult-cta"]')?.scrollIntoView({ block: "center" })
  );
  await new Promise((r) => setTimeout(r, 300));
  await page.click('[data-testid="consult-cta"]');
  await new Promise((r) => setTimeout(r, 400));
  assert(
    await page.evaluate(() => Boolean(document.querySelector('[role="dialog"] input[name="name"]'))),
    "modal missing"
  );
  await page.screenshot({ path: join(OUT, "parallax-modal.png") });
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 250));
  assert(await page.evaluate(() => !document.querySelector('[role="dialog"]')), "Escape fail");

  const report = {
    ok: true,
    meta,
    galleryOk,
    progress: { enter: a.progress, mid: samples.mid.progress, late: c.progress },
    deltas,
  };
  writeFileSync(join(OUT, "parallax-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  console.log("\nVERIFY PARALLAX PASS");
}

main().catch((e) => {
  console.error("\nVERIFY PARALLAX FAIL:", e.message);
  process.exitCode = 1;
});
