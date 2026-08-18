import HeroPortrait from "./HeroPortrait.jsx";

/** Press frame — face in a bezel; GSAP owns the stroke draw. */
export default function HeroStage() {
  return (
    <div className="hero-press">
      <div className="hero-press__stage">
        <svg className="hero-toolpath" viewBox="0 0 200 248" fill="none" aria-hidden="true">
          <path
            className="hero-toolpath__track"
            d="M24 12 H176 Q188 12 188 24 V224 Q188 236 176 236 H24 Q12 236 12 224 V24 Q12 12 24 12 Z"
          />
          <path
            className="hero-toolpath__draw"
            d="M24 12 H176 Q188 12 188 24 V224 Q188 236 176 236 H24 Q12 236 12 224 V24 Q12 12 24 12 Z"
          />
        </svg>
        <div className="hero-press__bezel">
          <div className="hero-press__core">
            <HeroPortrait />
          </div>
        </div>
      </div>
    </div>
  );
}
