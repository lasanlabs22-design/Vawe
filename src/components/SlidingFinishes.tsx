"use client";

import { useState } from "react";
import Lines from "./Lines";
import Sliding, { homePositions, revealPositions } from "./Sliding";
import { ActionButton } from "./Shutter";
import { FinishSwatch } from "./SlidingStudio";
import { finishKinds, finishOptions, optionLabel, slidingFrames, type FinishKind } from "@/lib/sliding";
import { whatsappLink } from "@/lib/site";

const frameFor: Record<FinishKind, string> = {
  tinted: "black",
  lacquer: "champagne",
  fabric: "bronze",
  cane: "gold",
  print: "graphite",
};
const walls = ["#171513", "#131416", "#161412", "#141514", "#151416"];

function FinishSection({ kind, index }: { kind: FinishKind; index: number }) {
  const info = finishOptions[kind];
  const [value, setValue] = useState(info.options[kind === "lacquer" ? 2 : 0].value);
  const [positions, setPositions] = useState(homePositions(2));
  const [light, setLight] = useState(kind === "tinted" || kind === "cane");
  const side = index % 2 === 0 ? "left" : "right";
  const open = positions[0] > 0.01;
  const num = String(index + 1).padStart(2, "0");
  const frame = slidingFrames.find((f) => f.id === frameFor[kind])!.value;

  return (
    <section
      className={`ms-section ms-${side} tone-warm${light ? " is-lit" : ""}`}
      style={{ "--wall": walls[index] } as React.CSSProperties}
      aria-label={`${info.label} sliding wardrobe shutters`}
    >
      <div className="ms-stage sp-stage">
        <span className="ms-num" aria-hidden="true">
          {num}
        </span>
        <div data-parallax="0.05">
          <div className="ms-anim reveal" style={{ "--from": side === "left" ? 1 : -1 } as React.CSSProperties}>
            <Sliding
              panels={2}
              positions={positions}
              onPositions={setPositions}
              frame={frame}
              finish={{ kind, value }}
              light={light}
              angle={side === "left" ? -15 : 15}
              label={`${info.label} wardrobe`}
            />
          </div>
        </div>
      </div>

      <div className="ms-copy on-dark">
        <div className="t-eyebrow reveal">
          {num} · {info.note}
        </div>
        <Lines as="h3" className="t-display ms-title" lines={[<>{info.label}</>]} />
        <p className="t-lead reveal">{info.description}</p>

        <div className="ss-group reveal">
          <span className="sp-legend">
            {kind === "print" ? "Artwork" : "Shade"} <span className="sl-legend-val">{optionLabel({ kind, value })}</span>
          </span>
          <div className="swatches">
            {info.options.map((o) => (
              <button
                key={o.id}
                type="button"
                className={`sl-opt${value === o.value ? " is-active" : ""}`}
                aria-label={o.label}
                aria-pressed={value === o.value}
                onClick={() => setValue(o.value)}
              >
                <FinishSwatch kind={kind} value={o.value} />
              </button>
            ))}
          </div>
        </div>

        <div className="ms-controls reveal">
          <ActionButton
            icon="doors"
            on={open}
            onToggle={() => setPositions(open ? homePositions(2) : revealPositions(2, 0))}
            labelOff="Slide open"
            labelOn="Slide closed"
            hintOff="Or drag a panel"
            hintOn="Panel is open"
          />
          <ActionButton icon="light" on={light} onToggle={() => setLight((l) => !l)} labelOff="Interior light" labelOn="Light on" size="sm" />
        </div>
        <a
          className="link-line reveal"
          style={{ alignSelf: "flex-start" }}
          href={whatsappLink(`Hi Vawe, I'm interested in ${info.label.toLowerCase()} sliding wardrobe shutters.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire about {info.label} →
        </a>
      </div>
    </section>
  );
}

export default function SlidingFinishes() {
  return (
    <div className="ms-list">
      {finishKinds.map((k, i) => (
        <FinishSection key={k} kind={k} index={i} />
      ))}
    </div>
  );
}
