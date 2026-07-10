import { useEffect, useMemo, useRef, useState } from "react";
import BoardGrid, { squareToRC, type HighlightKind } from "./BoardGrid";
import { puzzle } from "@/data/puzzle";

type Phase = "picking" | "moving" | "solved";

const MSG_BLACK_PIECE = "That's a black piece. It's White to move!";
const MSG_WRONG_MOVE = "Not quite. Look for the mate in one!";

/**
 * A one-move chess puzzle: pick the white piece and its destination, by
 * click-click or drag-and-drop. Only the single winning move is accepted; a
 * wrong choice flashes red, explains itself, and resets the selection.
 * Solving reveals the mate and a short explanation.
 */
export default function PuzzleBoard() {
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongSquare, setWrongSquare] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("picking");
  const [hint, setHint] = useState<string | null>(null);
  const wrongTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    },
    []
  );

  const { grid, solvedGrid, solution, prompt, explanation } = puzzle;
  const solved = phase === "solved";

  const highlights = useMemo(() => {
    const h: Partial<Record<string, HighlightKind>> = {};
    if (solved) {
      h[solution.from] = "from";
      h[solution.to] = "to";
    } else {
      if (selected) h[selected] = "selected";
      if (wrongSquare) h[wrongSquare] = "wrong";
    }
    return h;
  }, [solved, selected, wrongSquare, solution]);

  const flashWrong = (sq: string, message: string) => {
    setWrongSquare(sq);
    setSelected(null);
    setPhase("picking");
    setHint(message);
    // A fresh flash restarts the clock; otherwise a still-pending timeout
    // from an earlier wrong click would clear this one early.
    if (wrongTimer.current !== null) window.clearTimeout(wrongTimer.current);
    wrongTimer.current = window.setTimeout(() => {
      setWrongSquare(null);
      wrongTimer.current = null;
    }, 450);
  };

  const solve = () => {
    setPhase("solved");
    setSelected(null);
    setHint(null);
  };

  const onSquareClick = (sq: string, piece: string | null) => {
    if (solved) return;

    if (phase === "picking") {
      if (piece && piece === piece.toUpperCase()) {
        // A white piece was chosen.
        setSelected(sq);
        setPhase("moving");
      } else if (piece) {
        flashWrong(sq, MSG_BLACK_PIECE);
      }
      return;
    }

    // phase === "moving"
    if (sq === selected) {
      // Deselect.
      setSelected(null);
      setPhase("picking");
      return;
    }
    if (piece && piece === piece.toUpperCase()) {
      // Switch selection to another white piece.
      setSelected(sq);
      return;
    }
    if (selected === solution.from && sq === solution.to) {
      solve();
      return;
    }
    flashWrong(sq, MSG_WRONG_MOVE);
  };

  const onDragMove = (from: string, to: string) => {
    const [r, c] = squareToRC(from);
    const piece = grid[r][c];
    if (!piece) return;
    if (piece !== piece.toUpperCase()) {
      flashWrong(from, MSG_BLACK_PIECE);
      return;
    }
    if (from === solution.from && to === solution.to) {
      solve();
      return;
    }
    flashWrong(to, MSG_WRONG_MOVE);
  };

  const reset = () => {
    setPhase("picking");
    setSelected(null);
    setWrongSquare(null);
    setHint(null);
  };

  const statusText = solved
    ? explanation
    : phase === "moving"
      ? `Piece on ${selected} selected. Now pick its destination.`
      : (hint ?? prompt);

  return (
    <div>
      <BoardGrid
        grid={solved ? solvedGrid : grid}
        highlights={highlights}
        onSquareClick={onSquareClick}
        onDragMove={solved ? undefined : onDragMove}
        lastMove={solved ? solution : null}
        moveKey={solved ? "solved" : "unsolved"}
      />

      <div
        className={[
          "mt-3 flex min-h-[3.25rem] items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-sm",
          solved
            ? "border-brand/40 bg-brand/15 text-brand-soft"
            : "border-white/10 bg-white/[0.03] text-slate-300",
        ].join(" ")}
      >
        <span aria-live="polite" className="min-w-0">
          {solved && (
            <strong className="mr-1 font-semibold text-white">Solved!</strong>
          )}
          {statusText}
        </span>
        {solved && (
          <button
            type="button"
            onClick={reset}
            className="focus-brand shrink-0 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-100 transition-colors hover:bg-white/[0.12]"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
