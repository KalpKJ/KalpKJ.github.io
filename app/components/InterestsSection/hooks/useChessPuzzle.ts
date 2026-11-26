"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CHESS_PUZZLES } from "../data/chess-puzzles";
import type { ChessMove, PiecePlacement } from "../types";

// All pieces use the filled (black-fill) Unicode variants so they render as
// solid shapes. Color is handled via CSS — white pieces become cream, black
// pieces become near-black, both with a contrasting drop-shadow.
const GLYPH: Record<string, string> = {
  wK: "♚", wQ: "♛", wR: "♜", wB: "♝", wN: "♞", wP: "♟",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟",
};

export const pieceGlyph = (type: string) => GLYPH[type] ?? "";
export const colorOf = (type: string) => (type[0] === "w" ? "white" : "black");

/** Square ("e4") → top-left % within an 8×8 board. `flip` puts black at the
 *  bottom (180° rotation) so the board reads from the solver's side. */
export function squareToXY(square: string, flip = false) {
  const file = square.charCodeAt(0) - 97; // a → 0
  const rank = parseInt(square[1], 10); // 1–8
  return flip
    ? { x: (7 - file) * 12.5, y: (rank - 1) * 12.5 }
    : { x: file * 12.5, y: (8 - rank) * 12.5 };
}

let _pid = 0;
const buildPieces = (position: [string, string][]): PiecePlacement[] =>
  position.map(([type, square]) => ({ id: `p${_pid++}`, type, square }));

type MoveLabel = { glyph: string; to: string; mark: string };
function buildMoveLabels(
  position: [string, string][],
  solution: ChessMove[],
  outcome: "mate" | "win"
): MoveLabel[] {
  const map = new Map<string, string>();
  position.forEach(([t, s]) => map.set(s, t));
  return solution.map((m, i) => {
    const type = map.get(m.from) ?? "wP";
    map.delete(m.from);
    map.set(m.to, type);
    const last = i === solution.length - 1;
    // Only the final move of a genuine mate carries the "#" — crushing
    // material wins get no check/mate marks (we don't run an engine).
    return { glyph: GLYPH[type], to: m.to.toUpperCase(), mark: last && outcome === "mate" ? "#" : "" };
  });
}

type Status = "userTurn" | "autoReplies" | "checkmate";

export function useChessPuzzle() {
  const total = CHESS_PUZZLES.length;
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzle = CHESS_PUZZLES[puzzleIndex];
  const userColor = puzzle.toMove;

  const [pieces, setPieces] = useState<PiecePlacement[]>(() => buildPieces(puzzle.position));
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("userTurn");
  const [selected, setSelected] = useState<string | null>(null);
  const [legalDots, setLegalDots] = useState<string[]>([]);
  const [glow, setGlow] = useState<string | null>(puzzle.solution[0].from);
  const [bounce, setBounce] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);

  const labels = useMemo(
    () => buildMoveLabels(puzzle.position, puzzle.solution, puzzle.outcome),
    [puzzleIndex] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const timers = useRef<number[]>([]);
  const pushTimer = (id: number) => timers.current.push(id);
  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const doMove = useCallback((move: ChessMove) => {
    setPieces((prev) =>
      prev
        .filter((p) => p.square !== move.to) // capture
        .map((p) => (p.square === move.from ? { ...p, square: move.to } : p))
    );
  }, []);

  // Idle attention: glow cycles through the side-to-move's pieces every 3s.
  useEffect(() => {
    if (status !== "userTurn" || selected) return;
    const sqs = pieces.filter((p) => colorOf(p.type) === userColor).map((p) => p.square);
    if (sqs.length < 2) return;
    const id = window.setInterval(() => {
      setGlow((g) => sqs[(sqs.indexOf(g ?? "") + 1) % sqs.length]);
    }, 3000);
    return () => clearInterval(id);
  }, [status, selected, pieces, userColor]);

  const onSquareClick = useCallback(
    (square: string) => {
      if (status === "checkmate" || status === "autoReplies") return;
      const expected = puzzle.solution[step];
      const pieceHere = pieces.find((p) => p.square === square);

      // 1 — correct destination with the right piece selected
      if (selected === expected.from && square === expected.to) {
        doMove(expected);
        setSelected(null);
        setLegalDots([]);
        setGlow(null);
        const newStep = step + 1;
        setStep(newStep);

        if (newStep >= puzzle.solution.length) {
          setStatus("checkmate");
          return;
        }
        setStatus("autoReplies");
        pushTimer(
          window.setTimeout(() => {
            doMove(puzzle.solution[newStep]); // auto reply
            const ns2 = newStep + 1;
            setStep(ns2);
            if (ns2 >= puzzle.solution.length) {
              setStatus("checkmate");
            } else {
              setStatus("userTurn");
              setGlow(puzzle.solution[ns2].from);
            }
          }, 420)
        );
        return;
      }

      // 2 — selecting one of your own pieces
      if (pieceHere && colorOf(pieceHere.type) === userColor) {
        setSelected(square);
        setLegalDots(square === expected.from ? [expected.to] : []);
        setGlow(square);
        return;
      }

      // 3 — wrong destination while a piece is selected → bounce back
      if (selected) {
        setBounce(selected);
        setWrong(true);
        pushTimer(window.setTimeout(() => setBounce(null), 260));
        pushTimer(window.setTimeout(() => setWrong(false), 700));
        setSelected(null);
        setLegalDots([]);
        setGlow(expected.from);
      }
    },
    [status, puzzle, step, pieces, selected, userColor, doMove]
  );

  const nextPuzzle = useCallback(() => {
    clearTimers();
    const idx = (puzzleIndex + 1) % total;
    const p = CHESS_PUZZLES[idx];
    setPuzzleIndex(idx);
    setPieces(buildPieces(p.position));
    setStep(0);
    setSelected(null);
    setLegalDots([]);
    setBounce(null);
    setWrong(false);
    setStatus("userTurn");
    setGlow(p.solution[0].from);
  }, [puzzleIndex, total]);

  const oppColor = userColor === "white" ? "black" : "white";
  const statusText =
    status === "checkmate"
      ? puzzle.outcome === "mate"
        ? "CHECKMATE."
        : "WINNING."
      : status === "autoReplies"
        ? `${oppColor.toUpperCase()} REPLIES…`
        : step === 0
          ? `${userColor.toUpperCase()} TO MOVE`
          : "YOUR TURN";

  const moves = labels.map((l, i) => ({
    ...l,
    state: i < step ? "played" : i === step ? "current" : "upcoming",
  }));

  return {
    puzzle,
    puzzleIndex,
    total,
    pieces,
    selected,
    legalDots,
    glow,
    bounce,
    wrong,
    status,
    statusText,
    moves,
    isCheckmate: status === "checkmate",
    isMate: status === "checkmate" && puzzle.outcome === "mate",
    matedSquare: puzzle.matedSquare,
    // Flip the board so the solver's pieces sit on the bottom rank.
    flip: userColor === "black",
    onSquareClick,
    nextPuzzle,
  };
}
