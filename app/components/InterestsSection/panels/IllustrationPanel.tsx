"use client";

import { useEffect, useRef, useState } from "react";
import { PerspectiveCarousel } from "@/components/ui/perspective-carousel";

// Kalp's own paintings and drawings, in /public/art.
const PAINTINGS = [
  { file: "radha-krishna.jpg", w: 1199, h: 626, title: "Radha Krishna" },
  { file: "krishna.jpg", w: 1290, h: 1046, title: "Krishna" },
  { file: "radha.jpg", w: 1290, h: 1046, title: "Radha" },
  { file: "radha-krishna-doodle.jpg", w: 1400, h: 973, title: "Radha and Krishna, doodle" },
  { file: "vishwaroop.jpg", w: 1400, h: 973, title: "Vishwaroop" },
  { file: "hand-touch.jpg", w: 1400, h: 1400, title: "The Touch" },
  { file: "radha-krishna-minimal.jpg", w: 1400, h: 788, title: "Radha and Krishna, minimal" },
];

const src = (f: string) => `/art/${f.replace(/\.jpg$/, ".webp")}`;

export default function IllustrationPanel() {
  const items = PAINTINGS.map((p) => ({ src: src(p.file), title: p.title, width: p.w, height: p.h }));

  // The carousel sizes via fixed pixel props, so match them to the viewport:
  // a 480px slide overflows (and clips) a phone screen. Track a mobile breakpoint.
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 820);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // The 3D carousel is costly to start, so it waits until the section is
  // close to the screen. Until then (and without JS) the middle painting
  // stands in its place at the same height.
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "900px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const height = mobile ? "clamp(430px, 64vh, 580px)" : "clamp(600px, 86vh, 900px)";
  const middle = items[Math.floor(items.length / 2)];

  if (!near) {
    return (
      <div className="ill" ref={ref}>
        <div style={{ height, display: "grid", placeItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={middle.src}
            alt={middle.title}
            width={middle.width}
            height={middle.height}
            loading="lazy"
            decoding="async"
            style={{ width: mobile ? 250 : 480, height: "auto", borderRadius: 14 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="ill" ref={ref}>
      <PerspectiveCarousel
        items={items}
        defaultActiveIndex={Math.floor(items.length / 2)}
        slideWidth={mobile ? 250 : 480}
        rotationStep={mobile ? 52 : 48}
        inactiveScale={0.86}
        naturalSize
        height={height}
      />
    </div>
  );
}
