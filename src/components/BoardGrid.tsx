import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import type { Grid } from "@/data/evergreen";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

const GLYPH: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
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
   * When provided, pieces can also be dragged. Fired when a piece is dragged
   * from one square and dropped on a different one.
   */
  onDragMove?: (from: string, to: string) => void;
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

/** Pixels of pointer travel before a press counts as a drag instead of a click. */
const DRAG_THRESHOLD = 6;

interface DragView {
  from: string;
  x: number;
  y: number;
  over: string | null;
}

/**
 * Pure presentational 8x8 board. Rendering is identical for the replay and the
 * puzzle; interactivity is opt-in via `onSquareClick` (click-click moves) and
 * `onDragMove` (drag-and-drop), and the last move's piece glides from its
 * origin square (skipped under reduced motion).
 */
export default function BoardGrid({
  grid,
  highlights = {},
  onSquareClick,
  onDragMove,
  lastMove = null,
  moveKey,
}: BoardGridProps) {
  const prefersReduced = useReducedMotion();
  const interactive = Boolean(onSquareClick);
  const draggable = Boolean(onDragMove);

  const dragRef = useRef<{ from: string; startX: number; startY: number; active: boolean } | null>(null);
  // A captured pointer still fires the click event on the origin square after
  // a drag ends elsewhere; this flag swallows that synthetic click.
  const suppressClick = useRef(false);
  const [dragView, setDragView] = useState<DragView | null>(null);

  const squareAt = (x: number, y: number): string | null =>
    document.elementFromPoint(x, y)?.closest("[data-square]")?.getAttribute("data-square") ?? null;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, sq: string, piece: string | null) => {
    if (!piece || e.button !== 0) return;
    suppressClick.current = false;
    dragRef.current = { from: sq, startX: e.clientX, startY: e.clientY, active: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.active) {
      if (Math.hypot(dx, dy) <= DRAG_THRESHOLD) return;
      d.active = true;
    }
    setDragView({ from: d.from, x: dx, y: dy, over: squareAt(e.clientX, e.clientY) });
  };

  const handlePointerEnd = (e: React.PointerEvent, drop: boolean) => {
    const d = dragRef.current;
    dragRef.current = null;
    setDragView(null);
    if (!d?.active) return; // never left the threshold: let the click event handle it
    suppressClick.current = true;
    if (!drop) return;
    const target = squareAt(e.clientX, e.clientY);
    if (target && target !== d.from) onDragMove!(d.from, target);
  };

  const handleClick = (sq: string, piece: string | null) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    onSquareClick?.(sq, piece);
  };

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
          const isDragOrigin = dragView?.from === sq;
          const isDropTarget = Boolean(dragView && dragView.over === sq && dragView.from !== sq);
          const pieceLabel = piece
            ? `${white ? "White" : "Black"} ${PIECE_NAME[piece.toUpperCase()] ?? "piece"}`
            : "empty";

          const cellClass = [
            "relative flex aspect-square items-center justify-center select-none",
            isDark ? "bg-board-dark/70" : "bg-board-light/90",
            interactive ? "cursor-pointer focus-brand" : "",
            draggable ? "touch-none" : "",
          ].join(" ");

          const inner = (
            <>
              {kind && (
                <span
                  aria-hidden
                  className={`absolute inset-0 transition-opacity duration-300 ${HIGHLIGHT_CLASS[kind]}`}
                />
              )}
              {isDragOrigin && (
                <span aria-hidden className="absolute inset-0 bg-brand/25" />
              )}
              {isDropTarget && (
                <span
                  aria-hidden
                  className="absolute inset-0 bg-brand/20 ring-2 ring-inset ring-brand-light"
                />
              )}
              {piece &&
                (isDragOrigin && dragView ? (
                  // The ghost must ignore pointer events so elementFromPoint
                  // sees the square underneath it, not the piece itself.
                  <span
                    className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center ${pieceClass(white)}`}
                    style={{ transform: `translate(${dragView.x}px, ${dragView.y}px) scale(1.15)` }}
                  >
                    {GLYPH[piece]}
                  </span>
                ) : flying ? (
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
              data-square={sq}
              onClick={() => handleClick(sq, piece)}
              onPointerDown={draggable ? (e) => handlePointerDown(e, sq, piece) : undefined}
              onPointerMove={draggable ? handlePointerMove : undefined}
              onPointerUp={draggable ? (e) => handlePointerEnd(e, true) : undefined}
              onPointerCancel={draggable ? (e) => handlePointerEnd(e, false) : undefined}
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
