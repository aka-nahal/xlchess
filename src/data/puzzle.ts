import raw from "./puzzle.json";
import type { Grid } from "./evergreen";

export interface Puzzle {
  title: string;
  prompt: string;
  grid: Grid;
  solution: { from: string; to: string };
  solvedGrid: Grid;
  explanation: string;
}

/** Fail fast if the bundled puzzle data is ever regenerated incorrectly. */
function validatePuzzle(data: unknown): Puzzle {
  const p = data as Puzzle;
  const okGrid = (g: unknown) =>
    Array.isArray(g) && g.length === 8 && g.every((r) => Array.isArray(r) && r.length === 8);
  if (
    !p ||
    typeof p.title !== "string" ||
    typeof p.prompt !== "string" ||
    !okGrid(p.grid) ||
    !okGrid(p.solvedGrid) ||
    !p.solution ||
    typeof p.solution.from !== "string" ||
    typeof p.solution.to !== "string"
  ) {
    throw new Error("puzzle.json: malformed puzzle data");
  }
  return p;
}

export const puzzle: Puzzle = validatePuzzle(raw);
