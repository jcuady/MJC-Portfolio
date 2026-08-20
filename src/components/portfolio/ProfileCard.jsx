import { Code2, PenTool, Zap, RefreshCw, ListChecks } from "lucide-react";
import { heroRoles } from "../../data/profile.jsx";
import BrandLogo from "./BrandLogo.jsx";

const roleIcons = [Code2, PenTool, Zap, RefreshCw, ListChecks];

export default function ProfileCard() {
  return (
    <article className="bento-card profile-card">
      <div className="profile-card__top">
        <BrandLogo compact className="profile-card__mark" />
        <h2 className="profile-name">
          <span>Malcolm</span>
          <span>Joaquin</span>
          <span className="profile-name__accent">Cuady</span>
        </h2>
        <ul className="profile-roles">
          {heroRoles.map((role, i) => {
            const Icon = roleIcons[i] || Code2;
            return (
              <li key={role}>
                <Icon size={12} strokeWidth={1.75} aria-hidden="true" />
                {role}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="hero-portrait profile-card__shot">
        <img
          src="/brand/portrait.webp"
          alt="Portrait of Malcolm Joaquin Cuady"
          width={900}
          height={1125}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="profile-card__avail">
        <p>
          <span className="hero-pill__dot" aria-hidden="true" />
          Open to opportunities
        </p>
        <span>Full-time · Contract · Project-based</span>
      </div>
    </article>
  );
}
