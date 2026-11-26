"use client";

import { useEffect, useRef } from "react";
import { site } from "../content";

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <span className="arrow" aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function AboutMe() {
  const t = site.intro;
  const travelRef = useRef<HTMLDivElement>(null);
  const aboutSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const travel = travelRef.current;
    const aboutSlot = aboutSlotRef.current;
    const heroSlot = document.getElementById("introSlotHero");
    if (!travel || !aboutSlot || !heroSlot) return;

    const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    // ease-in-out cubic — calm acceleration into the centered resting state
    const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

    let raf = 0;
    let alive = true;
    let active = false;

    // The travel only runs on wide enough viewports with motion allowed.
    // Below that we leave the static fallback photos in place.
    const enabled = () => !RM && window.innerWidth >= 768;

    const setActive = (on: boolean) => {
      if (on === active) return;
      active = on;
      document.documentElement.classList.toggle("intro-travel-on", on);
    };

    const tick = () => {
      if (!alive) return;
      if (!enabled()) {
        setActive(false);
        raf = requestAnimationFrame(tick);
        return;
      }
      setActive(true);

      const heroRect = heroSlot.getBoundingClientRect();
      const aboutRect = aboutSlot.getBoundingClientRect();
      const vh = window.innerHeight;
      const sy = window.scrollY || document.documentElement.scrollTop;

      // Start = hero slot's resting viewport position (constant: top + scrollY).
      const sLeft = heroRect.left;
      const sTop = heroRect.top + sy;
      const sW = heroRect.width;
      const sH = heroRect.height;

      // The scroll position at which the about slot sits centered in the viewport.
      const aboutDocCenter = aboutRect.top + sy + aboutRect.height / 2;
      const targetScroll = Math.max(1, aboutDocCenter - vh / 2);
      const p = clamp(sy / targetScroll, 0, 1);
      const e = ease(p);

      let left: number, top: number, w: number, h: number, ry: number;
      if (sy <= targetScroll) {
        // Phase 1: pinned lerp from hero slot → centered about slot, growing,
        // with one full smooth flip about the vertical (Y) axis along the way.
        const eLeft = aboutRect.left;
        const eTop = vh / 2 - aboutRect.height / 2;
        left = lerp(sLeft, eLeft, e);
        top = lerp(sTop, eTop, e);
        w = lerp(sW, aboutRect.width, e);
        h = lerp(sH, aboutRect.height, e);
        // Front (colour photo) at the hero → back (B&W profile card) centered:
        // 0° shows the front face, 180° shows the back, flipping as you scroll.
        ry = e * 180;
      } else {
        // Phase 2: landed on the profile card (back face) — track the about slot.
        left = aboutRect.left;
        top = aboutRect.top;
        w = aboutRect.width;
        h = aboutRect.height;
        ry = 180;
      }

      // Flat rotateY (no perspective) keeps the image an undistorted rectangle —
      // it compresses uniformly as it turns instead of skewing into a trapezoid.
      // Whole pixels keep the photo crisp: a fractional offset makes the
      // browser resample it. At rest (no flip) skip the 3D rotation too, so
      // the card is drawn as a plain image rather than a 3D layer.
      const x = Math.round(left);
      const y = Math.round(top);
      travel.style.transform =
        ry < 0.5 ? `translate(${x}px, ${y}px)` : `translate3d(${x}px, ${y}px, 0) rotateY(${ry.toFixed(1)}deg)`;
      travel.style.width = `${Math.round(w)}px`;
      travel.style.height = `${Math.round(h)}px`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("intro-travel-on");
    };
  }, []);

  return (
    <>
      {/* Fixed traveling flip-card — JS positions/rotates it between the two
          slots. Two faces: colour photo (front) → B&W photo (back). */}
      <div ref={travelRef} className="intro-photo-travel" aria-hidden="true">
        <div className="intro-face intro-face-front">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.photo} alt="" decoding="async" />
        </div>
        <div className="intro-face intro-face-back">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.photoBw} alt="" decoding="async" />
        </div>
      </div>

      <section className="section about-me" id="about" aria-label="About me">
        <div className="container">
          <div className="am-grid">
            <div className="am-col am-left">
              <h2 className="am-greeting reveal">{t.greeting}</h2>
              <p className="am-lead reveal balance">{t.lead}</p>
            </div>

            {/* Resting slot for the traveling card. The static B&W photo is the
                no-JS / reduced-motion / mobile fallback (hidden while the
                travel is active, since the traveling card lands here). */}
            <div className="am-photo-slot" id="introSlotAbout" ref={aboutSlotRef}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.photoBw} alt={t.photoAlt} decoding="async" />
            </div>

            <div className="am-col am-right">
              {t.body.map((para, i) => (
                <p key={i} className="am-body reveal" style={{ transitionDelay: `${i * 90}ms` }}>
                  {para}
                </p>
              ))}
              <a className="link-cta am-cta reveal" href={t.ctaHref}>
                {t.ctaLabel}
                <ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
