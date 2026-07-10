import { useId, useState } from "react";
import ReplayBoard from "./ReplayBoard";
import PuzzleBoard from "./PuzzleBoard";
import { GAMES } from "@/data/games";

type Tab = "watch" | "solve";

/**
 * The hero's right-hand panel: a tabbed card that either replays the
 * Evergreen Game or challenges the visitor with a one-move puzzle.
 */
export default function BoardPanel() {
  const [tab, setTab] = useState<Tab>("watch");
  const [gameIdx, setGameIdx] = useState(0);
  const game = GAMES[gameIdx];
  const nextGame = () => setGameIdx((i) => (i + 1) % GAMES.length);
  const baseId = useId();

  const tabs: { key: Tab; label: string }[] = [
    { key: "watch", label: "Watch a classic" },
    { key: "solve", label: "Solve a puzzle" },
  ];

  const tabBtn = (active: boolean) =>
    [
      "focus-brand flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
      active
        ? "bg-brand text-white shadow-sm shadow-brand/30"
        : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
    ].join(" ");

  return (
    <div className="w-full max-w-[440px]">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-[0.7rem] uppercase tracking-[0.16em] text-brand-soft/80">
        <span className="whitespace-nowrap font-semibold">
          {tab === "watch" ? game.title : "Your move"}
        </span>
        <span className="whitespace-nowrap tabular-nums text-slate-400">
          {tab === "watch" ? game.players : "White to play"}
        </span>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-brand/10 backdrop-blur-sm sm:p-4">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-brand/20 blur-3xl animate-pulse-glow"
        />

        <div
          role="tablist"
          aria-label="Board mode"
          className="mb-3 flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`${baseId}-tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls={`${baseId}-panel-${t.key}`}
              onClick={() => setTab(t.key)}
              className={tabBtn(tab === t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`${baseId}-panel-${tab}`}
          aria-labelledby={`${baseId}-tab-${tab}`}
        >
          {tab === "watch" ? (
            <ReplayBoard
              key={gameIdx}
              game={game}
              onNextGame={GAMES.length > 1 ? nextGame : undefined}
            />
          ) : (
            <PuzzleBoard />
          )}
        </div>
      </div>
    </div>
  );
}
