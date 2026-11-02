"use client";

import { useState } from "react";
import Lines from "./Lines";
import Shower, { enclosureTypes, hardware, showerGlass, type EnclosureType, type ShowerGlass } from "./Shower";
import { ShowerControls } from "./ShowerStudio";
import { getCollection } from "@/lib/collections";
import { whatsappLink } from "@/lib/site";

const presets: { type: EnclosureType; glass: ShowerGlass; hw: string; wall: string }[] = [
  { type: "fixed", glass: "clear", hw: "black", wall: "#161514" },
  { type: "hinged", glass: "band", hw: "gold", wall: "#141516" },
  { type: "sliding", glass: "fluted", hw: "chrome", wall: "#151413" },
];

const variants = getCollection("bathroom-partitions")!.variants;

function TypeSection({ index }: { index: number }) {
  const p = presets[index];
  const info = enclosureTypes[index];
  const [hw, setHw] = useState(p.hw);
  const [open, setOpen] = useState(false);
  const [water, setWater] = useState(false);
  const side = index % 2 === 0 ? "left" : "right";
  const num = String(index + 1).padStart(2, "0");
  const hwInfo = hardware.find((h) => h.id === hw)!;

  return (
    <section className={`ms-section ms-${side} bt-section`} style={{ "--wall": p.wall } as React.CSSProperties} aria-label={info.label}>
      <div className="ms-stage bt-sec-stage">
        <span className="ms-num" aria-hidden="true">
          {num}
        </span>
        <div className="reveal">
          <Shower
            type={p.type}
            glass={p.glass}
            hw={hwInfo.value}
            open={open}
            water={water}
            angle={side === "left" ? -10 : 10}
            onToggleDoor={() => setOpen((o) => !o)}
          />
        </div>
      </div>

      <div className="ms-copy on-dark">
        <div className="t-eyebrow reveal">
          {num} · Bathroom partition
        </div>
        <Lines as="h3" className="t-display ms-title" lines={[<>{variants[index].name}</>]} />
        <p className="t-lead reveal">{variants[index].description}</p>
        <dl className="ms-specs reveal">
          <div>
            <dt>Layout</dt>
            <dd>{info.label}</dd>
          </div>
          <div>
            <dt>Shown with</dt>
            <dd>{showerGlass.find((g) => g.id === p.glass)!.label} glass</dd>
          </div>
        </dl>

        <div className="ss-group reveal">
          <span className="sp-legend">
            Hardware <span className="sl-legend-val">{hwInfo.label}</span>
          </span>
          <div className="swatches">
            {hardware.map((h) => (
              <button
                key={h.id}
                type="button"
                className={`sw-metal sw-round${hw === h.id ? " is-active" : ""}`}
                style={{ "--c": h.value } as React.CSSProperties}
                aria-label={h.label}
                aria-pressed={hw === h.id}
                onClick={() => setHw(h.id)}
              />
            ))}
          </div>
        </div>

        <div className="ms-controls reveal">
          <ShowerControls type={p.type} open={open} water={water} onDoor={() => setOpen((o) => !o)} onWater={() => setWater((w) => !w)} compact />
        </div>
        <a
          className="link-line reveal"
          style={{ alignSelf: "flex-start" }}
          href={whatsappLink(`Hi Vawe, I'm interested in a ${info.label.toLowerCase()} shower partition.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire about {info.short} →
        </a>
      </div>
    </section>
  );
}

export default function ShowerSections() {
  return (
    <div className="ms-list">
      {presets.map((_, i) => (
        <TypeSection key={i} index={i} />
      ))}
    </div>
  );
}
