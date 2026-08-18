# Malcolm Cuady — Brand System

Source of truth for the portfolio landing page. Built from the green monochrome palette, Landing Page Guide V2 (`SKILL (9).md`), Monich scroll architecture, and a Minimalist & Refined aesthetic.

---

## 1. Brand thesis

**Subject:** Malcolm Joaquin L. Cuady — Lead Full-Stack Developer  
**Audience:** Recruiters, hiring managers, and SME founders evaluating full-stack talent  
**Page job:** Prove he ships real production systems that replace manual operations — then convert to resume download or email  

**One-line positioning**  
> From manual to digital — full-stack systems for real businesses.

**Differentiation (the ONE memorable thing)**  
A pale-green, light-first UI with one signature object: a **scroll-locked schematic assembly**. Five plates (Map / Shape / Wire / Solve / Live) lock together while the story explains how he builds. The pin holds until the system is assembled.

---

## 2. Aesthetic direction

**Chosen direction:** Minimalist & Refined (Landing Page Guide V2)

| Axis | Decision |
|------|----------|
| Density | Spacious (generous whitespace) |
| Mode | **Light primary** (dark available via toggle) |
| Color | Monochromatic green only (2–3 functional roles) |
| Type | Huge uppercase Syne display (`.display-huge`, clamp 2.25rem → 7rem), mono eyebrows |
| Motion | GSAP pinned scenes (hero 340vh, statement 260vh) scrubbed to scroll; Three.js stack tied to pin progress; reduced-motion collapses pins to static sections |
| Layout | Centered focal object + edge labels (Oryzo pattern), clean project grid, timeline for experience |
| Avoid | Purple gradients, Inter/Roboto, cream+terracotta, acid neon accents, receipt/thermal motifs, emoji icons |

---

## 3. Color tokens (from brand palette)

Exact samples from the provided 10-stop green scale:

| Token | Light (default) | Dark | Role |
|-------|-----------------|------|------|
| `--bg` | `#EDF6EE` | `#0D1C15` | Page background |
| `--panel` | `#FFFFFF` | `#1A2E24` | Cards, nav, elevated surfaces |
| `--border` | `#BCD9C4` | `#3D6951` | Hairlines, card borders |
| `--muted` | `#568F6F` | `#6A9078` | Labels / inactive |
| `--accent` | `#264233` | `#6DB58B` | Primary CTA |
| `--accent-soft` | `#3D6951` | `#87C4A0` | Badges, secondary accent |
| `--soft` | `#3D6951` | `#A3D3B4` | Body secondary |
| `--fg` | `#0D1C15` | `#DDF2DE` | Primary text |
| `--spark` | `#6DB58B` | `#87C4A0` | Vibrant highlight (display accents, stats) |

Theme toggles via `html.light` / `html.dark` + `localStorage` key `mc-theme`. **Light is the default on first visit** (brand decision, not system-derived).

**Contrast rules (ATS + WCAG AA)**  
- Body: `--fg` on `--bg` only  
- Never use `--border` for long body copy  
- CTA: `--bg` text on `--accent` fill  
- Focus ring: `--accent-soft` at 2px offset  

**Project previews**  
Local screenshots in `public/previews/*.png` (no third-party screenshot APIs). NDA projects use branded CSS mockups via `SitePreview`.

---

## 4. Typography

| Role | Family | Weights | Usage |
|------|--------|---------|-------|
| Display | **Syne** | 600–800 | Hero H1, section titles |
| Body | **Manrope** | 400–600 | Paragraphs, UI labels |
| Mono | **JetBrains Mono** | 400–500 | Meta, tickets, code-ish labels |

**Scale**

| Step | Size | Line-height | Tracking |
|------|------|-------------|----------|
| Display | clamp(2.75rem, 7vw, 5rem) | 1.05 | -0.03em |
| H2 | clamp(1.75rem, 3.5vw, 2.75rem) | 1.15 | -0.02em |
| H3 | 1.25rem | 1.3 | -0.01em |
| Body | 1rem / 1.125rem | 1.65 | 0 |
| Caption / mono | 0.75rem | 1.4 | 0.08–0.2em |

