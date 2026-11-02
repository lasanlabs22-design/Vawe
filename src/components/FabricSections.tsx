"use client";

import { useState } from "react";
import Lines from "./Lines";
import FabricPanel from "./FabricPanel";
import { FabricPickers } from "./FabricStudio";
import { ActionButton } from "./Shutter";
import { getCollection } from "@/lib/collections";
import { colorsFor, type FabricId } from "@/lib/fabric";
import { whatsappLink } from "@/lib/site";

const presets: {
  mode: "divider" | "shutter" | "wall";
  fabric: FabricId;
  color: number;
  light: boolean;
  view?: string;
  frame?: string;
  wall: string;
}[] = [
  { mode: "divider", fabric: "sheer", color: 1, light: false, view: "/images/sliding-partitions.jpg", frame: "#1c1c1e", wall: "#161514" },
  { mode: "shutter", fabric: "herringbone", color: 4, light: false, frame: "#c9a14e", wall: "#141516" },
  { mode: "wall", fabric: "jacquard", color: 0, light: true, wall: "#151413" },
];

const variants = getCollection("fabric-glass")!.variants;

function ApplicationSection({ index }: { index: number }) {
  const p = presets[index];
  const [fabric, setFabric] = useState<FabricId>(p.fabric);
  const [color, setColor] = useState(colorsFor(p.fabric)[p.color].value);
  const [light, setLight] = useState(p.light);
  const side = index % 2 === 0 ? "left" : "right";
  const num = String(index + 1).padStart(2, "0");
  const v = variants[index];

  return (
    <section className={`ms-section ms-${side} tone-warm${light ? " is-lit" : ""}`} style={{ "--wall": p.wall } as React.CSSProperties} aria-label={v.name}>
      <div className="ms-stage fg-sec-stage">
        <span className="ms-num" aria-hidden="true">
          {num}
        </span>
        <div className="reveal">
          <FabricPanel fabric={fabric} color={color} backlight={light} mode={p.mode} view={p.view} frame={p.frame} angle={side === "left" ? -8 : 8} />
        </div>
      </div>

      <div className="ms-copy on-dark">
        <div className="t-eyebrow reveal">
          {num} · Fabric glass
        </div>
        <Lines as="h3" className="t-display ms-title" lines={[<>{v.name}</>]} />
        <p className="t-lead reveal">{v.description}</p>
        <div className="reveal fg-sec-pickers">
          <FabricPickers fabric={fabric} color={color} onFabric={setFabric} onColor={setColor} />
        </div>
        <div className="ms-controls reveal">
          <ActionButton icon="light" on={light} onToggle={() => setLight((l) => !l)} labelOff="Backlight" labelOn="Backlight on" size="sm" />
        </div>
        <a
          className="link-line reveal"
          style={{ alignSelf: "flex-start" }}
          href={whatsappLink(`Hi Vawe, I'm interested in fabric glass for ${v.name.toLowerCase()}.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire about {v.name} →
        </a>
      </div>
    </section>
  );
}

export default function FabricSections() {
  return (
    <div className="ms-list">
      {presets.map((_, i) => (
        <ApplicationSection key={i} index={i} />
      ))}
    </div>
  );
}
