"use client";

import { useEffect, useState } from "react";
import { PerspectiveCarousel } from "@/components/ui/perspective-carousel";

// Kalp's own paintings and drawings, in /public/art.
const PAINTINGS = [
  { file: "radha-krishna.jpg", title: "Radha Krishna" },
  { file: "krishna.jpg", title: "Krishna" },
  { file: "radha.jpg", title: "Radha" },
  { file: "radha-krishna-doodle.jpg", title: "Radha and Krishna, doodle" },
  { file: "vishwaroop.jpg", title: "Vishwaroop" },
  { file: "hand-touch.jpg", title: "The Touch" },
  { file: "radha-krishna-minimal.jpg", title: "Radha and Krishna, minimal" },
];

const src = (f: string) => `/art/${f.replace(/\.jpg$/, ".webp")}`;

export default function IllustrationPanel() {
  const items = PAINTINGS.map((p) => ({ src: src(p.file), title: p.title }));

  // The carousel sizes via fixed pixel props, so match them to the viewport:
  // a 480px slide overflows (and clips) a phone screen. Track a mobile breakpoint.
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 820);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="ill">
      <PerspectiveCarousel
        items={items}
        defaultActiveIndex={Math.floor(items.length / 2)}
        slideWidth={mobile ? 250 : 480}
        rotationStep={mobile ? 52 : 48}
        inactiveScale={0.86}
        naturalSize
        height={mobile ? "clamp(430px, 64vh, 580px)" : "clamp(600px, 86vh, 900px)"}
      />
    </div>
  );
}
