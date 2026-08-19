import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiNodedotjs,
  SiSupabase,
  SiDocker,
  SiTailwindcss,
  SiVercel,
  SiFirebase,
  SiPostgresql,
  SiFastapi,
  SiKubernetes,
  SiGithubactions,
  SiFigma,
  SiDotnet,
  SiExpress,
  SiGraphql,
  SiMysql,
  SiPhp,
  SiAirtable,
  SiZapier,
  SiGreensock,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { FaMasksTheater } from "react-icons/fa6";

export const profile = {
  name: "Malcolm Joaquin L. Cuady",
  short: "Malcolm Cuady",
  role: "Lead Full-Stack Developer",
  tagline: "I turn manual operations into digital systems.",
  location: "Marikina City, Philippines",
  email: "jcuady@gmail.com",
  phone: "+63 962 529 4043",
  github: "https://github.com/jcuady",
  githubUser: "jcuady",
  linkedin: "https://www.linkedin.com/in/malcolm-joaquin-cuady-68053b401/",
  resumePath: "/resume.pdf",
};

export const stats = [
  { value: "8+", label: "SaaS platforms shipped" },
  { value: "30+", label: "interns mentored" },
  { value: "4", label: "live client products" },
  { value: "2026", label: "DLSU graduate, Dean's List" },
];

/** Process layers shown in the hero stack (bottom → top visually accented). */
export const processLayers = [
  { id: "analyze", label: "Analyze", color: "#1d3728", short: "Map the workflow" },
  { id: "design", label: "Design", color: "#2a4a38", short: "Custom solution shape" },
  { id: "build", label: "Build", color: "#3d6951", short: "Ship the full stack" },
  { id: "solve", label: "Solve", color: "#568f6f", short: "Create the solution" },
  { id: "deliver", label: "Deliver", color: "#6db58b", short: "Results in production" },
];

/**
 * Live unique clients first (featured), then platform / NDA work from resume Projects.
 * Indices match display order, not resume section order.
 */
