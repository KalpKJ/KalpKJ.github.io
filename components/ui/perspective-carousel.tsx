"use client";

import * as React from "react";
import { motion, type Transition } from "framer-motion";

export interface PerspectiveCarouselItem {
  src: string;
  title: string;
  alt?: string;
}

export interface PerspectiveCarouselProps {
  items: PerspectiveCarouselItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  loop?: boolean;
  slideWidth?: number;
  rotationStep?: number;
  inactiveScale?: number;
  transition?: Transition;
  showControls?: boolean;
  showDots?: boolean;
  height?: number | string;
  /** Show each image at its real proportions (height follows aspect ratio)
   *  instead of cropping every slide to a uniform 3:4. */
  naturalSize?: boolean;
  className?: string;
}

const DEFAULT_TRANSITION: Transition = { type: "spring", bounce: 0.14, duration: 0.9 };
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

function Chevron({ dir }: { dir: "l" | "r" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "l" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ctrlBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  borderRadius: 999,
  color: "inherit",
  background: "none",
  border: 0,
  transition: "background-color .25s var(--ease-out), color .25s var(--ease-out)",
};

/**
 * Perspective carousel adapted from vengenceui to this project: Tailwind /
 * lucide / cn are replaced with inline styles + design tokens so it renders
 * without the (unused) Tailwind utility layer, in the site's dark style.
 */
export function PerspectiveCarousel({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  loop = false,
  slideWidth = 200,
  rotationStep = 60,
  inactiveScale = 0.85,
  transition = DEFAULT_TRANSITION,
  showControls = true,
  showDots = true,
  height = "100%",
  naturalSize = false,
  className,
}: PerspectiveCarouselProps) {
  const maxIndex = Math.max(0, items.length - 1);
  const [uncontrolled, setUncontrolled] = React.useState(() => clamp(defaultActiveIndex, 0, maxIndex));
  const current = clamp(activeIndex ?? uncontrolled, 0, maxIndex);
  const sw = Math.max(96, slideWidth);
  const iScale = clamp(inactiveScale, 0.5, 1);

  const select = React.useCallback(
    (next: number) => {
      if (!items.length) return;
      const resolved = loop ? (next + items.length) % items.length : clamp(next, 0, maxIndex);
      if (activeIndex === undefined) setUncontrolled(resolved);
      onActiveIndexChange?.(resolved);
    },
    [activeIndex, items.length, loop, maxIndex, onActiveIndexChange]
  );

  if (!items.length) return null;

  const prevDisabled = !loop && current === 0;
  const nextDisabled = !loop && current === maxIndex;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      select(current - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      select(current + 1);
    }
  };

  // Touch / pointer swipe: drag horizontally to move between slides. A swipe
  // sets `suppressClick` so it doesn't also fire the tapped card's onClick.
  const dragRef = React.useRef<{ x: number; y: number } | null>(null);
  const suppressClick = React.useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    suppressClick.current = false;
    dragRef.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) {
      suppressClick.current = true;
      select(current + (dx < 0 ? 1 : -1));
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Artwork carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={className}
      style={{ position: "relative", isolation: "isolate", height, width: "100%", overflow: "hidden", outline: "none", touchAction: "pan-y" }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", perspective: "1200px" }}>
        <motion.div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            display: "flex",
            width: "max-content",
            alignItems: "center",
            y: "-50%",
          }}
          animate={{ x: -(current * sw + sw / 2) }}
          transition={transition}
        >
          {items.map((item, index) => {
            const isActive = current === index;
            return (
              <div key={`${item.src}-${index}`} style={{ flexShrink: 0, width: sw, perspective: "1200px" }}>
                <motion.div
                  style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                  }}
                  animate={{ rotateY: (current - index) * rotationStep, scale: isActive ? 1 : iScale }}
                  transition={transition}
                >
                  <button
                    type="button"
                    aria-label={`Show ${item.title}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => {
                      if (suppressClick.current) return;
                      select(index);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      cursor: "pointer",
                      padding: 0,
                      border: 0,
                      background: "none",
                      lineHeight: 0,
                      ...(naturalSize ? {} : { aspectRatio: "3 / 4" }),
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.alt ?? item.title}
                      draggable={false}
                      style={{
                        width: "100%",
                        height: naturalSize ? "auto" : "100%",
                        objectFit: naturalSize ? "contain" : "cover",
                        userSelect: "none",
                        borderRadius: 14,
                        border: "1px solid var(--hairline-strong)",
                        boxShadow: "0 1px 0 rgba(255,255,255,.08) inset, 0 30px 60px -30px rgba(0,0,0,.8)",
                      }}
                    />
                  </button>

                  <motion.p
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: 13,
                      letterSpacing: "-.01em",
                      color: "var(--fg-2)",
                      margin: 0,
                    }}
                    animate={{ filter: isActive ? "blur(0px)" : "blur(2px)", opacity: isActive ? 1 : 0 }}
                    transition={transition}
                  >
                    {item.title}
                  </motion.p>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {showControls && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 18,
            zIndex: 10,
            margin: "0 auto",
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            borderRadius: 999,
            border: "1px solid var(--hairline)",
            background: "rgba(255,255,255,.04)",
            backdropFilter: "blur(10px)",
            padding: "6px 10px",
            color: "var(--fg-2)",
          }}
        >
          <button
            type="button"
            aria-label="Show previous artwork"
            disabled={prevDisabled}
            onClick={() => select(current - 1)}
            style={{ ...ctrlBtn, opacity: prevDisabled ? 0.3 : 1, cursor: prevDisabled ? "not-allowed" : "pointer" }}
          >
            <Chevron dir="l" />
          </button>

          {showDots && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {items.map((it, index) => {
                const on = current === index;
                return (
                  <button
                    key={`${it.title}-${index}`}
                    type="button"
                    aria-label={`Show ${it.title}`}
                    aria-current={on ? "true" : undefined}
                    onClick={() => select(index)}
                    style={{
                      height: 8,
                      width: on ? 28 : 8,
                      borderRadius: 999,
                      padding: 0,
                      border: 0,
                      cursor: "pointer",
                      background: on ? "var(--accent)" : "rgba(255,255,255,.35)",
                      transition: "width .3s var(--ease-out), background-color .3s var(--ease-out)",
                    }}
                  />
                );
              })}
            </div>
          )}

          <button
            type="button"
            aria-label="Show next artwork"
            disabled={nextDisabled}
            onClick={() => select(current + 1)}
            style={{ ...ctrlBtn, opacity: nextDisabled ? 0.3 : 1, cursor: nextDisabled ? "not-allowed" : "pointer" }}
          >
            <Chevron dir="r" />
          </button>
        </div>
      )}
    </div>
  );
}

export default PerspectiveCarousel;
