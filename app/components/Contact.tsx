import { site } from "../content";

function ArrowIcon() {
  return (
    <span className="arrow" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Contact() {
  const c = site.contact;
  return (
    <footer className="contact" id="contact" aria-labelledby="contact-title">
      <div className="blob-contact" aria-hidden="true" />
      <div className="blob-grain" aria-hidden="true" />

      <div className="container">
        <div className="ct-top">
          <h2 id="contact-title" className="ct-head balance">
            {c.headline}
          </h2>
          <div className="ct-right">
            <p className="ct-sub">{c.subline}</p>
            <div className="ct-links">
              {site.socials.map((s, i) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={i === 0 ? "ct-btn ct-btn--primary" : "ct-btn"}
                >
                  {s.label}
                  <ArrowIcon />
                </a>
              ))}
              <a href={site.experience.resume} download className="ct-btn">
                Résumé (PDF)
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="ct-big-wrap" aria-hidden="true">
        <div className="ct-big">{site.brand}</div>
      </div>

      <div className="container">
        <div className="ct-foot">
          <span>{c.copyright}</span>
          <a href="#home">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
