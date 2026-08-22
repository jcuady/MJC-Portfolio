import { useTheme } from "../../lib/theme.jsx";

export default function BrandLogo({ className = "", compact = false }) {
  const { theme } = useTheme();
  const src =
    theme === "dark"
      ? "/brand/logo-dark.png?v=5"
      : "/brand/logo-light.png?v=5";

  return (
    <span className={`brand-logo ${compact ? "brand-logo--compact" : ""} ${className}`}>
      <img
        src={src}
        alt="MJC"
        className="nav-logo"
        width={160}
        height={53}
        decoding="async"
      />
    </span>
  );
}
