"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Mechanism = "synchro" | "telescopic" | "bifold" | "slidefold";
export type GlassId = "clear" | "fluted" | "frosted" | "tinted" | "grid";

export const glassTypes: { id: GlassId; label: string }[] = [
  { id: "clear", label: "Clear glass" },
  { id: "fluted", label: "Fluted glass" },
  { id: "frosted", label: "Frosted glass" },
  { id: "tinted", label: "Tinted glass" },
  { id: "grid", label: "Black grid" },
];

export const views: { id: string; label: string; src: string }[] = [
  { id: "dining", label: "Dining", src: "/images/slide-bifold.jpg" },
  { id: "living", label: "Living", src: "/images/sliding-partitions.jpg" },
  { id: "terrace", label: "Terrace", src: "/images/slide-telescopic.jpg" },
  { id: "office", label: "Office", src: "/images/slide-cum-fold.jpg" },
];

type Panel = { x: number; ry: number; origin: "left" | "right"; z: number; handle?: "l" | "r" };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const easeOutBack = (k: number) => {
  const c1 = 1.1;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
};

/** Panel layout for a mechanism at opening progress t (0 = closed, 1 = fully open). */
export function geometry(mech: Mechanism, t: number): Panel[] {
  switch (mech) {
    case "synchro": {
      // two pairs open from the centre, in sync
      return [
        { x: 0, ry: 0, origin: "left", z: 0 },
        { x: 0.25 * (1 - t) + 0.012 * t, ry: 0, origin: "left", z: 0.6, handle: "r" },
        { x: 0.5 + 0.25 * t - 0.012 * t, ry: 0, origin: "left", z: 0.6, handle: "l" },
        { x: 0.75, ry: 0, origin: "left", z: 0 },
      ];
    }
    case "telescopic": {
      // three panels on three tracks stack behind one another
      return [0, 1, 2].map((i) => ({
        x: (i / 3) * (1 - t) + i * 0.014 * t,
        ry: 0,
        origin: "left" as const,
        z: i * 0.55,
        handle: i === 2 ? ("r" as const) : undefined,
      }));
    }
    case "bifold": {
      // concertina: alternate panels hinge left/right and fold toward the viewer
      const w = 0.25;
      const th = clamp(t, 0, 1.06) * 84;
      const c = Math.cos((th * Math.PI) / 180);
      return [0, 1, 2, 3].map((i) =>
        i % 2 === 0
          ? { x: i * w * c, ry: -th, origin: "left" as const, z: 0 }
          : { x: (i + 1) * w * c - w, ry: th, origin: "right" as const, z: 0, handle: i === 3 ? ("r" as const) : undefined },
      );
    }
    case "slidefold": {
      // each panel slides to the stack point, then pivots 90° against the wall
      const w = 0.25;
      return [0, 1, 2, 3].map((i) => {
        const u = clamp((t - i * 0.17) / 0.49, 0, 1.08);
        const a = easeInOut(clamp(u / 0.62));
        const b = clamp((u - 0.62) / 0.38, 0, 1.1);
        const stack = i * 0.022;
        return {
          x: i * w + (stack - i * w) * a,
          ry: -88 * b,
          origin: "left" as const,
          z: -i * 0.25,
          handle: i === 3 ? ("r" as const) : undefined,
        };
      });
    }
  }
}

/** Animated opening progress with drag + tween helpers. */
export function usePartition(initial = 0) {
  const [t, setT] = useState(initial);
  const tRef = useRef(initial);
  const raf = useRef(0);

  const set = useCallback((v: number) => {
    tRef.current = v;
    setT(v);
  }, []);
  const stop = useCallback(() => cancelAnimationFrame(raf.current), []);
  const animateTo = useCallback(
    (target: number, dur = 1700) =>
      new Promise<void>((resolve) => {
        cancelAnimationFrame(raf.current);
        const from = tRef.current;
        const start = performance.now();
        const ease = target > from && target === 1 ? easeOutBack : easeInOut;
        const step = (now: number) => {
          const k = Math.min(1, (now - start) / dur);
          set(from + (target - from) * ease(k));
          if (k < 1) raf.current = requestAnimationFrame(step);
          else resolve();
        };
        raf.current = requestAnimationFrame(step);
      }),
    [set],
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { t, set, animateTo, stop, tRef };
}

type Props = {
  mech: Mechanism;
  t: number;
  onDrag: (t: number) => void;
  onDragStart?: () => void;
  frame: string;
  glass: GlassId;
  view: string;
  evening: boolean;
  angle?: number;
};

/** A glass partition set into a wall opening, with the room beyond. */
export default function Partition({ mech, t, onDrag, onDragStart, frame, glass, view, evening, angle = 0 }: Props) {
  const openingRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; t: number; w: number } | null>(null);
  const panels = geometry(mech, t);
  const w = 1 / panels.length;

  const onDown = (e: React.PointerEvent) => {
    if (!openingRef.current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, t, w: openingRef.current.getBoundingClientRect().width };
    onDragStart?.();
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    onDrag(clamp(d.t - ((e.clientX - d.x) / d.w) * 1.4));
  };
  const onUp = () => {
    drag.current = null;
  };

  return (
    <div
      className={`pt-wrap${evening ? " is-evening" : ""}`}
      style={{ "--frame": frame, "--ang": `${angle}deg`, "--t": t } as React.CSSProperties}
    >
      <div className="pt-scene">
        <div
          ref={openingRef}
          className="pt-opening"
          role="slider"
          aria-label="Partition opening"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(t * 100)}
          tabIndex={0}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") onDrag(clamp(t + 0.1));
            if (e.key === "ArrowRight") onDrag(clamp(t - 0.1));
          }}
        >
          <div className="pt-view" style={{ backgroundImage: `url(${view})` }} />
          <div className="pt-evening" />
          <div className="pt-panels">
            {panels.map((p, i) => (
              <div
                key={i}
                className="pt-panel"
                style={{
                  left: `${p.x * 100}%`,
                  width: `${w * 100}%`,
                  transformOrigin: `${p.origin} center`,
                  transform: `translateZ(${p.z}em) rotateY(${p.ry}deg)`,
                  zIndex: Math.round(p.z * 10) + 10,
                }}
              >
                <span className={`pt-glass pg-${glass}`}>
                  <span className="pt-sheen" />
                </span>
                <i className="bar bar-top" />
                <i className="bar bar-bottom" />
                <i className="bar bar-left" />
                <i className="bar bar-right" />
                {p.handle && <span className={`pt-handle pt-handle-${p.handle}`} />}
              </div>
            ))}
          </div>
          <span className="pt-track pt-track-top" />
          <span className="pt-track pt-track-bottom" />
        </div>
        <div className="pt-floor" />
      </div>
    </div>
  );
}
