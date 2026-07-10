import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpStatProps {
  /** Final numeric value, e.g. 10 for "10M+". */
  value: number;
  /** Suffix rendered after the number, e.g. "M+", "+", "/7". */
  suffix?: string;
  /** Prefix rendered before the number, e.g. "24" for "24/7". */
  prefix?: string;
  label: string;
  durationMs?: number;
}

/**
 * A stat that counts up from 0 when it scrolls into view.
 * Skips straight to the final value under reduced motion.
 */
export default function CountUpStat({
  value,
  suffix = "",
  prefix = "",
  label,
  durationMs = 1200,
}: CountUpStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(prefersReduced ? value : 0);

  useEffect(() => {
    if (!inView || prefersReduced) {
      if (prefersReduced) setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      // easeOutCubic for a satisfying settle
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, durationMs, prefersReduced]);

  return (
    <div ref={ref} className="flex flex-col">
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl font-bold tabular-nums text-white">
        {prefix}
        {display}
        {suffix}
      </dd>
      <span className="mt-0.5 text-xs text-slate-400">{label}</span>
    </div>
  );
}
