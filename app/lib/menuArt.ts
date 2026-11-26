// ─────────────────────────────────────────────────────────────────────────
// Minimal, theme-matched tiles for the FlowingMenu hover marquee.
// Each is an inline SVG data-URI (no network request) on the dark surface
// gradient with a single warm pink→amber accent motif — one glyph per section.
// ─────────────────────────────────────────────────────────────────────────

const wrap = (inner: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="64" viewBox="0 0 200 64">' +
      "<defs>" +
        '<linearGradient id="s" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#1a1a20"/>' +
          '<stop offset="1" stop-color="#09090b"/>' +
        "</linearGradient>" +
        '<linearGradient id="a" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0" stop-color="#ff5b8a"/>' +
          '<stop offset="1" stop-color="#f59e0b"/>' +
        "</linearGradient>" +
      "</defs>" +
      '<rect width="200" height="64" fill="url(#s)"/>' +
      inner +
    "</svg>"
  );

// glyphs are kept within y 12–52 so the pill's cover-crop never clips them.
export const menuArt: Record<string, string> = {
  home: wrap(
    '<circle cx="100" cy="26" r="11" fill="none" stroke="url(#a)" stroke-width="3"/>' +
    '<path d="M48 47 H152" stroke="url(#a)" stroke-width="3" stroke-linecap="round"/>'
  ),
  projects: wrap(
    '<g fill="url(#a)">' +
      '<rect x="74" y="34" width="12" height="14" rx="3"/>' +
      '<rect x="94" y="26" width="12" height="22" rx="3"/>' +
      '<rect x="114" y="16" width="12" height="32" rx="3"/>' +
    "</g>"
  ),
  experience: wrap(
    '<g fill="none" stroke="url(#a)" stroke-width="3" stroke-linecap="round"><path d="M60 32 H140"/></g><g fill="url(#a)"><circle cx="72" cy="32" r="6"/><circle cx="100" cy="32" r="6"/><circle cx="128" cy="32" r="6"/></g>'
  ),
  interests: wrap(
    '<g fill="none" stroke="url(#a)" stroke-width="3"><rect x="84" y="16" width="32" height="32" rx="4"/><path d="M84 32 H116 M100 16 V48"/></g>'
  ),
  contact: wrap(
    '<g fill="none" stroke="url(#a)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M82 48 L126 20"/>' +
      '<path d="M100 18 H128 V44"/>' +
    "</g>"
  ),
};

export const menuArtFor = (label: string) => menuArt[label] ?? menuArt.home;