export const projects = [
  {
    name: "Kadokohi Coffee",
    kind: "Solo Full-Stack PWA",
    url: "https://www.kadokohi.com/",
    preview: "/previews/kadokohi.png",
    index: "01",
    status: "Live · Shipped",
    unique: true,
    accent: "Cafe → QR ordering + POS",
    desc: "Solo-built Progressive Web App that replaced manual cafe ordering and cashier workflows with QR/online ordering, PayMongo payments, POS, and SMS/email automations. Shipped end-to-end with production support and Playwright coverage.",
    stack: ["Next.js", "Supabase", "PayMongo", "Playwright"],
    featured: true,
  },
  {
    name: "Offgrid Lifestyle",
    kind: "Solo Full-Stack E-Commerce",
    url: "https://www.oglifestyleph.com/",
    preview: "/previews/offgrid.png",
    index: "02",
    status: "Live · Shipped",
    unique: true,
    accent: "Merch → automated storefront",
    desc: "Solo-built merchandise e-commerce that replaced manual order-taking with an online storefront, PayMongo checkout, SMS status automation, and SEO — owned end-to-end on Next.js, Supabase, and Vercel.",
    stack: ["Next.js", "Supabase", "Vercel", "PayMongo"],
    featured: true,
  },
  {
    name: "MGC Architecture",
    kind: "Digital Transformation · Studio Platform",
    url: "https://www.mgcarchitecture.com/",
    preview: "/previews/mgc.png",
    index: "03",
    status: "Live",
    unique: true,
    accent: "Studio → cost calculator + CMS",
    desc: "Solo digital transformation for an architecture practice: scroll-driven portfolio, interactive construction cost calculator, inquiry handling, and secure admin CMS — replacing fragmented manual inquiry and costing workflows.",
    stack: ["Next.js", "TypeScript", "GSAP", "Supabase"],
    featured: true,
  },
  {
    name: "Hakum Auto Care",
    kind: "Ops Platform · Multi-Branch Revamp",
    url: "https://www.hakumautocare.com/",
    preview: "/previews/hakum.png",
    index: "04",
    status: "Live",
    unique: false,
    desc: "Full-stack auto detailing ops: live queue management, geofenced staff attendance, multi-branch RBAC, customer portal, POS, and BusyBee SMS for booking, payment, and completion alerts.",
    stack: ["React", "Supabase", "RLS/RBAC", "Playwright"],
    featured: true,
  },
  {
    name: "NexBusinessBrain",
    kind: "Enterprise RAG AI System",
    url: null,
    preview: null,
    index: "05",
    status: "NDA · Deployed",
    unique: false,
    desc: "Company-wide internal AI assistant on Qwen/DashScope LLM, Pinecone, LlamaIndex, LlamaParse, LangChain, FastAPI backend, and React + Vite + TypeScript frontend.",
    stack: ["FastAPI", "Pinecone", "LlamaIndex", "React"],
    featured: false,
  },
  {
    name: "NexLogistics & Sklogistics",
    kind: "Multi-Tenant Logistics SaaS",
    url: null,
    preview: null,
    index: "06",
    status: "NDA",
    unique: false,
    desc: "End-to-end multi-tenant logistics management with client-specific tenancy isolation — Next.js, TypeScript, Supabase, and AWS.",
    stack: ["Next.js", "TypeScript", "Supabase", "AWS"],
    featured: false,
  },
  {
    name: "NexHRIS / SorenHRIS / PremiumOutlets",
    kind: "HR & Retail SaaS Suite",
    url: null,
    preview: null,
    index: "07",
    status: "NDA · Sold",
    unique: false,
    desc: "HR information and retail management SaaS built from scratch. SorenHRIS was commercially sold to an enterprise client as a production product.",
    stack: ["Next.js", "TypeScript", "Supabase", "Docker"],
    featured: false,
  },
  {
    name: "NexTask",
    kind: "Real-Time Project & Task Platform",
    url: null,
    preview: null,
    index: "08",
    status: "NDA",
    unique: false,
    desc: "Collaborative task and project management for cross-team operations — Next.js, TypeScript, Supabase with real-time data sync.",
    stack: ["Next.js", "TypeScript", "Supabase"],
    featured: false,
  },
  {
    name: "Bazaar",
    kind: "E-Commerce · Product QA Marketplace",
    url: null,
    preview: null,
    index: "09",
    status: "NDA",
    unique: false,
    desc: "Marketplace with built-in product quality assurance and safety verification for trustworthy C2C and B2C transactions.",
    stack: ["Next.js", "Supabase", "TypeScript"],
    featured: false,
  },
  {
    name: "Beauty Connect",
    kind: "Salon & Clinic Booking Marketplace",
    url: null,
    preview: null,
    index: "10",
    status: "NDA",
    unique: false,
    desc: "Multi-vendor platform for salons, barbershops, and aesthetic clinics — appointments plus product sales in one marketplace.",
    stack: ["Next.js", "Supabase", "TypeScript"],
    featured: false,
  },
  {
    name: "EMS Full-Stack",
    kind: "Employee Management System",
    url: null,
    preview: null,
    index: "11",
    status: "Shipped",
    unique: false,
    desc: "Employee management with role-based access — React, ASP.NET Core, PostgreSQL — deployed on Vercel and Railway.",
    stack: ["React", "ASP.NET Core", "PostgreSQL"],
    featured: false,
  },
  {
    name: "Rent Then Drive",
    kind: "DLSU Capstone · Car Rental",
    url: null,
    preview: null,
    index: "12",
    status: "Capstone",
    unique: false,
    desc: "Cloud car rental platform led as project lead: FlutterFlow, Firebase, Airtable, PayMongo, TensorFlow/Tesseract OCR for ID fraud checks, Make.com automations, Power BI dashboards.",
    stack: ["FlutterFlow", "Firebase", "PayMongo", "TensorFlow"],
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.unique);
export const otherProjects = projects.filter((p) => !p.unique);

/** Chronological for display after reverse — latest first when reversed. */
export const experience = [
  {
    role: "Lead Full-Stack Developer",
    org: "Nexvision Innovations Inc.",
    period: "11/2025 — 06/2026",
    points: [
      "Directed infrastructure modernization to Next.js, TypeScript, Supabase, Docker, and Coolify across all platforms",
      "Designed NexBusinessBrain, an enterprise RAG AI system deployed company-wide",
      "Led delivery of 8+ multi-tenant SaaS platforms; led Agile transformation and mentored 30+ interns",
    ],
  },
  {
    role: "Co-Founder / Lead Full-Stack Developer",
    org: "Optrizo Digital Solutions",
    period: "2024 — 06/2026",
    points: [
      "Co-founded a student-led I.T. and marketing startup serving SME clients",
      "Built a real-time live queueing system with React, Supabase, and Twilio",
      "Owned client communication and multi-project delivery until exit in 06/2026",
    ],
  },
  {
    role: "Full-Stack Developer (Solo · Client)",
    org: "Kadokohi Coffee Shop",
    url: "https://www.kadokohi.com/",
    period: "2026",
    points: [
      "Solo-built PWA: QR/online ordering, POS, PayMongo, SMS/email automation on Next.js + Supabase",
      "Shipped Playwright E2E, SEO, and production operations for the cafe’s digital stack",
    ],
  },
  {
    role: "Full-Stack Developer (Solo · Client)",
    org: "Offgrid Lifestyle",
    url: "https://www.oglifestyleph.com/",
    period: "2026",
    points: [
      "Solo-built merch e-commerce: PayMongo checkout, SMS status automation, SEO on Next.js/Supabase/Vercel",
      "Delivered storefront, payments, and end-to-end digital ownership for the brand",
    ],
  },
  {
    role: "Full-Stack Developer (Solo · Client)",
    org: "MGC Architecture",
    url: "https://www.mgcarchitecture.com/",
    period: "2025 — 2026",
    points: [
      "Solo digital transformation: portfolio, interactive cost calculator, inquiry flows, admin CMS",
      "Next.js, TypeScript, Tailwind, GSAP, and Supabase replacing manual inquiry and costing",
    ],
  },
  {
    role: "CRM & Automation Developer",
    org: "Sole Surgeon",
    period: "2025",
    points: [
      "Custom Airtable CRM integrated with Pancake CRM; SMS tagging and notification automations",
      "AI marketing ads via Google Veo 3 / Runway ML; Playwright E2E across CRM workflows",
    ],
  },
  {
    role: "Full-Stack Developer (Optrizo)",
    org: "Hakum Auto Care",
    url: "https://www.hakumautocare.com/",
    period: "2024 — 2026",
    points: [
      "Revamped ops platform: live queue, geofenced attendance, multi-branch RBAC, POS, BusyBee SMS",
      "Playwright E2E across queue, booking, POS, and notification pipelines",
    ],
  },
  {
    role: "Project Lead / Full-Stack Developer — DLSU Capstone",
    org: "Rent Then Drive",
    period: "2024 — 2025",
    points: [
      "Led capstone team for cloud car rental with FlutterFlow, Firebase, Airtable, and PayMongo",
      "TensorFlow/Tesseract OCR for ID verification; Make.com + Power BI for ops analytics",
    ],
  },
  {
    role: "IT Intern — Global NOC",
    org: "Converge ICT Solutions Inc.",
    period: "09/2025 — 12/2025",
    points: [
      "Network fault isolation, incident ticketing, and technical documentation for enterprise operations",
    ],
  },
  {
    role: "Data Analyst Intern",
    org: "Startek Pasig",
    period: "06/2023 — 11/2023",
    points: [
      "Power BI dashboards with SQL and ANOVA for executive reporting; upskilled supervisors in Python",
    ],
  },
];

export const skillGroups = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: SiReact, color: "#87C4A0" },
      { name: "Next.js", icon: SiNextdotjs, color: "#DDF2DE" },
      { name: "TypeScript", icon: SiTypescript, color: "#6DB58B" },
      { name: "JavaScript", icon: SiJavascript, color: "#A3D3B4" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#87C4A0" },
      { name: "GSAP", icon: SiGreensock, color: "#6DB58B" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#87C4A0" },
      { name: "Express", icon: SiExpress, color: "#DDF2DE" },
      { name: "ASP.NET Core", icon: SiDotnet, color: "#6DB58B" },
      { name: "FastAPI", icon: SiFastapi, color: "#A3D3B4" },
      { name: "Python", icon: SiPython, color: "#87C4A0" },
      { name: "PHP", icon: SiPhp, color: "#568F6F" },
      { name: "GraphQL", icon: SiGraphql, color: "#6DB58B" },
    ],
  },
  {
    title: "Data & Cloud",
    skills: [
      { name: "Supabase", icon: SiSupabase, color: "#6DB58B" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#87C4A0" },
      { name: "MySQL", icon: SiMysql, color: "#A3D3B4" },
      { name: "Firebase", icon: SiFirebase, color: "#C0E3C9" },
      { name: "AWS", icon: FaAws, color: "#6DB58B" },
      { name: "Docker", icon: SiDocker, color: "#87C4A0" },
      { name: "Kubernetes", icon: SiKubernetes, color: "#568F6F" },
      { name: "Vercel", icon: SiVercel, color: "#DDF2DE" },
    ],
  },
  {
    title: "Automation & Quality",
    skills: [
      { name: "GitHub Actions", icon: SiGithubactions, color: "#87C4A0" },
      { name: "Playwright", icon: FaMasksTheater, color: "#6DB58B" },
      { name: "Airtable", icon: SiAirtable, color: "#A3D3B4" },
      { name: "Zapier", icon: SiZapier, color: "#568F6F" },
      { name: "Figma", icon: SiFigma, color: "#C0E3C9" },
      { name: "n8n", color: "#6DB58B" },
      { name: "Make", color: "#87C4A0" },
    ],
  },
  {
    title: "Product & Delivery",
    skills: [
      { name: "Agile" },
      { name: "Scrum" },
      { name: "Sprint Planning" },
      { name: "Backlog Prioritization" },
      { name: "Code Reviews" },
      { name: "Stakeholder Communication" },
      { name: "Project Management" },
      { name: "Technical Leadership" },
    ],
  },
];

