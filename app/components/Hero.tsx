import { site } from "../content";

export function Hero() {
  const h = site.hero;
  return (
    <section className="hero" id="home" aria-label="Intro">
      <div className="blob-hero" aria-hidden="true" />
      {/* Darkens the centre of the gradient so the name always reads. */}
      <div className="hero-scrim" aria-hidden="true" />

      {/* The name sits on the viewport's centre line. #heroInner gets its own
          element so the scroll parallax transform never fights the centring. */}
      <div className="hero-headline-layer">
        <div className="hero-inner" id="heroInner">
          <h1 className="hero-title">{h.name}</h1>
          <p className="hero-line balance">{h.line}</p>
        </div>
      </div>

      {/* Resting place for the portrait. AboutMe moves a fixed copy of it from
          here into the About section on scroll; this image is the fallback
          for phones and reduced motion. */}
      <div className="intro-photo-slot" id="introSlotHero" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={site.intro.photo} alt="" width={900} height={1200} fetchPriority="high" decoding="async" />
      </div>

      <span className="hero-meta hero-meta--r mono" aria-hidden="true">
        {h.place}
      </span>
    </section>
  );
}
