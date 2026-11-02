"use client";

import Link from "next/link";
import { useState } from "react";
import Lines from "./Lines";
import Mirror, { LightButton, type MirrorKind, type MirrorShape, type MirrorTone } from "./Mirror";

const types: { kind: MirrorKind; shape: MirrorShape; name: string; note: string; description: string }[] = [
  {
    kind: "led",
    shape: "round",
    name: "LED Mirror",
    note: "Backlit",
    description: "A soft, even halo of light from behind the glass, with no visible fittings.",
  },
  {
    kind: "frame-led",
    shape: "capsule",
    name: "Frame LED Mirror",
    note: "Framed",
    description: "A slim metal frame with integrated light running around the edge.",
  },
  {
    kind: "plain",
    shape: "tombstone",
    name: "Plain Mirror",
    note: "Classic",
    description: "Distortion-free mirror glass cut to any size or shape.",
  },
  {
    kind: "bevelled",
    shape: "squircle",
    name: "Bevelled Mirror",
    note: "Bevelled",
    description: "Precision-ground angled edges that catch light in a fine, prismatic outline.",
  },
];

const tones: { id: MirrorTone; label: string }[] = [
  { id: "warm", label: "Warm" },
  { id: "neutral", label: "Neutral" },
  { id: "cool", label: "Cool" },
];

export default function MirrorShowcase() {
  const [active, setActive] = useState(0);
  const [on, setOn] = useState(false);
  const [tone, setTone] = useState<MirrorTone>("warm");
  const t = types[active];

  return (
    <section className="spot dark on-dark" id="mirrors">
      <div className={`spot-media mirror-stage tone-${tone}${on ? " is-lit" : ""}`}>
        <div className="stage-label">
          <span className="t-mono">
            0{active + 1} / 0{types.length}
          </span>
          <span className="stage-name">{t.name}</span>
        </div>

        <div className="stage-center">
          <Mirror kind={t.kind} shape={t.shape} on={on} tone={tone} label={t.name} onToggle={() => setOn((o) => !o)} />
        </div>

        <div className="stage-controls">
          <LightButton on={on} onToggle={() => setOn((o) => !o)} name={t.name} />
          <div className="tones" role="radiogroup" aria-label="Light colour">
            {tones.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={tone === x.id}
                className={`tone tone-${x.id}${tone === x.id ? " is-active" : ""}`}
                onClick={() => {
                  setTone(x.id);
                  setOn(true);
                }}
              >
                <i />
                {x.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="spot-copy">
        <div className="t-eyebrow reveal">Mirrors</div>
        <Lines
          className="t-h2"
          lines={[
            <>Light,</>,
            <>
              <em>reflected.</em>
            </>,
          ]}
        />
        <p className="t-lead reveal">
          Choose a mirror, then switch on its light. Every Vawe mirror is cut and finished to size, with integrated
          LED options for vanities, dressers and entryways.
        </p>
        <ul className="spot-list">
          {types.map((x, i) => (
            <li key={x.kind} className="reveal" style={{ "--d": i * 100 } as React.CSSProperties}>
              <button
                type="button"
                className={`spot-item${active === i ? " is-active" : ""}`}
                aria-pressed={active === i}
                onClick={() => setActive(i)}
              >
                <span className={`mini-mirror mm-${x.shape}${active === i && on ? " is-on" : ""}`} aria-hidden="true" />
                <span>
                  <b>{x.name}</b>
                  <span>{x.description}</span>
                </span>
                <span className="spot-note">{x.note}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="reveal" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/collections/mirrors" className="btn btn-pink">
            Explore mirrors <span className="arrow">→</span>
          </Link>
          <Link href="/gallery/mirrors" className="btn btn-ghost-light">
            All 48 designs
          </Link>
        </div>
      </div>
    </section>
  );
}