export const education = {
  school: "De La Salle University, Manila",
  degree: "BS Information Technology",
  year: "March 2026",
  logo: "/logos/dlsu.webp",
  gpa: "≈ 3.00",
  gpaPct: "≈ 90%",
  honors: [
    "1st Honors Dean's List (2024–2025)",
    "2nd Honors Dean's List (2023–2024)",
    "Co-founder, Data Science Society",
  ],
  electives: [
    "Design Thinking",
    "Systems Planning",
    "System Continuity and Disaster Recovery",
    "Secure SDLC",
    "Project Management",
    "Artificial Intelligence",
    "Human–Computer Interaction (HCI)",
  ],
};

export const certifications = [
  {
    name: "Google Project Management Professional Certificate",
    org: "Google / Coursera",
    year: "August 2026",
  },
  { name: "AWS Academy Cloud Foundations", org: "Amazon Web Services", year: "2025" },
  { name: "Databricks Fundamentals & Generative AI", org: "Databricks", year: "2025" },
  { name: "CCNA: Enterprise Networking", org: "Cisco", year: "2025" },
  { name: "Airtable Admin & Builder", org: "Airtable", year: "2024-2027" },
  { name: "HubSpot Marketing & SEO", org: "HubSpot Academy", year: "2025" },
  { name: "Lean Six Sigma Yellow & White Belt", org: "Six Sigma Global Institute", year: "" },
];

