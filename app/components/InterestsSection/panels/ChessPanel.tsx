"use client";

import { AnimatePresence, motion } from "framer-motion";
import { EASE_SETTLE, EASE_SNAP } from "../anim";
import { colorOf, pieceGlyph, squareToXY, useChessPuzzle } from "../hooks/useChessPuzzle";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

// Grid squares in render order. Flipped puts rank 1 on top and file h on the
// left (180° rotation) so the board reads from the black solver's side.
function orderedSquares(flip: boolean): string[] {
  const out: string[] = [];
  if (flip) {
    for (let r = 1; r <= 8; r++) for (let f = 7; f >= 0; f--) out.push(FILES[f] + r);
  } else {
    for (let r = 8; r >= 1; r--) for (let f = 0; f < 8; f++) out.push(FILES[f] + r);
  }
  return out;
}

export default function ChessPanel() {
  const g = useChessPuzzle();
  const SQUARES = orderedSquares(g.flip);

  return (
    <div className="chess">
      <div className="chess-boardwrap">
        <motion.div
          className="chess-bloom"
          aria-hidden="true"
          animate={{ opacity: g.isCheckmate ? 1 : 0 }}
          transition={{ duration: 1.2, ease: EASE_SETTLE }}
        />
        <div className="chess-board" role="grid" aria-label="Chess puzzle board">
          {SQUARES.map((sq) => {
            const f = sq.charCodeAt(0) - 97;
            const r = parseInt(sq[1], 10);
            const light = (f + r) % 2 === 0;
            const isDot = g.legalDots.includes(sq);
            return (
              <button
                key={sq}
                className={`chess-sq ${light ? "is-light" : "is-dark"}`}
                onClick={() => g.onSquareClick(sq)}
                tabIndex={-1}
                aria-label={sq}
              >
                {isDot && <span className="chess-dot" />}
              </button>
            );
          })}

          {/* pieces layer */}
          <AnimatePresence>
            {g.pieces.map((p) => {
              const { x, y } = squareToXY(p.square, g.flip);
              const selected = g.selected === p.square;
              const dimmed = g.selected !== null && !selected;
              const glowing = g.glow === p.square && g.status === "userTurn" && !g.selected;
              const matedKing = g.isMate && p.square === g.matedSquare && p.type.endsWith("K");
              const bouncing = g.bounce === p.square;
              return (
                <motion.button
                  key={p.id}
                  layout
                  className={`chess-piece${selected ? " is-selected" : ""}${glowing ? " is-glow" : ""}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => g.onSquareClick(p.square)}
                  initial={{ opacity: 0 }}
                  animate={
                    matedKing
                      ? { opacity: 1, rotate: 60, y: 4, scale: 1 }
                      : bouncing
                        ? { opacity: 1, x: [0, 4, -4, 0], scale: 1 }
                        : { opacity: dimmed ? 0.5 : 1, scale: selected ? 1.08 : 1, rotate: 0, x: 0, y: 0 }
                  }
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={
                    matedKing
                      ? { duration: 0.6, ease: EASE_SETTLE }
                      : bouncing
                        ? { duration: 0.24, ease: "easeOut" }
                        : { duration: 0.28, ease: EASE_SNAP }
                  }
                  aria-label={`${colorOf(p.type)} ${p.type[1]} on ${p.square}`}
                >
                  <span className={colorOf(p.type) === "white" ? "pc-w" : "pc-b"}>{pieceGlyph(p.type)}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <aside className="chess-info mono">
        <div className="chess-meta">
          <span className="chess-k">HOW I PLAY</span>
          <span className="chess-v">Casual · for fun</span>
        </div>
        <div className="chess-meta">
          <span className="chess-k">GO-TO OPENING</span>
          <span className="chess-v">King&apos;s Indian</span>
        </div>
        <div className="chess-meta">
          <span className="chess-k">PUZZLE</span>
          <span className="chess-v">
            {g.puzzleIndex + 1} / {g.total}
          </span>
        </div>
        <div className="chess-meta">
          <span className="chess-k">STATUS</span>
          <span className="chess-v" style={{ color: g.isCheckmate ? "#ff5b8a" : undefined }}>
            {g.statusText}
          </span>
        </div>

        <div className="chess-label">{g.puzzle.label}</div>

        <div className="chess-moves">
          {g.moves.map((m, i) => (
            <span
              key={i}
              className={`chess-move chess-move--${m.state}`}
            >
              {m.state === "current" && g.wrong ? "—" : `${m.glyph}${m.to}${m.mark}`}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {g.isCheckmate && (
            <motion.button
              className="chess-next"
              onClick={g.nextPuzzle}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: EASE_SETTLE }}
            >
              NEXT <span aria-hidden="true">→</span>
            </motion.button>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}
