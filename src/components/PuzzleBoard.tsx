import { useMemo, useState } from "react";
import BoardGrid, { type HighlightKind } from "./BoardGrid";
import { puzzle } from "@/data/puzzle";

type Phase = "picking" | "moving" | "solved";

/**
 * A one-move chess puzzle: pick the white piece, pick its destination.
 * Only the single winning move is accepted; a wrong choice flashes red and
 * resets the selection. Solving reveals the mate and a short explanation.
 */
export default function PuzzleBoard() {
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongSquare, setWrongSquare] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("picking");

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

  const flashWrong = (sq: string) => {
    setWrongSquare(sq);
    setSelected(null);
    setPhase("picking");
    window.setTimeout(() => setWrongSquare(null), 450);
  };

  const onSquareClick = (sq: string, piece: string | null) => {
    if (solved) return;

    if (phase === "picking") {
      if (piece && piece === piece.toUpperCase()) {
        // A white piece was chosen.
        setSelected(sq);
        setPhase("moving");
      } else if (piece) {
        flashWrong(sq); // clicked a black piece
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
      setPhase("solved");
      setSelected(null);
      return;
    }
    flashWrong(sq);
  };

  const reset = () => {
    setPhase("picking");
    setSelected(null);
    setWrongSquare(null);
  };

  const statusText = solved
    ? explanation
    : phase === "moving"
      ? `Piece on ${selected} selected. Now pick its destination.`
      : prompt;

  return (
    <div>
      <BoardGrid
        grid={solved ? solvedGrid : grid}
        highlights={highlights}
        onSquareClick={onSquareClick}
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
