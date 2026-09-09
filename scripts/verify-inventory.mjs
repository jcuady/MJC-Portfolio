/**
 * Static inventory gates (no browser): 12 experience roles, 18 certs, asset paths exist.
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/data/profile.jsx"), "utf8");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const expSlice = src.match(/export const experience = \[([\s\S]*?)\n\];/);
assert(expSlice, "experience array missing");
const orgs = [...expSlice[1].matchAll(/^\s+org:\s*"([^"]+)"/gm)].map((m) => m[1]);
assert(orgs.length === 12, `experience orgs ${orgs.length} != 12: ${orgs.join(" | ")}`);
assert(/Nexvision/i.test(orgs[0]), `first org not Nexvision: ${orgs[0]}`);
assert(/Employee Management/i.test(orgs[8]), `EMS not at index 8: ${orgs[8]}`);

const certSlice = src.match(/export const certifications = \[([\s\S]*?)\n\];/);
assert(certSlice, "certifications array missing");
const certNames = [...certSlice[1].matchAll(/^\s+name:\s*"([^"]+)"/gm)].map((m) => m[1]);
assert(certNames.length === 18, `certs ${certNames.length} != 18`);
assert(
  certNames.some((n) => /AI Product Manager/i.test(n)),
  "missing Microsoft AI Product Manager cert"
);

const banned = [
  "NexLogistics",
  "NexHRIS",
  "NexBusinessBrain",
  "PremiumOutlets",
  "NexTask",
  "Beauty Connect",
  "Sklogistics",
  "SorenHRIS",
];
for (const term of banned) {
  assert(!src.includes(term), `NDA product name leaked: ${term}`);
}

const paths = [
  ...src.matchAll(/(?:pdf|logo|preview|src):\s*"(\/[^"]+)"/g),
].map((m) => m[1]);
const missing = [...new Set(paths)].filter((p) => !existsSync(join(root, "public", p)));
assert(missing.length === 0, `missing public assets:\n${missing.join("\n")}`);

console.log(
  JSON.stringify(
    {
      experience: orgs.length,
      certifications: certNames.length,
      assetsChecked: new Set(paths).size,
      orgs,
    },
    null,
    2
  )
);
console.log("PASS verify-inventory");
