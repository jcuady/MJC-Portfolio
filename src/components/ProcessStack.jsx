import { processLayers } from "../data/profile.jsx";

/**
 * CSS 3D process stack — machined layer trays (Analyze → Deliver).
 * Motion is owned by Hero GSAP scrub (transforms on .process-slab / .process-stack__rig).
 * Keep class `process-tower` for verify scripts.
 */
export default function ProcessStack() {
  return (
    <div
      className="process-stack process-tower"
      data-active="-1"
      aria-hidden="true"
    >
      <div className="process-stack__chrome">
        <span className="process-stack__kicker">How I build</span>
        <span className="process-stack__meta">5 layers</span>
      </div>

      <div className="process-stack__stage">
        <div className="process-stack__parallax process-stack__parallax--a" />
        <div className="process-stack__parallax process-stack__parallax--b" />

        <div className="process-stack__rig">
          {processLayers.map((layer, i) => (
            <article
              key={layer.id}
              className="process-slab process-plate"
              data-i={i}
              data-id={layer.id}
              style={{
                "--i": i,
                "--plate": layer.color,
                zIndex: i + 1,
              }}
            >
              <div className="process-slab__shell">
                <div className="process-slab__core">
                  <span className="process-slab__idx">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="process-slab__copy">
                    <h3 className="process-slab__label process-plate__label">
                      {layer.label}
                    </h3>
                    <p className="process-slab__short">{layer.short}</p>
                  </div>
                  <span className="process-slab__edge" aria-hidden="true" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="process-stack__hint">Scroll to open the stack</p>
    </div>
  );
}
