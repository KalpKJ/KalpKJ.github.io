"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "../content";
import FlowingMenu from "./FlowingMenu";
import { menuArtFor } from "../lib/menuArt";

const menuItems = site.menu.map((m) => ({
  link: m.href,
  text: m.label,
  image: menuArtFor(m.label),
}));

export function Header() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // condense header on scroll
  useEffect(() => {
    const onScroll = () => setCondensed((window.scrollY || 0) > 24);
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  // scroll lock + focus management when overlay open
  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => closeBtnRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
    document.body.style.overflow = "";
    lastFocus.current?.focus?.();
  }, [open]);

  // escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`header${condensed ? " condensed" : ""}`} id="siteHeader">
        <a href="#home" className="brand" aria-label={`${site.brand}, back to top`}>
          {site.brand}
        </a>
        <button
          ref={openBtnRef}
          className="menu-btn"
          aria-expanded={open}
          aria-controls="overlay"
          onClick={() => setOpen(true)}
        >
          menu
        </button>
      </header>

      <div
        className={`overlay${open ? " open" : ""}`}
        id="overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        inert={!open}
      >
        {/* Staggered curtain layers — slide down from the top ahead of the dark
            panel, leaving a brief colour wipe (accent pink → deep wine). */}
        <div className="overlay-prelayer p1" aria-hidden="true" />
        <div className="overlay-prelayer p2" aria-hidden="true" />

        <div className="overlay-panel">
          <div className="overlay-top">
            <button ref={closeBtnRef} className="close-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="overlay-flow" aria-label="Primary">
            <FlowingMenu
              items={menuItems}
              onItemClick={() => setOpen(false)}
              speed={18}
              bgColor="transparent"
              textColor="#f5f5f7"
              marqueeBgColor="#f4f4f5"
              marqueeTextColor="#08080a"
              borderColor="rgba(255,255,255,0.12)"
            />
          </div>

          <div className="overlay-socials">
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
