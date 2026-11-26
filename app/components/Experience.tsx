import { site } from "../content";

export function Experience() {
  const e = site.experience;
  return (
    <section className="section xp" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <h2 id="experience-title" className="xp-title balance">
          {e.title}
        </h2>

        <ol className="xp-list">
          {e.items.map((item) => (
            <li key={item.org} className="xp-item">
              <span className="xp-when mono">{item.when}</span>
              <div className="xp-what">
                <h3 className="xp-role">
                  {item.role},{" "}
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.org}
                    </a>
                  ) : (
                    item.org
                  )}
                </h3>
                <p className="xp-note">{item.note}</p>
              </div>
            </li>
          ))}
        </ol>

        <a className="link-cta xp-resume" href={e.resume} download>
          {e.resumeLabel}
          <span className="arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}
