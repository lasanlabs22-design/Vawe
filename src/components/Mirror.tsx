"use client";

import { useRef } from "react";

export type MirrorKind = "plain" | "led" | "frame-led" | "bevelled" | "eclipse" | "frost";
export type MirrorShape =
  | "round"
  | "arch"
  | "capsule"
  | "rect"
  | "oval"
  | "pebble"
  | "squircle"
  | "tombstone"
  | "egg"
  | "fulllength"
  | "halfarch";
export type MirrorFinish = "gold" | "fluted" | "cane" | "baroque" | "walnut" | "ivory" | "onyx" | "none";
export type MirrorTone = "warm" | "neutral" | "cool";

type Props = {
  kind: MirrorKind;
  shape: MirrorShape;
  on: boolean;
  onToggle: () => void;
  tone?: MirrorTone;
  label: string;
  /** Resting viewing angle in degrees (rotateY); the glass edge shows as depth. */
  angle?: number;
  /** Image reflected (blurred) in the glass. */
  reflect?: string;
  /** Frame material for plain mirrors. */
  finish?: MirrorFinish;
  className?: string;
};

/**
 * CSS-rendered mirror: tilts toward the pointer, shows a soft moving reflection,
 * and lights up (backlit halo / LED ring / frosted band / eclipse disc / prismatic bevel) when switched on.
 */
export default function Mirror({
  kind,
  shape,
  on,
  onToggle,
  tone = "neutral",
  label,
  angle = 0,
  reflect,
  finish = "none",
  className = "",
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    ref.current.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };

  const style = {
    "--ang": `${angle}deg`,
    ...(reflect ? { "--reflect": `url(${reflect})` } : {}),
  } as React.CSSProperties;

  return (
    <button
      ref={ref}
      type="button"
      className={`mirror m-${kind} m-${shape} fin-${finish} tone-${tone}${on ? " is-on" : ""} ${className}`}
      style={style}
      aria-pressed={on}
      aria-label={`${on ? "Turn off" : "Turn on"} the light of the ${label}`}
      onClick={onToggle}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className="m-wash" aria-hidden="true" />
      <span className="m-body" aria-hidden="true">
        {kind === "eclipse" && <span className="m-disc" />}
        <span className="m-edge" />
        <span className="m-halo" />
        <span className="m-frame">
          <span className="m-glass">
            <span className="m-reflect" />
            <span className="m-sheen" />
            {kind === "frost" && <span className="m-frost-band" />}
            <span className="m-ring" />
          </span>
        </span>
      </span>
    </button>
  );
}

/** A real, tactile light switch for mirrors. */
export function LightButton({
  on,
  onToggle,
  size = "md",
  name,
}: {
  on: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
  name?: string;
}) {
  return (
    <button
      type="button"
      className={`pwr pwr-${size}${on ? " is-on" : ""}`}
      aria-pressed={on}
      aria-label={name ? `${on ? "Switch off" : "Switch on"} the ${name} light` : undefined}
      onClick={onToggle}
    >
      <span className="pwr-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 3v8" />
          <path d="M6.3 6.8a8 8 0 1 0 11.4 0" />
        </svg>
      </span>
      <span className="pwr-text">
        <b>{on ? "Light on" : "Switch on light"}</b>
        {size === "md" && <small>{on ? "Press to switch off" : "Press to see it glow"}</small>}
      </span>
    </button>
  );
}
