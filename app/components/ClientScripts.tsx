"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function ClientScripts() {
  useEffect(() => {
    const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    const rafs: number[] = [];

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

    // ── Hero blob + about float pointer parallax ──
    if (!RM) {
      const blob = document.querySelector<HTMLElement>(".blob-hero");
      const floats = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
      let rmx = 0,
        rmy = 0;
      const move = (e: PointerEvent) => {
        rmx = e.clientX / window.innerWidth - 0.5;
        rmy = e.clientY / window.innerHeight - 0.5;
      };
      on(window, "pointermove", move as EventListener);
      let alive = true;
      const tick = () => {
        if (!alive) return;
        const ry = window.scrollY || 0;
        if (blob) blob.style.transform = `translate3d(${(rmx * 18).toFixed(1)}px, ${(-ry * 0.08 + rmy * 12).toFixed(1)}px, 0)`;
        floats.forEach((f) => {
          const k = parseFloat(f.dataset.parallax || "0.05");
          f.style.setProperty("--px", (rmx * 14 * (k * 10)).toFixed(1) + "px");
          f.style.setProperty("--py", (rmy * 10 * (k * 10)).toFixed(1) + "px");
        });
        rafs.push(requestAnimationFrame(tick));
      };
      rafs.push(requestAnimationFrame(tick));
      cleanups.push(() => {
        alive = false;
      });
    }

    // ── Lenis smooth scroll ──
    if (!RM) {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      let alive = true;
      const raf = (t: number) => {
        if (!alive) return;
        lenis.raf(t);
        rafs.push(requestAnimationFrame(raf));
      };
      rafs.push(requestAnimationFrame(raf));
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
      rafs.forEach((id) => cancelAnimationFrame(id));
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
