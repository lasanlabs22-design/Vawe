"use client";

import { useRef, useState } from "react";
import type { Finish } from "@/lib/sliding";

type Props = {
  panels: number;
  /** Left edge of each panel as a fraction of the opening (0 … 1 - 1/panels). */
  positions: number[];
  onPositions: (p: number[]) => void;
  frame: string;
  finish: Finish;
  light: boolean;
  angle?: number;
  label?: string;
};

export const homePositions = (n: number) => Array.from({ length: n }, (_, i) => i / n);

/** Reveal one section: the panel covering it slides onto its neighbour. */
export const revealPositions = (n: number, slot: number) =>
  homePositions(n).map((p, i) => (i === slot ? (slot < n - 1 ? (slot + 1) / n : (slot - 1) / n) : p));

/**
 * CSS-3D sliding wardrobe. Each panel runs on its own track; drag a panel to slide it,
 * release and it glides (soft-close) to the nearest stop.
 */
export default function Sliding({ panels, positions, onPositions, frame, finish, light, angle = 0, label = "wardrobe" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ i: number; startX: number; startPos: number; width: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const max = 1 - 1 / panels;

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d) {
      const pos = Math.min(max, Math.max(0, d.startPos + (e.clientX - d.startX) / d.width));
      if (Math.abs(e.clientX - d.startX) > 3) d.moved = true;
      const next = [...positions];
      next[d.i] = pos;
      onPositions(next);
      return;
    }
    if (e.pointerType === "touch" || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    wrapRef.current.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    wrapRef.current.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

  const onDown = (i: number) => (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = {
      i,
      startX: e.clientX,
      startPos: positions[i],
      width: trackRef.current.getBoundingClientRect().width,
      moved: false,
    };
    setDragging(i);
  };

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    // The browser took over to scroll the page: drop the drag, and don't treat it as a tap.
    if (e.type === "pointercancel" && !d.moved) {
      drag.current = null;
      setDragging(null);
      return;
    }
    const next = [...positions];
    if (d.moved) {
      // snap to the nearest stop
      next[d.i] = Math.min(max, Math.max(0, Math.round(positions[d.i] * panels) / panels));
    } else {
      // a tap slides the panel to the next stop and back
      const home = d.i / panels;
      next[d.i] = Math.abs(positions[d.i] - home) > 0.01 ? home : revealPositions(panels, d.i)[d.i];
    }
    drag.current = null;
    setDragging(null);
    onPositions(next);
  };

  const insertStyle = (i: number): React.CSSProperties => {
    switch (finish.kind) {
      case "print":
        return {
          backgroundImage: `url(${finish.value})`,
          backgroundSize: `${panels * 100}% 100%`,
          backgroundPosition: `${panels > 1 ? (i / (panels - 1)) * 100 : 50}% 50%`,
        };
      default:
        return { "--fc": finish.value } as React.CSSProperties;
    }
  };

  const style = {
    "--frame": frame,
    "--n": panels,
    "--ang": `${angle}deg`,
  } as React.CSSProperties;

  return (
    <div
      ref={wrapRef}
      className={`cab-wrap sl-wrap${light ? " is-lit" : ""}${dragging !== null ? " is-dragging" : ""}`}
      style={style}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={() => {
        if (!drag.current) {
          wrapRef.current?.style.setProperty("--px", "0");
          wrapRef.current?.style.setProperty("--py", "0");
        }
      }}
    >
      <div className="cab-floor" aria-hidden="true" />
      <div className="cab sl" aria-label={`${label} with ${panels} sliding panels`}>
        <span className="cab-back" />
        <span className="cab-side cab-left" />
        <span className="cab-side cab-right" />
        <span className="cab-top" />
        <span className="cab-bottom" />
        <span className="cab-glow" />
        <span className="cab-led" />
        <span className="cab-face" />

        <span className="sl-panels" ref={trackRef}>
          {positions.map((x, i) => (
            <span
              key={i}
              role="slider"
              tabIndex={0}
              aria-label={`Panel ${i + 1}`}
              aria-valuemin={0}
              aria-valuemax={Math.round(max * 100)}
              aria-valuenow={Math.round(x * 100)}
              className={`sl-panel${dragging === i ? " is-grabbed" : ""}`}
              style={{ "--i": i, "--x": x } as React.CSSProperties}
              onPointerDown={onDown(i)}
              onKeyDown={(e) => {
                const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                if (!step) return;
                e.preventDefault();
                const next = [...positions];
                next[i] = Math.min(max, Math.max(0, Math.round((x + step / panels) * panels) / panels));
                onPositions(next);
              }}
            >
              <span className={`sl-insert slf-${finish.kind}`} style={insertStyle(i)}>
                <span className="glass-sheen" />
                <span key={finish.value} className="ins-flash" />
              </span>
              <i className="bar bar-top" />
              <i className="bar bar-bottom" />
              <i className="bar bar-left" />
              <i className="bar bar-right" />
              <span className="sl-grip" />
            </span>
          ))}
        </span>

        <span className="sl-track sl-track-top" />
        <span className="sl-track sl-track-bottom" />
      </div>
    </div>
  );
}
