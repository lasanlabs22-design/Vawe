"use client";

import { useState } from "react";
import Lines from "./Lines";
import Partition, { glassTypes, usePartition, views, type GlassId, type Mechanism } from "./Partition";
import { ActionButton } from "./Shutter";
import { slidingFrames } from "@/lib/sliding";
import { whatsappLink } from "@/lib/site";

export const mechanisms: { id: Mechanism; label: string; short: string }[] = [
  { id: "synchro", label: "Synchro Sliding", short: "Synchro" },
  { id: "telescopic", label: "Telescopic Sliding", short: "Telescopic" },
  { id: "bifold", label: "Bi-Fold", short: "Bi-Fold" },
  { id: "slidefold", label: "Slide cum Fold", short: "Slide & Fold" },
];

/** Range input bound to the partition's opening progress. */
export function OpenSlider({ t, onChange }: { t: number; onChange: (v: number) => void }) {
  return (
    <label className="pt-range">
      <span>Closed</span>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(Math.min(1, Math.max(0, t)) * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        style={{ "--v": `${Math.min(1, Math.max(0, t)) * 100}%` } as React.CSSProperties}
        aria-label="Opening"
      />
      <span>Open</span>
    </label>
  );
}

export default function PartitionStudio() {
  const { t, set, animateTo, stop } = usePartition(0);
  const [mech, setMech] = useState<Mechanism>("bifold");
  const [frame, setFrame] = useState("black");
  const [glass, setGlass] = useState<GlassId>("fluted");
  const [view, setView] = useState(views[0].id);
  const [evening, setEvening] = useState(false);
  const open = t > 0.5;

  const chooseMech = async (m: Mechanism) => {
    setMech(m);
    set(0);
    await animateTo(1, 1900); // demonstrate the new mechanism
  };

  const frameLabel = slidingFrames.find((f) => f.id === frame)!.label;
  const summary = [
    mechanisms.find((m) => m.id === mech)!.label,
    `${frameLabel} frame`,
    glassTypes.find((g) => g.id === glass)!.label,
  ];

  return (
    <section className="ss dark on-dark tone-warm" id="partition-config">
      <div className="container ss-head">
        <div>
          <div className="t-eyebrow reveal">Partition studio</div>
          <Lines
            className="t-h2"
            lines={[
              <>Open the room.</>,
              <>
                <em>Your way.</em>
              </>,
            ]}
          />
        </div>
        <p className="t-lead reveal">
          Choose a mechanism and watch it move. Drag across the glass, scrub the slider, or press open. Then pick the
          frame, the glass and the room behind it.
        </p>
      </div>

      <div className="ss-grid">
        <div className={`ss-stage pt-stage${evening ? " is-lit" : ""}`}>
          <span className="sl-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 12h16M4 12l3-3M4 12l3 3M20 12l-3-3M20 12l-3 3" />
            </svg>
            Drag across the glass
          </span>
          <div className="ms-anim reveal" style={{ "--from": 1 } as React.CSSProperties}>
            <Partition
              mech={mech}
              t={t}
              onDrag={set}
              onDragStart={stop}
              frame={slidingFrames.find((f) => f.id === frame)!.value}
              glass={glass}
              view={views.find((v) => v.id === view)!.src}
              evening={evening}
              angle={-10}
            />
          </div>
          <OpenSlider
            t={t}
            onChange={(v) => {
              stop();
              set(v);
            }}
          />
          <div className="ss-actions">
            <ActionButton
              icon="doors"
              on={open}
              onToggle={() => animateTo(open ? 0 : 1)}
              labelOff="Open partition"
              labelOn="Close partition"
              hintOff="Watch it move"
              hintOn="Fully open"
            />
            <ActionButton
              icon="light"
              on={evening}
              onToggle={() => setEvening((e) => !e)}
              labelOff="Evening mode"
              labelOn="Evening"
              hintOff="Dim the room"
              hintOn="Back to daylight"
            />
          </div>
        </div>

        <div className="ss-panel">
          <fieldset className="ss-group">
            <legend>Mechanism</legend>
            <div className="seg sl-kinds">
              {mechanisms.map((m) => (
                <button key={m.id} type="button" className={mech === m.id ? "is-active" : ""} aria-pressed={mech === m.id} onClick={() => chooseMech(m.id)}>
                  {m.short}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-group">
            <legend>
              Frame <span>{frameLabel}</span>
            </legend>
            <div className="swatches">
              {slidingFrames.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`sw-metal${frame === f.id ? " is-active" : ""}`}
                  style={{ "--c": f.value } as React.CSSProperties}
                  aria-label={f.label}
                  aria-pressed={frame === f.id}
                  onClick={() => setFrame(f.id)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-group">
            <legend>
              Glass <span>{glassTypes.find((g) => g.id === glass)!.label}</span>
            </legend>
            <div className="swatches">
              {glassTypes.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`sl-opt${glass === g.id ? " is-active" : ""}`}
                  aria-label={g.label}
                  aria-pressed={glass === g.id}
                  onClick={() => setGlass(g.id)}
                >
                  <span className="pt-swatch" style={{ backgroundImage: `url(${views[0].src})` }}>
                    <span className={`pt-glass pg-${g.id}`} />
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-group">
            <legend>
              Room beyond <span>{views.find((v) => v.id === view)!.label}</span>
            </legend>
            <div className="swatches">
              {views.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`sl-opt pt-room${view === v.id ? " is-active" : ""}`}
                  aria-label={v.label}
                  aria-pressed={view === v.id}
                  onClick={() => setView(v.id)}
                  style={{ backgroundImage: `url(${v.src})` }}
                />
              ))}
            </div>
          </fieldset>

          <div className="ss-summary">
            <span className="t-mono">Your partition</span>
            <p>{summary.join(" · ")}</p>
            <a
              className="btn btn-pink"
              href={whatsappLink(`Hi Vawe, I'd like a quote for a sliding partition: ${summary.join(", ")}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get a quote for this <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
