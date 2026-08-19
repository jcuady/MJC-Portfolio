import { industries } from "../../data/profile.jsx";

export default function IndustryPlaceholderStrip() {
  return (
    <aside className="industry-strip" aria-label="Industries and platforms. Placeholder marks, not client logos.">
      <p>Selected industries and platforms. Placeholder marks only, not client endorsements.</p>
      <ul>
        {industries.map((item) => (
          <li key={item.id}>
            <span className={`industry-mark industry-mark--${item.mark}`} aria-hidden="true" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
