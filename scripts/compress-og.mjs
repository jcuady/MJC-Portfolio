import puppeteer from "puppeteer-core";
import { existsSync, statSync } from "fs";
import { pathToFileURL } from "url";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CHROME = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => p && existsSync(p));

const src = pathToFileURL(join(ROOT, "public", "og-image.png")).href;
const out = join(ROOT, "public", "og-image.png");

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(
  `<!doctype html><html><body style="margin:0;overflow:hidden;background:#EDF6EE">
    <img src="${src}" alt="" width="1200" height="630"
      style="display:block;width:1200px;height:630px;object-fit:cover" />
  </body></html>`,
  { waitUntil: "load", timeout: 20000 }
);
await page.screenshot({ path: out, type: "png" });
await browser.close();
console.log("og compressed", statSync(out).size);
