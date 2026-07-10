import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Short branded loading screen (~900ms). Reads as polish rather than friction,
 * and is skipped entirely for reduced-motion users.
 */
export default function LoadingScreen() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (prefersReduced) {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, [prefersReduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-5">
            <motion.div
              className="text-5xl text-brand-light"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {"\u265E"}
            </motion.div>
            <div className="h-0.5 w-28 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full w-full bg-gradient-to-r from-brand-light to-brand-orchid"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              XLChess
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
