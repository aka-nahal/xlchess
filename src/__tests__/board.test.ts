import { describe, it, expect } from "vitest";
import { squareToRC, rcToSquare } from "../components/BoardGrid";
import { evergreen } from "../data/evergreen";
import { puzzle } from "../data/puzzle";

describe("square <-> grid coordinate mapping", () => {
  it("maps corners correctly", () => {
    expect(squareToRC("a8")).toEqual([0, 0]);
    expect(squareToRC("h8")).toEqual([0, 7]);
    expect(squareToRC("a1")).toEqual([7, 0]);
    expect(squareToRC("h1")).toEqual([7, 7]);
  });

  it("round-trips every square on the board", () => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        expect(squareToRC(rcToSquare(r, c))).toEqual([r, c]);
      }
    }
  });
});

describe("Evergreen Game data", () => {
  it("starts from the standard initial position", () => {
    const first = evergreen.positions[0].grid;
    expect(first[0]).toEqual(["r", "n", "b", "q", "k", "b", "n", "r"]);
    expect(first[1].every((p) => p === "p")).toBe(true);
    expect(first[6].every((p) => p === "P")).toBe(true);
    expect(first[7]).toEqual(["R", "N", "B", "Q", "K", "B", "N", "R"]);
  });

  it("contains the full 47-ply game ending in Bxe7#", () => {
    expect(evergreen.positions).toHaveLength(48); // initial + 47 plies
    const last = evergreen.positions[evergreen.positions.length - 1];
    expect(last.san).toBe("Bxe7#");
  });

  it("every position has a valid 8x8 grid", () => {
    for (const p of evergreen.positions) {
      expect(p.grid).toHaveLength(8);
      for (const row of p.grid) expect(row).toHaveLength(8);
    }
  });

  it("every move's from/to squares are valid algebraic squares", () => {
    const valid = /^[a-h][1-8]$/;
    for (const p of evergreen.positions.slice(1)) {
      expect(p.from).toMatch(valid);
      expect(p.to).toMatch(valid);
    }
  });
});

describe("Mate-in-one puzzle data", () => {
  it("has a white queen on the solution's from-square", () => {
    const [r, c] = squareToRC(puzzle.solution.from);
    expect(puzzle.grid[r][c]).toBe("Q");
  });

  it("solved grid shows the queen on the destination square", () => {
    const [r, c] = squareToRC(puzzle.solution.to);
    expect(puzzle.solvedGrid[r][c]).toBe("Q");
    const [fr, fc] = squareToRC(puzzle.solution.from);
    expect(puzzle.solvedGrid[fr][fc]).toBeNull();
  });
});

describe("Opera Game data", () => {
  it("contains the full 33-ply game ending in Rd8#", async () => {
    const { opera } = await import("../data/games");
    expect(opera.positions).toHaveLength(34); // initial + 33 plies
    expect(opera.positions[opera.positions.length - 1].san).toBe("Rd8#");
  });

  it("starts from the standard initial position", async () => {
    const { opera } = await import("../data/games");
    const first = opera.positions[0].grid;
    expect(first[0]).toEqual(["r", "n", "b", "q", "k", "b", "n", "r"]);
    expect(first[7]).toEqual(["R", "N", "B", "Q", "K", "B", "N", "R"]);
  });
});
