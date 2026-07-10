import evergreenRaw from "./evergreen.json";
import operaRaw from "./opera.json";

/** A single square: a FEN piece letter, or null when empty. */
export type Square = string | null;
/** 8x8 grid. Row 0 = rank 8 (top), row 7 = rank 1 (bottom). */
export type Grid = Square[][];

export interface Position {
  grid: Grid;
  from: string | null;
  to: string | null;
  san: string | null;
  moveNo?: number;
  white?: boolean;
}

export interface Game {
  title: string;
  players: string;
  positions: Position[];
}

/**
 * Validate bundled game data at module load. The data is generated at build
 * time from real PGN, so this should never fail in production — but if a file
 * is ever regenerated incorrectly we fail fast with a clear message instead of
 * rendering a corrupt board.
 */
function validateGame(data: unknown, name: string): Game {
  const g = data as Game;
  if (
    !g ||
    typeof g.title !== "string" ||
    typeof g.players !== "string" ||
    !Array.isArray(g.positions) ||
    g.positions.length < 2
  ) {
    throw new Error(`${name}: malformed game data`);
  }
  for (const p of g.positions) {
    if (
      !Array.isArray(p.grid) ||
      p.grid.length !== 8 ||
      p.grid.some((row) => !Array.isArray(row) || row.length !== 8)
    ) {
      throw new Error(`${name}: every position must contain an 8x8 grid`);
    }
  }
  return g;
}

export const evergreen: Game = validateGame(evergreenRaw, "evergreen.json");
export const opera: Game = validateGame(operaRaw, "opera.json");

/** All classics available in the replay, in display order. */
export const GAMES: Game[] = [evergreen, opera];
