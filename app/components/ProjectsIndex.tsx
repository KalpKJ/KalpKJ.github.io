"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { site, type OtherProject, type Project } from "../content";
import "./ProjectsIndex.css";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const projects = site.portfolio.projects;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Links({ p }: { p: Project | OtherProject }) {
  if (!p.href && !p.code) return null;
  return (
    <div className="pjx-links">
      {p.href && (
        <a className="pjx-visit" href={p.href} target="_blank" rel="noreferrer">
          Visit {p.name} <Arrow />
        </a>
      )}
      {p.code && (
        <a className="pjx-visit" href={p.code} target="_blank" rel="noreferrer">
          Code on GitHub <Arrow />
        </a>
      )}
    </div>
  );
}

function Tags({ p }: { p: Project | OtherProject }) {
  return (
    <ul className="pjx-tags" aria-label="Built with">
      {p.tags.map((t) => (
        <li key={t} className="pjx-chip mono">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function ProjectsIndex() {
  const [active, setActive] = useState(0);
  const cur = projects[active];

  return (
    <MotionConfig reducedMotion="user">
      <section className="pjx section" id="portfolio" aria-labelledby="projects-title">
        <div className="container">
          <header className="pjx-head">
            <h2 id="projects-title" className="pjx-title balance">
              {site.portfolio.title}
            </h2>
          </header>

          <div className="pjx-grid">
            {/* The list drives one preview: hover, focus or tap a row to show it. */}
            <div className="pjx-list">
              {projects.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  className={`pjx-row${i === active ? " on" : ""}`}
                  aria-pressed={i === active}
                  aria-controls="pjx-preview"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <span className="pjx-num mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pjx-name">{p.name}</span>
                  <span className="pjx-cat mono">{p.kind}</span>
                </button>
              ))}
            </div>

            <div className="pjx-preview" id="pjx-preview" aria-live="polite">
              <div className="pjx-frame">
                {projects.map((p, i) =>
                  p.image ? (
                    <div key={p.name} className={`pjx-imgLayer${i === active ? " on" : ""}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={i === active ? p.alt : ""} loading="lazy" decoding="async" />
                    </div>
                  ) : (
                    <div key={p.name} className={`pjx-imgLayer pjx-noimg${i === active ? " on" : ""}`}>
                      <span className="pjx-noimg-name">{p.name}</span>
                      <span className="mono">Not published, so no screenshot</span>
                    </div>
                  ),
                )}
              </div>

              <div className="pjx-body">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: EASE }}
                  >
                    <h3 className="pjx-yearcat mono">
                      {cur.name} · {cur.year}
                    </h3>
                    <p className="pjx-desc">{cur.description}</p>
                    <Tags p={cur} />
                    <Links p={cur} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Phones get a plain stack: a pinned preview would cover the list. */}
          <ol className="pjx-stack">
            {projects.map((p, i) => (
              <li key={p.name} className="pjx-item">
                <div className="pjx-frame">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.alt} loading="lazy" decoding="async" />
                  ) : (
                    <div className="pjx-noimg">
                      <span className="pjx-noimg-name">{p.name}</span>
                      <span className="mono">Not published, so no screenshot</span>
                    </div>
                  )}
                </div>
                <h3 className="pjx-item-name">
                  <span className="pjx-num mono">{String(i + 1).padStart(2, "0")}</span> {p.name}
                </h3>
                <p className="pjx-yearcat mono">
                  {p.kind} · {p.year}
                </p>
                <p className="pjx-desc">{p.description}</p>
                <Tags p={p} />
                <Links p={p} />
              </li>
            ))}
          </ol>

          {/* Smaller personal projects: links only, no screenshots. */}
          <div className="pjx-other">
            <h3 className="pjx-other-title">Other projects</h3>
            <ul className="pjx-other-list">
              {site.otherProjects.map((p) => (
                <li key={p.name} className="pjx-other-item">
                  <h4 className="pjx-other-name">{p.name}</h4>
                  <p className="pjx-desc">{p.description}</p>
                  <Tags p={p} />
                  <Links p={p} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

export default ProjectsIndex;
