import { ArrowRight } from "lucide-react";
import { selectedWork } from "../../data/profile.jsx";

export default function SelectedWorkCard() {
  return (
    <article className="bento-card work-card">
      <div className="work-card__head">
        <h2>Selected Work</h2>
        <a href="#work">
          View all work
          <ArrowRight size={14} strokeWidth={1.75} />
        </a>
      </div>
      <ul className="work-card__grid">
        {selectedWork.map((project, index) => (
          <li key={project.name}>
            <a
              href={project.url || "#work"}
              {...(project.url ? { target: "_blank", rel: "noreferrer" } : {})}
              className="work-card__item group"
            >
              <span className="work-card__thumb">
                {project.preview ? (
                  <img
                    src={project.preview}
                    alt=""
                    width={640}
                    height={400}
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                ) : null}
              </span>
              <span className="work-card__meta">
                <span className="work-card__cat-row">
                  {project.logo ? (
                    <span className="work-card__logo" aria-hidden="true">
                      <img
                        src={project.logo}
                        alt=""
                        width={48}
                        height={24}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                  ) : null}
                  <span className="work-card__cat">{project.category}</span>
                </span>
                <strong>{project.name}</strong>
                <span className="work-card__desc">{project.desc}</span>
                <span className="work-card__tags">
                  {project.stack.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </span>
              </span>
              <ArrowRight className="work-card__arrow" size={16} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
