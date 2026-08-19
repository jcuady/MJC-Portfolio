import HeroPortrait from "./HeroPortrait.jsx";

/** Single photo plate. No nested bezels, no SVG wrap. */
export default function HeroStage() {
  return (
    <div className="hero-press">
      <HeroPortrait />
    </div>
  );
}