export const heroSpecializations = [
  "Project management",
  "Agile delivery",
  "Cloud foundations",
  "Applied AI",
  "Operations automation",
];

export const heroProof = [
  {
    id: "production",
    title: "Production Systems",
    body: "Web apps, operational platforms and internal tools",
  },
  {
    id: "saas",
    title: "SaaS & Automation",
    body: "End-to-end workflows built around real operations",
  },
  {
    id: "delivery",
    title: "Product & Delivery",
    body: "Engineering, project management and stakeholder coordination",
  },
];

export const recruiterHighlights = [
  "End-to-end product ownership",
  "Full-stack engineering with business context",
  "SaaS, automation, cloud & applied AI",
  "Agile delivery & project management",
  "Technical and stakeholder communication",
];

export const heroStack = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind"],
  },
  {
    title: "Backend",
    items: ["Node.js", "FastAPI", "ASP.NET Core"],
  },
  {
    title: "Data & Cloud",
    items: ["PostgreSQL", "Supabase", "AWS", "Docker"],
  },
  {
    title: "Product & Delivery",
    items: ["Agile", "Scrum", "Code Reviews"],
  },
  {
    title: "Automation",
    items: ["n8n", "Zapier", "Make", "Airtable"],
  },
];

export const heroRoles = [
  "Full-Stack Developer",
  "UI/UX Developer",
  "Automation Builder",
  "Digital Transformation",
  "Project Management",
];

