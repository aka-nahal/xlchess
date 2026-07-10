import { useReducedMotion } from "framer-motion";

interface PieceSpec {
  glyph: string;
  top: string;
  left: string;
  size: string;
  duration: number;
  delay: number;
  rotate: number;
}

// Hand-placed for balanced composition: kept away from the copy column's
// reading path, denser near edges, varied sizes for depth.
const PIECES: PieceSpec[] = [
  { glyph: "\u265E", top: "8%",  left: "4%",  size: "3.5rem", duration: 13, delay: 0,   rotate: -12 },
  { glyph: "\u265B", top: "70%", left: "8%",  size: "2.6rem", duration: 17, delay: 1.2, rotate: 8 },
  { glyph: "\u265C", top: "22%", left: "44%", size: "2.2rem", duration: 15, delay: 2.5, rotate: 14 },
  { glyph: "\u265D", top: "78%", left: "40%", size: "3rem",   duration: 19, delay: 0.8, rotate: -6 },
  { glyph: "\u265F", top: "12%", left: "88%", size: "2.4rem", duration: 14, delay: 1.8, rotate: 10 },
  { glyph: "\u265A", top: "60%", left: "93%", size: "2.8rem", duration: 18, delay: 3,   rotate: -10 },
  { glyph: "\u265E", top: "88%", left: "72%", size: "2rem",   duration: 16, delay: 2.2, rotate: 6 },
  { glyph: "\u265C", top: "40%", left: "2%",  size: "2rem",   duration: 20, delay: 0.4, rotate: -14 },
];

/**
 * Decorative chess pieces drifting slowly in the hero background — an
 * homage to the ghost pieces on the original site. Pure CSS animation
 * (transform/opacity only), aria-hidden, and static under reduced motion.
 */
export default function FloatingPieces() {
  const prefersReduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="absolute select-none text-white/[0.045]"
          style={{
            top: p.top,
            left: p.left,
            fontSize: p.size,
            transform: `rotate(${p.rotate}deg)`,
            animation: prefersReduced
              ? undefined
              : `float-piece ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
