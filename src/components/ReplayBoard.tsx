import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import BoardGrid, { type HighlightKind } from "./BoardGrid";
import type { Game } from "@/data/games";

const BASE_MOVE_MS = 1400;
const SPEEDS = [1, 2] as const;
type Speed = (typeof SPEEDS)[number];

interface ReplayBoardProps {
  game: Game;
  /** Called when the user asks for the next classic; omit to hide the control. */
  onNextGame?: () => void;
}

/**
 * Replays a classic game move by move with playback controls.
 * Reduced-motion users see the final position with autoplay disabled.
 * Playback pauses while the tab is hidden to save CPU/battery.
 */
export default function ReplayBoard({ game, onNextGame }: ReplayBoardProps) {
  const prefersReduced = useReducedMotion();
  const { positions } = game;
  const lastIndex = positions.length - 1;

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<Speed>(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedByUser = useRef(false);

  useEffect(() => {
    if (prefersReduced) {
      setPlaying(false);
      setIndex(lastIndex);
    }
  }, [prefersReduced, lastIndex]);

  const advance = useCallback(() => {
    setIndex((i) => (i >= lastIndex ? 0 : i + 1));
  }, [lastIndex]);

  useEffect(() => {
    if (!playing) return;
    if (typeof document !== "undefined" && document.hidden) return;
    const delay = (index === lastIndex ? BASE_MOVE_MS * 2 : BASE_MOVE_MS) / speed;
    timer.current = setTimeout(advance, delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, index, advance, lastIndex, speed]);

  useEffect(() => {
    const onVisibility = () => {
      if (prefersReduced) return;
      if (document.hidden) setPlaying(false);
      else if (!pausedByUser.current) setPlaying(true);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [prefersReduced]);

  const togglePlay = () =>
    setPlaying((p) => {
      pausedByUser.current = p; // pausing deliberately
      return !p;
    });

  const restart = () => {
    setIndex(0);
    setPlaying(true);
    pausedByUser.current = false;
  };

  const cycleSpeed = () =>
    setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length]);

  // The parent remounts this component per game (via `key`), so `index` can
  // never belong to a different game — but clamp anyway so an out-of-range
  // index can never crash the render (this exact bug shipped once: switching
  // games mid-replay left a stale index pointing past the shorter game).
  const safeIndex = Math.min(index, lastIndex);
  const pos = positions[safeIndex];
  const movesLeft = lastIndex - safeIndex;

  const highlights = useMemo(() => {
    const h: Partial<Record<string, HighlightKind>> = {};
    if (pos.from) h[pos.from] = "from";
    if (pos.to) h[pos.to] = "to";
    return h;
  }, [pos]);

  const status = useMemo(() => {
    if (safeIndex === lastIndex) return "Checkmate";
    if (!playing) return "Paused";
    if (safeIndex === 0) return "Starting\u2026";
    return pos.san ? `${pos.moveNo}.${pos.white ? "" : ".."} ${pos.san}` : "Playing\u2026";
  }, [safeIndex, lastIndex, playing, pos]);

  const btn =
    "focus-brand inline-flex h-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-white/25 hover:bg-white/[0.08]";

  return (
    <div>
      <div
        role="img"
        aria-label={`Replay of ${game.title}, ${game.players}. Currently ${status}, ${movesLeft} moves remaining.`}
      >
        <BoardGrid
          grid={pos.grid}
          highlights={highlights}
          lastMove={pos.from && pos.to ? { from: pos.from, to: pos.to } : null}
          moveKey={safeIndex}
        />
      </div>

      <div className="mt-3 flex min-h-[3.25rem] items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            className={btn}
            aria-label={playing ? "Pause replay" : "Resume replay"}
            aria-pressed={!playing}
          >
            {playing ? "\u23F8" : "\u25B6"}
          </button>
          <button type="button" onClick={restart} className={btn} aria-label="Restart replay">
            {"\u21BB"}
          </button>
          <button
            type="button"
            onClick={cycleSpeed}
            className={btn}
            aria-label={`Playback speed ${speed}x, click to change`}
          >
            {speed}x
          </button>
          {onNextGame && (
            <button
              type="button"
              onClick={onNextGame}
              className={btn}
              aria-label="Watch the next classic game"
            >
              {"\u21C9"}
            </button>
          )}
        </div>

        <div className="flex min-w-0 items-center gap-2 text-right">
          <span className="truncate tabular-nums text-slate-300" aria-live="polite">
            {status}
          </span>
          <span className="shrink-0 tabular-nums font-semibold text-brand-soft">
            {movesLeft} left
          </span>
        </div>
      </div>
    </div>
  );
}
