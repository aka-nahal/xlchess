import { motion, useReducedMotion, type Variants } from "framer-motion";
import BoardPanel from "./BoardPanel";
import FloatingPieces from "./FloatingPieces";
import CountUpStat from "./CountUpStat";
import TiltCard from "./TiltCard";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Headline words; the last two carry the gradient. */
const HEADLINE: { text: string; gradient?: boolean }[] = [
  { text: "Build" },
  { text: "the" },
  { text: "Future" },
  { text: "of" },
  { text: "Online", gradient: true },
  { text: "Chess", gradient: true },
];

export default function Hero() {
  const prefersReduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const item: Variants = {
    hidden: prefersReduced ? {} : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  // Word-by-word reveal for the headline.
  const word: Variants = {
    hidden: prefersReduced ? {} : { opacity: 0, y: "0.6em", rotate: 2 },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.55, ease: EASE },
    },
  };

  return (
    <section
      id="play"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <FloatingPieces />

      {/* faint board-grid texture behind the copy, fading out to the right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 opacity-[0.05] lg:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          maskImage: "radial-gradient(circle at 30% 50%, black, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at 30% 50%, black, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100dvh-4.5rem)] w-full max-w-7xl flex-col items-center gap-14 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-20">
        {/* Copy column */}
        <motion.div
          className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-brand-soft"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-light opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-light" />
            </span>
            Making the best move on the way to the top
          </motion.span>

          <h1
            id="hero-heading"
            className="text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.6rem]"
          >
            {HEADLINE.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-top">
                <motion.span
                  className={`inline-block ${w.gradient ? "text-gradient" : ""}`}
                  variants={word}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.25 + i * 0.09, duration: 0.55, ease: EASE }}
                >
                  {w.text}
                </motion.span>
                {i < HEADLINE.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            A complete chess platform to play, learn, compete, and grow&mdash;built
            to become the world&rsquo;s{" "}
            <span className="font-semibold text-slate-100">#1 destination</span>{" "}
            for chess.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <a
              href="#play"
              className="cta-shine focus-brand group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-all hover:-translate-y-0.5 hover:bg-brand-light hover:shadow-brand/40 active:translate-y-0"
            >
              Play Now
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </a>
            <a
              href="#learn"
              className="focus-brand inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-slate-100 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
            >
              Learn to Play
            </a>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-12 grid w-full max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6"
          >
            <CountUpStat value={10} suffix="M+" label="Games played" />
            <CountUpStat value={180} suffix="+" label="Countries" />
            <CountUpStat value={24} suffix="/7" label="Live matches" />
          </motion.dl>
        </motion.div>

        {/* Board column */}
        <motion.div
          className="flex w-full max-w-[440px] shrink-0 justify-center lg:justify-end"
          initial={prefersReduced ? {} : { opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
        >
          <TiltCard>
            <BoardPanel />
          </TiltCard>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-slate-500 lg:flex"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.25em]">Scroll</span>
        <span
          className="block h-6 w-px bg-gradient-to-b from-slate-500 to-transparent"
          style={{ animation: "scroll-cue 2s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}
