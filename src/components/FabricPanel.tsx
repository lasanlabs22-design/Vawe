"use client";

import { useRef, useState } from "react";
import { fabrics, texUrl, type FabricId } from "@/lib/fabric";

type Mode = "studio" | "divider" | "shutter" | "wall";

type Props = {
  fabric: FabricId;
  color: string;
  backlight: boolean;
  exploded?: boolean;
  mode?: Mode;
  view?: string;
  frame?: string;
  loupe?: boolean;
  angle?: number;
};

const layerNames = ["Toughened glass", "Interlayer", "Fabric", "Interlayer", "Toughened glass"];

/**
 * Fabric laminated between two sheets of glass. The weave is a masked, tinted texture,
 * so open weaves let the room (or the backlight) show through.
 */
export default function FabricPanel({
  fabric,
  color,
  backlight,
  exploded = false,
  mode = "studio",
  view,
  frame,
  loupe = false,
  angle = 0,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number; fx: number; fy: number } | null>(null);
  const info = fabrics.find((f) => f.id === fabric)!;
  const count = mode === "shutter" ? 2 : mode === "wall" ? 3 : 1;
  const R = 70;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!loupe || exploded || !wrapRef.current) return;
    const panel = (e.target as HTMLElement).closest(".fg-panel");
    if (!panel) {
      setLens(null);
      return;
    }
    const w = wrapRef.current.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    setLens({ x: e.clientX - w.left, y: e.clientY - w.top, fx: e.clientX - p.left, fy: e.clientY - p.top });
  };

  const style = {
    "--fc": color,
    "--tex": `url(${texUrl(fabric)})`,
    "--ts": info.tile,
    "--ang": `${angle}deg`,
    ...(view ? { "--view": `url(${view})` } : {}),
    ...(frame ? { "--frame": frame } : {}),
  } as React.CSSProperties;

  return (
    <div
      ref={wrapRef}
      className={`fg-wrap fg-${mode}${backlight ? " is-lit" : ""}${exploded ? " is-exploded" : ""}${frame ? " is-framed" : ""}${info.metal ? " is-metal" : ""}`}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={() => setLens(null)}
    >
      <div className="fg-scene">
        {Array.from({ length: count }).map((_, i) => (
          <div className="fg-panel" key={i}>
            <span className="fg-light" />
            {[-2, -1, 0, 1, 2].map((k) => (
              <span key={k} className={`fg-layer ${k === 0 ? "fg-fabric" : Math.abs(k) === 1 ? "fg-inter" : "fg-glass"}`} style={{ "--k": k } as React.CSSProperties}>
                {k === 0 && <i />}
                {k === 2 && <b className="fg-sheen" />}
              </span>
            ))}
            {frame && <span className="fg-frame" />}
            {mode === "shutter" && <span className={`fg-knob ${i === 0 ? "r" : "l"}`} />}
          </div>
        ))}
      </div>

      {exploded && (
        <ol className="fg-legend" aria-label="Layers, front to back">
          {layerNames.map((n, i) => (
            <li key={i} className={i === 2 ? "is-fabric" : ""} style={{ "--d": i * 90 } as React.CSSProperties}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {n}
            </li>
          ))}
        </ol>
      )}

      {lens && (
        <div className="fg-loupe" style={{ left: lens.x - R, top: lens.y - R, width: R * 2, height: R * 2 }} aria-hidden="true">
          <span
            className="fg-loupe-fab"
            style={{
              WebkitMaskPosition: `${-lens.fx * 3 + R}px ${-lens.fy * 3 + R}px`,
              maskPosition: `${-lens.fx * 3 + R}px ${-lens.fy * 3 + R}px`,
              backgroundPosition: `${-lens.fx * 3 + R}px ${-lens.fy * 3 + R}px`,
            }}
          >
            <i
              style={{
                backgroundPosition: `${-lens.fx * 3 + R}px ${-lens.fy * 3 + R}px`,
              }}
            />
          </span>
        </div>
      )}
    </div>
  );
}
