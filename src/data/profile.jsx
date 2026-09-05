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
  role: "Full-Stack Developer",
  /** LinkedIn-style headline used across landing meta and hero identity. */
  description:
    "Full-Stack Developer | Business & Digital Transformation | Project Management | DLSU BS IT (March 2026)",
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
    name: "SaaS RAG / Conversational AI",
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
    name: "Multi-Tenant Logistics Platform",
    kind: "Logistics SaaS",
    url: null,
    preview: null,
    index: "06",
    status: "NDA",
    unique: false,
    desc: "End-to-end multi-tenant logistics management with client-specific tenancy isolation - Next.js, TypeScript, Supabase, and AWS.",
    stack: ["Next.js", "TypeScript", "Supabase", "AWS"],
    featured: false,
  },
  {
    name: "HR Platform Suite",
    kind: "HR & Retail SaaS Suite",
    url: null,
    preview: null,
    index: "07",
    status: "NDA · Sold",
    unique: false,
    desc: "HR information and retail management SaaS built from scratch. One HR platform in the suite was sold to an enterprise client as a production product.",
    stack: ["Next.js", "TypeScript", "Supabase", "Docker"],
    featured: false,
  },
  {
    name: "Task Management Platform",
    kind: "Real-Time Project & Task Platform",
    url: null,
    preview: null,
    index: "08",
    status: "NDA",
    unique: false,
    desc: "Collaborative task and project management for cross-team operations - Next.js, TypeScript, Supabase with real-time data sync.",
    stack: ["Next.js", "TypeScript", "Supabase"],
    featured: false,
  },
  {
    name: "Marketplace Product",
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
    name: "Salon Booking Marketplace",
    kind: "Salon & Clinic Booking Marketplace",
    url: null,
    preview: null,
    index: "10",
    status: "NDA",
    unique: false,
    desc: "Multi-vendor platform for salons, barbershops, and aesthetic clinics - appointments plus product sales in one marketplace.",
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
      "Designed a SaaS RAG / conversational AI system deployed company-wide under NDA",
      "Led delivery of 8+ multi-tenant SaaS platforms; built internal Jira-style PM tooling; mentored 30+ interns",
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
      { name: "Azure", color: "#6DB58B" },
      { name: "Docker", icon: SiDocker, color: "#87C4A0" },
      { name: "Vercel", icon: SiVercel, color: "#DDF2DE" },
    ],
  },
  {
    title: "DevOps & Security",
    skills: [
      { name: "GitHub Actions", icon: SiGithubactions, color: "#87C4A0" },
      { name: "CI/CD Pipelines", color: "#6DB58B" },
      { name: "IaC Fundamentals", color: "#A3D3B4" },
      { name: "Observability", color: "#87C4A0" },
      { name: "Secure SDLC", color: "#6DB58B" },
      { name: "IAM Basics", color: "#A3D3B4" },
      { name: "Risk Management", color: "#568F6F" },
      { name: "Network Security", color: "#C0E3C9" },
    ],
  },
  {
    title: "Automation & Quality",
    skills: [
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
      { name: "Lean Six Sigma" },
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
    name: "Microsoft AI and ML Engineering Professional Certificate",
    org: "Microsoft",
    year: "August 2026",
    credentialId: null,
    pdf: "/certs/ai and ml.pdf",
    group: "engineering",
  },
  {
    name: "Microsoft Full-Stack Developer Professional Certificate",
    org: "Microsoft",
    year: "August 2026",
    pdf: "/certs/fullstack.pdf",
    group: "engineering",
  },
  {
    name: "Microsoft Business Analyst Professional Certificate",
    org: "Microsoft",
    year: "August 2026",
    pdf: "/certs/business analyst.pdf",
    group: "engineering",
  },
  {
    name: "Microsoft DevOps Engineering",
    org: "Microsoft",
    year: "August 2026",
    credentialId: "69HLC3JFSOTB",
    pdf: "/certs/devops.pdf",
    group: "cloud",
  },
  {
    name: "Microsoft Azure Administrator (AZ-104)",
    org: "Packt",
    year: "August 2026",
    pdf: "/certs/az-104.pdf",
    group: "cloud",
  },
  {
    name: "Google AI Professional Certificate",
    org: "Google",
    year: "August 2026",
    pdf: "/certs/google ai.pdf",
    group: "engineering",
  },
  {
    name: "Google Project Management Professional Certificate",
    org: "Google / Coursera",
    year: "August 2026",
    pdf: "/certs/project management.pdf",
    group: "engineering",
  },
  {
    name: "Certified Information Systems Security Professional (CISSP) Specialization",
    org: "Infosec",
    year: "September 2026",
    credentialId: "ZJNZR0WGXU9K",
    pdf: "/certs/CISSP.pdf",
    note: "Infosec specialization / exam-prep path - not an ISC2 CISSP exam pass",
    group: "security",
  },
  {
    name: "AWS Academy Cloud Foundations",
    org: "Amazon Web Services",
    year: "2025",
    pdf: "/certs/AWS_Academy_Graduate___Cloud_Foundations___Training_Badge_Badge20260901-19-mcwaox.pdf",
    group: "cloud",
  },
  {
    name: "AWS Cloud Solutions Architect Professional Certificate",
    org: "Amazon Web Services / Coursera",
    year: "September 2026",
    credentialId: "C62X74XPOGP7",
    pdf: "/certs/aws_cloud_solutions_architect.pdf",
    verify: "https://coursera.org/verify/professional-cert/C62X74XPOGP7",
    note: "Coursera Professional Certificate pathway toward AWS Certified Solutions Architect - Associate exam prep (not the AWS exam credential itself)",
    group: "cloud",
  },
  { name: "Databricks Fundamentals and Generative AI", org: "Databricks", year: "2025", group: "cloud" },
  { name: "Airtable Admin and Builder", org: "Airtable", year: "2024-2027", group: "ops" },
  { name: "HubSpot Marketing and SEO", org: "HubSpot Academy", year: "2025", group: "ops" },
  {
    name: "CCNA: Enterprise Networking, Security, and Automation",
    org: "Cisco Networking Academy",
    year: "December 2023",
    pdf: "/certs/CCNA_ENSA.pdf",
    note: "Networking Academy course completion - not the Cisco CCNA certification exam",
    group: "security",
  },
  {
    name: "Lean Six Sigma Yellow Belt and White Belt",
    org: "Six Sigma Global Institute",
    year: "December 2025",
    credentialId: "1137662",
    pdf: "/certs/SixSigmaYellowBelt-MalcolmCuady-1137662.pdf",
    group: "ops",
  },
  { name: "Klaviyo Developer Certificate", org: "Klaviyo", year: "", group: "ops" },
  {
    name: "Asana Workflow Specialist",
    org: "Asana",
    year: "",
    pdf: "/certs/asana.pdf",
    group: "ops",
  },
];

/** Display groups for the Certifications section */
export const certificationGroups = [
  { id: "engineering", label: "Engineering and AI" },
  { id: "cloud", label: "Cloud and DevOps" },
  { id: "security", label: "Security and Networking" },
  { id: "ops", label: "Product, Marketing, and Ops" },
];

export const heroSpecializations = [
  "Full-stack engineering",
  "Digital transformation",
  "Project management",
  "Applied AI & ML",
  "Agile delivery",
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
  "Business & Digital Transformation",
  "Project Management",
  "Applied AI",
  "DLSU BS IT · March 2026",
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
    a: "The SaaS RAG / conversational AI system and the multi-tenant product suite are under NDA. I can walk through architecture, scope, and outcomes in an interview without confidential code, product names, or client data.",
  },
];
