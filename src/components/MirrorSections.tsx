"use client";

import { useState } from "react";
import Lines from "./Lines";
import Mirror, { LightButton, type MirrorKind, type MirrorShape, type MirrorTone } from "./Mirror";
import { whatsappLink } from "@/lib/site";

type Design = {
  name: string;
  type: string;
  kind: MirrorKind;
  shape: MirrorShape;
  side: "left" | "right";
  angle: number;
  reflect: string;
  wall: string;
  description: string;
  specs: [string, string][];
};

const designs: Design[] = [
  {
    name: "Eclipse",
    type: "LED Mirror",
    kind: "eclipse",
    shape: "round",
    side: "left",
    angle: -16,
    reflect: "/images/reflect-bedroom.jpg",
    wall: "#161514",
    description:
      "A round mirror floats just in front of a backlit disc. Switch it on and an even ring of light glows out from behind the glass, like the corona of an eclipse.",
    specs: [
      ["Light", "Backlit LED disc"],
      ["Effect", "Even corona glow"],
      ["Best for", "Powder rooms, foyers"],
    ],
  },
  {
    name: "Pebble",
    type: "Plain Mirror",
    kind: "plain",
    shape: "pebble",
    side: "right",
    angle: 15,
    reflect: "/images/reflect-living.jpg",
    wall: "#141416",
    description:
      "An organic, hand-drawn outline that softens a hard-edged room. Distortion-free glass, cut to a shape that feels sculpted rather than manufactured.",
    specs: [
      ["Glass", "Distortion-free silver mirror"],
      ["Edge", "Polished, flat"],
      ["Best for", "Living rooms, dressers"],
    ],
  },
  {
    name: "Capsule",
    type: "Frame LED Mirror",
    kind: "frame-led",
    shape: "capsule",
    side: "left",
    angle: -20,
    reflect: "/images/reflect-vanity.jpg",
    wall: "#121213",
    description:
      "A tall pill in a slim black metal frame, with light running all the way around the inside edge. Flattering, even light for getting ready.",
    specs: [
      ["Frame", "Slim black metal"],
      ["Light", "Integrated front-lit ring"],
      ["Best for", "Vanities, dressing areas"],
    ],
  },
  {
    name: "Frost Arch",
    type: "LED Mirror",
    kind: "frost",
    shape: "tombstone",
    side: "right",
    angle: 17,
    reflect: "/images/reflect-studio.jpg",
    wall: "#171615",
    description:
      "A frosted band etched into the glass glows from within, tracing the arch in soft light. Front-lit, so the mirror doubles as the vanity light.",
    specs: [
      ["Light", "Frosted LED band"],
      ["Shape", "Classic arch"],
      ["Best for", "Bathrooms, entryways"],
    ],
  },
];

const tones: MirrorTone[] = ["warm", "neutral", "cool"];

function DesignSection({ d, index }: { d: Design; index: number }) {
  const [on, setOn] = useState(false);
  const [tone, setTone] = useState<MirrorTone>("warm");
  const toggle = () => setOn((o) => !o);
  const num = String(index + 1).padStart(2, "0");

  return (
    <section
      className={`ms-section ms-${d.side} tone-${tone}${on ? " is-lit" : ""}`}
      style={{ "--wall": d.wall } as React.CSSProperties}
      aria-label={`${d.name} ${d.type}`}
    >
      <div className="ms-stage">
        <span className="ms-num" aria-hidden="true">
          {num}
        </span>
        <div data-parallax="0.06">
          <div className="ms-anim reveal" style={{ "--from": d.side === "left" ? 1 : -1 } as React.CSSProperties}>
            <Mirror
              kind={d.kind}
              shape={d.shape}
              on={on}
              tone={tone}
              angle={d.angle}
              reflect={d.reflect}
              label={`${d.name} mirror`}
              onToggle={toggle}
            />
          </div>
        </div>
      </div>

      <div className="ms-copy on-dark">
        <div className="t-eyebrow reveal">
          {num} · {d.type}
        </div>
        <Lines as="h3" className="t-display ms-title" lines={[<>{d.name}</>]} />
        <p className="t-lead reveal" style={{ "--d": 120 } as React.CSSProperties}>
          {d.description}
        </p>
        <dl className="ms-specs reveal" style={{ "--d": 200 } as React.CSSProperties}>
          {d.specs.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="ms-controls reveal" style={{ "--d": 280 } as React.CSSProperties}>
          <LightButton on={on} onToggle={toggle} name={d.name} />
          <div className="tones" role="radiogroup" aria-label={`${d.name} light colour`}>
            {tones.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={tone === t}
                className={`tone tone-${t}${tone === t ? " is-active" : ""}`}
                onClick={() => {
                  setTone(t);
                  setOn(true);
                }}
              >
                <i />
                {t}
              </button>
            ))}
          </div>
        </div>
        <a
          className="link-line reveal"
          style={{ "--d": 340, alignSelf: "flex-start" } as React.CSSProperties}
          href={whatsappLink(`Hi Vawe, I'm interested in the ${d.name} ${d.type}.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire about {d.name} →
        </a>
      </div>
    </section>
  );
}

export default function MirrorSections() {
  return (
    <div className="ms-list">
      {designs.map((d, i) => (
        <DesignSection key={d.name} d={d} index={i} />
      ))}
    </div>
  );
}
