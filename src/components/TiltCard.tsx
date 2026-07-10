import type { ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
}

/**
 * Presents its content at a subtle, static resting 3D tilt. The tilt never
 * changes under the pointer — two earlier iterations (pointer-tracking tilt,
 * then flatten-on-hover) were both rejected because any transform that reacts
 * to the pointer moves the click targets while the user is aiming at them.
 * The card flattens only on keyboard focus, which happens after targeting.
 * Reduced-motion users get a flat card.
 */
export default function TiltCard({ children }: TiltCardProps) {
  return (
    <div className="w-full" style={{ perspective: 1100 }}>
      <div className="tilt-rest w-full">{children}</div>
    </div>
  );
}
