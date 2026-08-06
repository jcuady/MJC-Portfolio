/**
 * Google Search Console + browser favicons.
 * Spec: square, crawlable, ≥48px (48/96). Also writes classic /favicon.ico.
 */
import puppeteer from "puppeteer-core";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const require = createRequire(import.meta.url);
const CHROME = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => p && existsSync(p));

const svg = readFileSync(join(ROOT, "public", "icon.svg"), "utf8");

async function shot(page, size, out) {
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  const markup = svg.replace("<svg", `<svg width="${size}" height="${size}"`);
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:#0D1C15">${markup}</body></html>`,
    { waitUntil: "domcontentloaded", timeout: 10000 }
  );
  await page.screenshot({ path: out, omitBackground: false, type: "png" });
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();

const outs = {
  16: join(ROOT, "public", "favicon-16.png"),
  32: join(ROOT, "public", "favicon-32.png"),
  48: join(ROOT, "public", "favicon-48.png"),
  96: join(ROOT, "public", "favicon-96.png"),
  180: join(ROOT, "public", "apple-touch-icon.png"),
  192: join(ROOT, "public", "icon-192.png"),
  512: join(ROOT, "public", "icon-512.png"),
};

for (const [size, path] of Object.entries(outs)) {
  await shot(page, Number(size), path);
}
await browser.close();

// Ensure png-to-ico is available
let pngToIco;
try {
  pngToIco = (await import("png-to-ico")).default;
} catch {
  spawnSync("npm", ["install", "-D", "png-to-ico"], {
    cwd: ROOT,
    shell: true,
    stdio: "inherit",
  });
  pngToIco = (await import("png-to-ico")).default;
}

const icoBuf = await pngToIco([outs[16], outs[32], outs[48], outs[96]]);
writeFileSync(join(ROOT, "public", "favicon.ico"), icoBuf);
console.log(
  "Favicons OK:",
  Object.keys(outs)
    .map((s) => `${s}px`)
    .join(", "),
  `+ favicon.ico (${icoBuf.length} bytes)`
);
