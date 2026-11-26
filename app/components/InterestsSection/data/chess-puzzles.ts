import type { ChessPuzzle } from "../types";

// Real Lichess puzzles (positions converted from FEN, opponent's setup move
// already applied so the board opens on the solver's turn). Each solution
// alternates the user's move and an auto-reply; the final entry is the solving
// move. `outcome` is "mate" (tip the king) or "win" (a decisive material gain).
// Sources: lichess.org/training — 000rZ, 000rO, 000qP, 000o3.
export const CHESS_PUZZLES: ChessPuzzle[] = [
  {
    id: 1,
    label: "SCANDINAVIAN · MATE IN 1",
    toMove: "black",
    position: [
      ["wK", "g1"], ["wQ", "d1"], ["wR", "a1"], ["wR", "f1"], ["wB", "e3"], ["wN", "c3"],
      ["wN", "e6"], ["wP", "a2"], ["wP", "b2"], ["wP", "c2"], ["wP", "d3"], ["wP", "f2"],
      ["wP", "g2"], ["wP", "h2"], ["bK", "c8"], ["bQ", "d6"], ["bR", "d8"], ["bR", "h8"],
      ["bB", "f8"], ["bN", "g4"], ["bP", "a7"], ["bP", "c6"], ["bP", "c7"], ["bP", "f7"],
      ["bP", "g7"], ["bP", "h5"],
    ],
    solution: [
      { from: "d6", to: "h2" }, // Qxh2#
    ],
    outcome: "mate",
    matedSquare: "g1",
  },
  {
    id: 2,
    label: "ENDGAME · FORK",
    toMove: "black",
    position: [
      ["wK", "a5"], ["wR", "d8"], ["wB", "b5"], ["wP", "b3"],
      ["bK", "e3"], ["bB", "e5"], ["bP", "b4"], ["bP", "d2"],
    ],
    solution: [
      { from: "e5", to: "c7" }, // Bc7+
      { from: "a5", to: "b4" }, // Kxb4 (auto)
      { from: "c7", to: "d8" }, // Bxd8 — forks and wins the rook
    ],
    outcome: "win",
  },
  {
    id: 3,
    label: "ENDGAME · SKEWER",
    toMove: "black",
    position: [
      ["wK", "f1"], ["wR", "g1"], ["wR", "h7"], ["wP", "h4"],
      ["bK", "f4"], ["bR", "c2"], ["bB", "e4"], ["bP", "f5"],
    ],
    solution: [
      { from: "f4", to: "f3" }, // Kf3
      { from: "f1", to: "e1" }, // Ke1 (auto)
      { from: "c2", to: "c1" }, // Rc1+
      { from: "e1", to: "d2" }, // Kd2 (auto)
      { from: "c1", to: "g1" }, // Rxg1 — skewers and wins the rook
    ],
    outcome: "win",
  },
  {
    id: 4,
    label: "PAWN ENDGAME · ZUGZWANG",
    toMove: "white",
    position: [
      ["wK", "d3"], ["wP", "b4"], ["wP", "d5"], ["wP", "f4"], ["wP", "g3"], ["wP", "h2"],
      ["bK", "d6"], ["bP", "b5"], ["bP", "c7"], ["bP", "f5"], ["bP", "g6"], ["bP", "h3"],
    ],
    solution: [
      { from: "d3", to: "d4" }, // Kd4
      { from: "g6", to: "g5" }, // g5 (auto)
      { from: "f4", to: "g5" }, // fxg5 — breaks through, winning
    ],
    outcome: "win",
  },
];
