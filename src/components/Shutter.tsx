"use client";

import { useRef } from "react";
import type { InsertId, ProfileId } from "@/lib/shutters";

type Props = {
  doors?: number;
  profile: ProfileId;
  frame: string;
  hinge: string;
  insert: InsertId;
  open: boolean;
  light: boolean;
  angle?: number;
  onToggle: () => void;
  label?: string;
};

/**
 * CSS-3D wardrobe with aluminium-profile openable shutters.
 * Real interior photograph, mitred brushed-metal frames, glass inserts you can see through,
 * soft-close door swing, LED strip power-on and floating dust in the light.
 */
export default function Shutter({
  doors = 2,
  profile,
  frame,
  hinge,
  insert,
  open,
  light,
  angle = 0,
  onToggle,
  label = "cabinet",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

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
    "--frame": frame,
    "--hinge": hinge,
    "--n": doors,
    "--ang": `${angle}deg`,
  } as React.CSSProperties;

  return (
    <div
      ref={ref}
      className={`cab-wrap p-${profile}${open ? " is-open" : ""}${light ? " is-lit" : ""}`}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="cab-floor" aria-hidden="true" />
      <div
        className="cab"
        role="button"
        tabIndex={0}
        aria-pressed={open}
        aria-label={`${open ? "Close" : "Open"} the ${label} shutters`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        {/* carcass + interior */}
        <span className="cab-back" />
        <span className="cab-side cab-left" />
        <span className="cab-side cab-right" />
        <span className="cab-top" />
        <span className="cab-bottom" />
        <span className="cab-glow" />
        <span className="cab-led" />
        <span className="cab-face" />

        {/* doors */}
        <span className="cab-doors">
          {Array.from({ length: doors }).map((_, i) => {
            const side = i % 2 === 0 ? "l" : "r";
            return (
              <span className={`door door-${side}`} key={i} style={{ "--i": i } as React.CSSProperties}>
                <span className="door-face door-front">
                  <span className={`door-insert ins-${insert}`}>
                    <span className="glass-sheen" />
                    <span key={insert} className="ins-flash" />
                  </span>
                  <i className="bar bar-top" />
                  <i className="bar bar-bottom" />
                  <i className="bar bar-left" />
                  <i className="bar bar-right" />
                  {profile === "cnc" && <span className="door-groove" />}
                  {profile === "regular" && <span className="door-handle" />}
                  {profile === "slim" && <span className="door-pull" />}
                </span>
                <span className="door-face door-backside">
                  <span className={`door-insert ins-${insert} is-back`} />
                  <i className="bar bar-top" />
                  <i className="bar bar-bottom" />
                  <i className="bar bar-left" />
                  <i className="bar bar-right" />
                </span>
                <span className="door-edge" />
              </span>
            );
          })}
        </span>

        {/* hinge barrels on the hinge edge of each door */}
        <span className="cab-hinges" aria-hidden="true">
          {Array.from({ length: doors }).map((_, i) => (
            <span
              key={i}
              className={`hinge-col hinge-${i % 2 === 0 ? "l" : "r"}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <i />
              <i />
              <i />
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

/** Tactile action button matching the mirror light button. */
export function ActionButton({
  on,
  onToggle,
  labelOn,
  labelOff,
  hintOn,
  hintOff,
  icon,
  size = "md",
}: {
  on: boolean;
  onToggle: () => void;
  labelOn: string;
  labelOff: string;
  hintOn?: string;
  hintOff?: string;
  icon: "doors" | "light";
  size?: "sm" | "md";
}) {
  return (
    <button type="button" className={`pwr pwr-${size}${on ? " is-on" : ""}`} aria-pressed={on} onClick={onToggle}>
      <span className="pwr-icon" aria-hidden="true">
        {icon === "doors" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M3 4h18v16H3z" />
            <path d="M12 4v16" />
            <path d="M9.5 11v2M14.5 11v2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 18h6M10 21h4" />
            <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
          </svg>
        )}
      </span>
      <span className="pwr-text">
        <b>{on ? labelOn : labelOff}</b>
        {size === "md" && (hintOn || hintOff) && <small>{on ? hintOn : hintOff}</small>}
      </span>
    </button>
  );
}
