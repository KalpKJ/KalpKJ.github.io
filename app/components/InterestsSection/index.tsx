"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { indicatorTransition, panelVariants } from "./anim";
import type { Tag, TagId } from "./types";
import { site } from "../../content";
import IllustrationPanel from "./panels/IllustrationPanel";
import AnimePanel from "./panels/AnimePanel";
import ChessPanel from "./panels/ChessPanel";
import "./interests.css";

const TAGS: Tag[] = [
  { id: "illustration", name: "My art" },
  { id: "anime", name: "Anime" },
  { id: "chess", name: "Chess puzzle" },
];

function renderPanel(tag: TagId) {
  switch (tag) {
    case "illustration":
      return <IllustrationPanel />;
    case "anime":
      return <AnimePanel />;
    case "chess":
      return <ChessPanel />;
  }
}

export function InterestsSection() {
  const [active, setActive] = useState<TagId>("illustration");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys move between tabs, as the ARIA tabs pattern expects.
  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + TAGS.length) % TAGS.length;
    setActive(TAGS[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="off-the-clock" className="intr" aria-labelledby="interests-title">
        <div className="intr-wrap">
          <header className="intr-head">
            <h2 id="interests-title" className="intr-title">
              {site.interests.title}
            </h2>
          </header>

          <div className="intr-rail" role="tablist" aria-label="Interests">
            {TAGS.map((t, i) => {
              const isActive = t.id === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`tab-${t.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls="interests-panel"
                  tabIndex={isActive ? 0 : -1}
                  className={`intr-pill${isActive ? " is-active" : ""}`}
                  onClick={() => setActive(t.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  {isActive && (
                    <motion.span layoutId="tag-indicator" className="intr-pill-ind" transition={indicatorTransition} />
                  )}
                  <span className="intr-pill-label">{t.name}</span>
                </button>
              );
            })}
          </div>

          <div
            className="intr-stage"
            id="interests-panel"
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            data-panel={active}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                className="intr-panel"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderPanel(active)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

export default InterestsSection;
