# Malcolm Cuady — Developer Portfolio

Minimal, professional portfolio in a green monochrome system. See
[`BRANDING.md`](./BRANDING.md) for the full design system.

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- shadcn-style primitives (`cva`, `clsx`, `tailwind-merge`, Lucide)
- GSAP 3 + ScrollTrigger — sticky 3D hero scene, experience spine
- Framer Motion — section reveals

## Run

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Customize

- Content: `src/data/profile.jsx`
- Brand tokens: `BRANDING.md`, `tailwind.config.js`, `src/index.css`
- Resume PDF: `public/resume.pdf`
