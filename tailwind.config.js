/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: "var(--bg)",
        night: "var(--panel)",
        deep: "var(--border)",
        forest: "var(--muted)",
        spring: "var(--accent)",
        mint: "var(--accent-soft)",
        soft: "var(--soft)",
        pale: "var(--pale)",
        mist: "var(--fg)",
      },
      fontFamily: {
        display: ['"Syne"', "sans-serif"],
        body: ['"Manrope"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      maxWidth: {
        wrap: "72rem",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      boxShadow: {
        soft: "0 24px 60px -30px var(--shadow)",
      },
    },
  },
  plugins: [],
};