export const transformationPillars = [
  {
    title: "Streamline",
    body: "Replace fragmented workflows",
  },
  {
    title: "Automate",
    body: "Reduce repetitive operational work",
  },
  {
    title: "Scale",
    body: "Build systems that grow with the business",
  },
];

export const uxFocus = [
  "Wireframes & Prototypes",
  "Design Systems",
  "Usability",
  "Responsive Design",
];

export const industries = [
  { id: "saas", label: "SaaS Platforms", mark: "hex" },
  { id: "logistics", label: "Logistics & Operations", mark: "bars" },
  { id: "retail", label: "Retail", mark: "diamond" },
  { id: "commerce", label: "E-commerce", mark: "ring" },
  { id: "pro", label: "Professional Services", mark: "grid" },
  { id: "growth", label: "Growth-stage Teams", mark: "slash" },
];

export const selectedWork = [
  {
    name: "Kadokohi Coffee",
    category: "Commerce · POS · PWA",
    desc: "Full-stack cafe platform combining online and QR ordering, POS workflows, payments, and customer notifications.",
    stack: ["Next.js", "Supabase", "PayMongo"],
    preview: "/previews/kadokohi.png",
    url: "https://www.kadokohi.com/",
  },
  {
    name: "Offgrid Lifestyle",
    category: "E-commerce",
    desc: "Full-stack merchandise storefront with online checkout, order workflows, automated status notifications, and responsive commerce UX.",
    stack: ["Next.js", "Supabase", "PayMongo"],
    preview: "/previews/offgrid.png",
    url: "https://www.oglifestyleph.com/",
  },
  {
    name: "MGC Architecture",
    category: "Digital Transformation",
    desc: "Architecture studio platform combining portfolio content, inquiry management, CMS workflows, and an interactive construction cost calculator.",
    stack: ["Next.js", "TypeScript", "Supabase"],
    preview: "/previews/mgc.png",
    url: "https://www.mgcarchitecture.com/",
  },
  {
    name: "Hakum Auto Care",
    category: "Operations Platform",
    desc: "Auto-care operations system combining live queue management, bookings, role-based access, branch operations, POS workflows, and customer notifications.",
    stack: ["React", "Supabase", "Automation"],
    preview: "/previews/hakum.png",
    url: "https://www.hakumautocare.com/",
  },
];

export const faq = [
  {
    q: "Are you open to full-time roles?",
    a: "Yes. I'm looking for a full-time full-stack, web application, or product engineering seat in Metro Manila (hybrid or onsite). Portfolio products shown here were shipped as past client work.",
  },
  {
    q: "What do you specialize in?",
    a: "End-to-end digital transformation for SMEs and internal platforms: Next.js/React frontends, Node/FastAPI backends, Supabase/Postgres, payments (PayMongo), SMS automation, and AI/RAG systems.",
  },
  {
    q: "Can you share private / NDA work?",
    a: "NexBusinessBrain and the Nex SaaS suite are under NDA. I can walk through architecture, scope, and outcomes in an interview without confidential code or client data.",
  },
];
