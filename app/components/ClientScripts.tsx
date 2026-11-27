"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function ClientScripts() {
  useEffect(() => {
    const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    const on = (
      target: Window | Document | HTMLElement,
      type: string,
      fn: EventListenerOrEventListenerObject,
      opts?: AddEventListenerOptions
    ) => {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    };

    // ── Scroll reveal ──
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // ── Scroll progress bar ──
    const prog = document.getElementById("prog");
    const onScrollProg = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (prog) prog.style.setProperty("--p", (h > 0 ? y / h : 0).toFixed(4));
    };
    on(document, "scroll", onScrollProg, { passive: true });
    onScrollProg();

    // ── Hero parallax (text drifts up and fades as you scroll past the hero) ──
    const heroInner = document.getElementById("heroInner");
    const heroEl = document.getElementById("home");

    const heroTick = () => {
      if (heroInner && heroEl) {
        const hr = heroEl.getBoundingClientRect();
        const y = -hr.top;
        if (y >= 0 && y <= window.innerHeight * 1.3) {
          heroInner.style.transform = `translate3d(0, ${(y * 0.42).toFixed(1)}px, 0)`;
          heroInner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.95)));
        }
      }
    };
    if (heroEl && !RM) {
      heroTick();
      on(document, "scroll", heroTick, { passive: true });
      on(window, "resize", heroTick);
    }

    // ── "Let's talk" parallax ──
    const ctBig = document.querySelector<HTMLElement>(".ct-big");
    const contactEl = document.getElementById("contact");
    if (ctBig && contactEl && !RM) {
      const ctTick = () => {
        const r = contactEl.getBoundingClientRect();
        const fromBottom = r.top - window.innerHeight;
        const lift = Math.max(0, fromBottom) * 0.18;
        const past = Math.min(0, -r.top * 0.06);
        ctBig.style.transform = `translate3d(0, ${(-lift + past).toFixed(1)}px, 0)`;
      };
      ctTick();
      on(document, "scroll", ctTick, { passive: true });
      on(window, "resize", ctTick);
    }

    // ── Lenis smooth scroll ──
    // It only smooths the mouse wheel, so touch screens keep native scrolling
    // and skip its per-frame loop.
    if (!RM && !matchMedia("(pointer: coarse)").matches) {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      let alive = true;
      let id = 0;
      const raf = (t: number) => {
        if (!alive) return;
        lenis.raf(t);
        id = requestAnimationFrame(raf);
      };
      id = requestAnimationFrame(raf);
      cleanups.push(() => cancelAnimationFrame(id));
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
        if (!a) return;
        const id = a.getAttribute("href") || "";
        if (id.length < 2) return;
        const t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          lenis.scrollTo(t as HTMLElement, { offset: -88 });
        }
      };
      on(document, "click", onClick as EventListener);
      cleanups.push(() => {
        alive = false;
        lenis.destroy();
      });
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
