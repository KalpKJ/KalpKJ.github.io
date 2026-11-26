"use client";

import { motion } from "framer-motion";
import { EASE_SETTLE } from "../anim";

// Text only: official posters belong to their studios, so they aren't published here.
const ANIME = [
  { title: "Attack on Titan", status: "Finished", started: "2024", rating: 5, note: "The bar for a storytelling payoff." },
  { title: "Hunter × Hunter", status: "Finished", started: "2024", rating: 5, note: "The most nuanced power system in anime." },
  { title: "One Piece", status: "Ongoing", started: "2022", rating: 5, note: "A thousand chapters, still climbing." },
  { title: "Naruto", status: "Rewatching", started: "2023", rating: 5, note: "The one that started it all for me." },
  { title: "Demon Slayer", status: "Finished", started: "2025", rating: 5, note: "Every frame a painting." },
  { title: "Haikyuu!!", status: "Finished", started: "2025", rating: 5, note: "Made me care about volleyball." },
  { title: "Jujutsu Kaisen", status: "Caught up", started: "2026", rating: 4, note: "Animation that rewrites the ceiling." },
  { title: "My Hero Academia", status: "Finished", started: "2023", rating: 4, note: "Peak shonen before the ending arc." },
];

function Rating({ value }: { value: number }) {
  return (
    <span className="anime-rating" role="img" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < value ? "on" : undefined} />
      ))}
    </span>
  );
}

export default function AnimePanel() {
  return (
    <div className="anime">
      <ol className="anime-list">
        {ANIME.map((a, i) => (
          <motion.li
            key={a.title}
            className="anime-item"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_SETTLE, delay: 0.04 * i }}
          >
            <span className="anime-title">{a.title}</span>
            <span className="anime-note">{a.note}</span>
            <span className="anime-meta mono">
              {a.status}, since {a.started}
            </span>
            <Rating value={a.rating} />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
