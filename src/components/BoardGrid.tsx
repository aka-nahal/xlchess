import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import type { Grid } from "@/data/evergreen";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

const GLYPH: Record<string, string> = {
  K: "\u2654", Q: "\u2655", R: "\u2656", B: "\u2657", N: "\u2658", P: "\u2659",
  k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F",
};

const PIECE_NAME: Record<string, string> = {
  K: "King", Q: "Queen", R: "Rook", B: "Bishop", N: "Knight", P: "Pawn",
};

/** Convert row/col grid indices to an algebraic square name ("e4"). */
export function rcToSquare(r: number, c: number): string {
  return `${FILES[c]}${8 - r}`;
}

/** Convert an algebraic square ("e4") to [rowIndex, colIndex]. */
export function squareToRC(sq: string): [number, number] {
  const col = FILES.indexOf(sq[0] as (typeof FILES)[number]);
  const row = 8 - Number(sq[1]);
  return [row, col];
}

export type HighlightKind = "from" | "to" | "selected" | "wrong";

export interface LastMove {
  from: string;
  to: string;
}

interface BoardGridProps {
  grid: Grid;
  /** Map of algebraic square -> highlight kind. */
  highlights?: Partial<Record<string, HighlightKind>>;
  /** When provided, squares become buttons and the board is interactive. */
  onSquareClick?: (square: string, piece: string | null) => void;
  /**
   * The move that produced this grid. The piece on `lastMove.to` animates
   * from its origin square into place. Change `moveKey` to retrigger.
   */
  lastMove?: LastMove | null;
  moveKey?: string | number;
}

const HIGHLIGHT_CLASS: Record<HighlightKind, string> = {
  from: "bg-brand/25",
  to: "bg-brand/45",
  selected: "bg-brand/50 ring-2 ring-inset ring-brand-light",
  wrong: "bg-red-500/45",
};

const pieceClass = (white: boolean) =>
  [
    "leading-none",
    "text-[clamp(1.1rem,5.5vw,2.1rem)]",
    white
      ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
      : "text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.25)]",
  ].join(" ");

/**
 * Pure presentational 8x8 board. Rendering is identical for the replay and the
 * puzzle; interactivity is opt-in via `onSquareClick`, and the last move's
 * piece glides from its origin square (skipped under reduced motion).
 */
export default function BoardGrid({
  grid,
  highlights = {},
  onSquareClick,
  lastMove = null,
  moveKey,
}: BoardGridProps) {
  const prefersReduced = useReducedMotion();
  const interactive = Boolean(onSquareClick);

  const flightOffset = (() => {
    if (!lastMove || prefersReduced) return null;
    const [fr, fc] = squareToRC(lastMove.from);
    const [tr, tc] = squareToRC(lastMove.to);
    return { x: (fc - tc) * 100, y: (fr - tr) * 100 };
  })();

  return (
    <div className="grid grid-cols-8 overflow-hidden rounded-lg">
      {grid.map((rankRow, r) =>
        rankRow.map((piece, c) => {
          const sq = rcToSquare(r, c);
          const isDark = (r + c) % 2 === 1;
          const kind = highlights[sq];
          const white = piece ? piece === piece.toUpperCase() : false;
          const flying = Boolean(piece && flightOffset && lastMove && sq === lastMove.to);
          const pieceLabel = piece
            ? `${white ? "White" : "Black"} ${PIECE_NAME[piece.toUpperCase()] ?? "piece"}`
            : "empty";

          const cellClass = [
            "relative flex aspect-square items-center justify-center select-none",
            isDark ? "bg-board-dark/70" : "bg-board-light/90",
            interactive ? "cursor-pointer focus-brand" : "",
          ].join(" ");

          const inner = (
            <>
              {kind && (
                <span
                  aria-hidden
                  className={`absolute inset-0 transition-opacity duration-300 ${HIGHLIGHT_CLASS[kind]}`}
                />
              )}
              {piece &&
                (flying ? (
                  <span
                    key={`fly-${moveKey ?? ""}-${sq}`}
                    className={`absolute inset-0 z-20 flex items-center justify-center ${pieceClass(white)}`}
                    style={
                      {
                        "--fly-x": `${flightOffset!.x}%`,
                        "--fly-y": `${flightOffset!.y}%`,
                        animation:
                          "piece-fly 480ms cubic-bezier(0.22, 1, 0.36, 1) both",
                      } as CSSProperties
                    }
                  >
                    {GLYPH[piece]}
                  </span>
                ) : (
                  <span className={`relative z-10 ${pieceClass(white)}`}>
                    {GLYPH[piece]}
                  </span>
                ))}
            </>
          );

          return interactive ? (
            <button
              key={sq}
              type="button"
              onClick={() => onSquareClick!(sq, piece)}
              aria-label={`${sq}, ${pieceLabel}`}
              className={cellClass}
            >
              {inner}
            </button>
          ) : (
            <div key={sq} className={cellClass} title={piece ? pieceLabel : undefined}>
              {inner}
            </div>
          );
        })
      )}
    </div>
  );
}
