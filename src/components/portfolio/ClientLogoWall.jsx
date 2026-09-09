import { companyLogos } from "../../data/profile.jsx";
import { cn } from "../../lib/utils.js";

/**
 * Logo-only strip for employers and client brands.
 * Visible labels are intentionally omitted (alt text carries the name).
 */
export default function ClientLogoWall() {
  return (
    <section className="client-logos" aria-labelledby="client-logos-heading">
      <div className="wrap client-logos__inner">
        <h2 id="client-logos-heading" className="client-logos__heading">
          Companies and clients
        </h2>
        <ul className="client-logos__grid">
          {companyLogos.map((item) => (
            <li key={item.id}>
              <span
                className={cn(
                  "client-logos__tile",
                  item.tone === "dark" && "client-logos__tile--dark"
                )}
              >
                <img
                  src={item.src}
                  alt={item.name}
                  width={160}
                  height={64}
                  loading="lazy"
                  decoding="async"
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
