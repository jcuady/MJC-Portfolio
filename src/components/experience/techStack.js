import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiSupabase,
  SiDocker,
  SiTailwindcss,
  SiVercel,
  SiFirebase,
  SiPostgresql,
  SiFastapi,
  SiGithubactions,
  SiDotnet,
  SiMysql,
  SiPhp,
  SiAirtable,
  SiZapier,
  SiGreensock,
} from "react-icons/si";
import { FaAws, FaDatabase, FaServer, FaMobileAlt, FaCode, FaRobot } from "react-icons/fa";
import { FaMasksTheater } from "react-icons/fa6";
import { TbBrandReactNative, TbBrandTwilio, TbBrandOpenai } from "react-icons/tb";

/**
 * Map free-form tech labels from profile.jsx to icons.
 * Unknown labels still render as text chips (no fake logos).
 */
const ENTRIES = [
  { match: /next\.?js/i, label: "Next.js", Icon: SiNextdotjs, color: "#111" },
  { match: /react native/i, label: "React Native", Icon: TbBrandReactNative, color: "#61DAFB" },
  { match: /\breact\b/i, label: "React", Icon: SiReact, color: "#61DAFB" },
  { match: /typescript/i, label: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { match: /javascript/i, label: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { match: /tailwind/i, label: "Tailwind", Icon: SiTailwindcss, color: "#38BDF8" },
  { match: /supabase/i, label: "Supabase", Icon: SiSupabase, color: "#3ECF8E" },
  { match: /postgres|postgresql/i, label: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
  { match: /mysql/i, label: "MySQL", Icon: SiMysql, color: "#4479A1" },
  { match: /fastapi/i, label: "FastAPI", Icon: SiFastapi, color: "#009688" },
  { match: /python/i, label: "Python", Icon: SiPython, color: "#3776AB" },
  { match: /docker/i, label: "Docker", Icon: SiDocker, color: "#2496ED" },
  { match: /vercel/i, label: "Vercel", Icon: SiVercel, color: "#111" },
  { match: /firebase/i, label: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
  { match: /playwright/i, label: "Playwright", Icon: FaMasksTheater, color: "#2EAD33" },
  { match: /gsap/i, label: "GSAP", Icon: SiGreensock, color: "#88CE02" },
  { match: /asp\.?net|\.net|dotnet/i, label: "ASP.NET", Icon: SiDotnet, color: "#512BD4" },
  { match: /php|laravel/i, label: "PHP", Icon: SiPhp, color: "#777BB4" },
  { match: /airtable/i, label: "Airtable", Icon: SiAirtable, color: "#18BFFF" },
  { match: /zapier|make\.com|n8n/i, label: "Automation", Icon: SiZapier, color: "#FF4A00" },
  { match: /twilio/i, label: "Twilio", Icon: TbBrandTwilio, color: "#F22F46" },
  { match: /github actions|ci\/cd/i, label: "CI/CD", Icon: SiGithubactions, color: "#2088FF" },
  { match: /aws/i, label: "AWS", Icon: FaAws, color: "#FF9900" },
  { match: /rag|llm|openai|ai\b/i, label: "AI / RAG", Icon: TbBrandOpenai, color: "#10A37F" },
  { match: /coolify/i, label: "Coolify", Icon: FaServer, color: "#6DB58B" },
  { match: /pwa/i, label: "PWA", Icon: FaMobileAlt, color: "#5A0FC8" },
  { match: /rls|rbac|rest/i, label: "API / Auth", Icon: FaDatabase, color: "#6DB58B" },
  { match: /paymongo|stripe|payment/i, label: "Payments", Icon: FaCode, color: "#6DB58B" },
  { match: /sms|email|busybee/i, label: "SMS / Email", Icon: TbBrandTwilio, color: "#6DB58B" },
  { match: /power bi/i, label: "Power BI", Icon: FaDatabase, color: "#F2C811" },
  { match: /flutterflow|flutter/i, label: "FlutterFlow", Icon: FaMobileAlt, color: "#02569B" },
  { match: /ocr|tensorflow|tesseract/i, label: "OCR / ML", Icon: FaRobot, color: "#FF6F00" },
  { match: /sql\b/i, label: "SQL", Icon: FaDatabase, color: "#336791" },
];

/** Show stack when the role ships software (preview/url) or maps to real tech icons. */
export function isDevelopmentRole(job) {
  if (!job) return false;
  if (job.preview || job.url) return true;
  const tech = job.tech || [];
  if (!tech.length) return false;
  return tech.some((t) => Boolean(resolveTech(t)?.Icon));
}

export function resolveTech(raw) {
  const text = String(raw || "").trim();
  if (!text) return null;
  for (const entry of ENTRIES) {
    if (entry.match.test(text)) {
      return { label: entry.label, Icon: entry.Icon, color: entry.color, raw: text };
    }
  }
  return { label: text, Icon: null, color: "var(--accent-soft)", raw: text };
}

export function resolveTechList(tech = [], limit = 8) {
  const seen = new Set();
  const out = [];
  for (const item of tech) {
    const meta = resolveTech(item);
    if (!meta) continue;
    const key = meta.label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(meta);
    if (out.length >= limit) break;
  }
  return out;
}