**Never use:** Inter, Roboto, Arial, Helvetica, system-ui as brand faces.

---

## 5. Components (shadcn-style)

Primitives live in `src/components/ui/` and follow shadcn patterns (`cva` + `cn`):

- `Button` — variants: `default` (spring fill), `outline`, `ghost`, `link`
- `Card` — `panel` fill, `deep` border, 16px radius, no heavy shadows
- `Badge` — soft mint outline for stack tags / status
- `Separator` — 1px `deep` rule
- `Accordion` — FAQ / credential expanders

**Rules**  
- Min touch target 44×44px  
- Hover transitions 150–250ms, ease `[0.16, 1, 0.3, 1]`  
- No multi-layer drop shadows; depth via border + slight lift (`translateY(-2px)`)  
- Lucide icons only (no emoji as UI)

---

## 6. Motion system

### Hero sticky scene (Monich)

1. Normal hero copy + CTA  
2. Tall wrapper **320vh**  
3. Sticky **100vh** scene with layers:  
   - background (obsidian + faint grid)  
   - atmosphere (soft mint radial glow)  
   - midground (spec / meta chips)  
   - main object (**3D-tilted project frame**)  
   - foreground (headline / CTA)  
4. Next section = Projects  

**Scroll progress map**

| Progress | Action |
|----------|--------|
| 0.00–0.20 | Scene locks; headline settles |
| 0.20–0.45 | Project frame rises + rotates into view (3D tilt) |
| 0.45–0.70 | Spec chips / stats enter |
| 0.70–1.00 | Scene fades; handoff to Projects |

Animate **only** `transform` and `opacity`. Respect `prefers-reduced-motion`.

### Section motion
- Framer Motion: fade-up on enter, staggered project cards  
- GSAP ScrollTrigger: experience spine draw, hero pin scrub  
- Button press: scale 0.97 → 1.0  

---

## 7. Landing page structure (11 elements)

Mapped to this portfolio:

| # | Element | Implementation |
|---|---------|----------------|
| 1 | URL keywords | `/` + meta title “Full-Stack Developer Manila” |
| 2 | Logo / header | Wordmark `malcolm.cuady` + sticky blur nav |
| 3 | SEO title / subtitle | Hero thesis + location/role |
| 4 | Primary CTA | “View work” + “Download resume” |
| 5 | Social proof | Stats strip (platforms, mentored, Dean’s List) |
| 6 | Media | Live project previews in browser frames |
| 7 | Benefits / features | Skills groups + digital-transformation narrative |
| 8 | Testimonials | Client outcomes framed as project impact lines |
| 9 | FAQ | Accordion (availability, stack, freelance) |
| 10 | Final CTA | Footer “Let’s ship it” + email |
| 11 | Contact / legal | Email, phone, GitHub, copyright |

**ATS-friendly content rules**  
- Real role titles, dates, education, and skills mirrored from the resume  
- Semantic headings (`h1` → `h2` → `h3`)  
- Downloadable PDF at `/resume.pdf`  
- No icon-only critical information; text always present  
- High-contrast body copy; no light-gray-on-gray  

---

## 8. Spacing & layout

- Container: `max-width: 72rem`, horizontal padding `1.25–2rem`  
- Section vertical rhythm: `6–8rem` desktop, `4–5rem` mobile  
- Card radius: `1rem`  
- Grid: projects 2-col desktop / 1-col mobile  

---

## 9. Voice & copy

- Active, specific, recruiter-plain: “I turn manual operations into digital systems.”  
- No filler (“passionate”, “synergy”).  
- CTAs name the action: “Download resume”, “View work”, “Email Malcolm”.  

---

## 10. File map

```
portfolio/
  BRANDING.md                 ← this file
  design-system/malcolm-portfolio/MASTER.md
  public/resume.pdf
  src/
    index.css                 ← CSS variables + base
    data/profile.jsx          ← content source of truth
    components/ui/            ← shadcn-style primitives
    components/*.jsx          ← page sections
```

Update content in `src/data/profile.jsx`. Update tokens in `tailwind.config.js` + `src/index.css`. Do not invent new accent hues outside this green scale.
