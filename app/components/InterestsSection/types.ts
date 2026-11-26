export type TagId = "illustration" | "anime" | "chess";

export interface Tag {
  id: TagId;
  name: string;
}

export type PieceColor = "white" | "black";

export interface PiecePlacement {
  id: string;
  type: string; // "wK", "bQ", …
  square: string; // "e4"
}

export interface ChessMove {
  from: string;
  to: string;
}

export interface ChessPuzzle {
  id: number;
  label: string;
  position: [string, string][]; // [["wK","g1"], …]
  toMove: PieceColor; // the side the solver plays
  solution: ChessMove[]; // alternating user / auto, last = the solving move
  outcome: "mate" | "win"; // "mate" tips the king; "win" is a decisive material gain
  matedSquare?: string; // losing king's square (only for outcome === "mate")
}
