"use client";

import { useEffect, useRef, useState } from "react";
import Lines from "./Lines";
import Partition, { usePartition, views, type GlassId, type Mechanism } from "./Partition";
import { mechanisms, OpenSlider } from "./PartitionStudio";
import { ActionButton } from "./Shutter";
import { slidingSystems } from "@/lib/collections";
import { slidingFrames } from "@/lib/sliding";
import { whatsappLink } from "@/lib/site";

const presets: { mech: Mechanism; frame: string; glass: GlassId; view: string; wall: string }[] = [
  { mech: "synchro", frame: "black", glass: "clear", view: "living", wall: "#171513" },
  { mech: "telescopic", frame: "champagne", glass: "tinted", view: "terrace", wall: "#131416" },
  { mech: "bifold", frame: "graphite", glass: "grid", view: "dining", wall: "#161412" },
  { mech: "slidefold", frame: "bronze", glass: "fluted", view: "office", wall: "#141514" },
];

function MechSection({ index }: { index: number }) {
  const p = presets[index];
  const info = mechanisms[index];
  const copy = slidingSystems[index];
  const { t, set, animateTo, stop } = usePartition(0);
  const [evening, setEvening] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const played = useRef(false);
  const side = index % 2 === 0 ? "left" : "right";
  const num = String(index + 1).padStart(2, "0");
  const open = t > 0.5;

  // play a short open-and-close demo the first time the section is seen
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || played.current) return;
        played.current = true;
        io.disconnect();
        await new Promise((r) => setTimeout(r, 900));
        await animateTo(1, 2000);
        await new Promise((r) => setTimeout(r, 1100));
        await animateTo(0, 1800);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animateTo]);

  return (
    <section
      ref={ref}
      className={`ms-section ms-${side} tone-warm${evening ? " is-lit" : ""}`}
      style={{ "--wall": p.wall } as React.CSSProperties}
      aria-label={info.label}
    >
      <div className="ms-stage sp-stage pt-sec-stage">
        <span className="ms-num" aria-hidden="true">
          {num}
        </span>
        <div data-parallax="0.04">
          <div className="ms-anim reveal" style={{ "--from": side === "left" ? 1 : -1 } as React.CSSProperties}>
            <Partition
              mech={p.mech}
              t={t}
              onDrag={set}
              onDragStart={stop}
              frame={slidingFrames.find((f) => f.id === p.frame)!.value}
              glass={p.glass}
              view={views.find((v) => v.id === p.view)!.src}
              evening={evening}
              angle={side === "left" ? -12 : 12}
            />
          </div>
        </div>
        <OpenSlider
          t={t}
          onChange={(v) => {
            stop();
            set(v);
          }}
        />
      </div>

      <div className="ms-copy on-dark">
        <div className="t-eyebrow reveal">
          {num} · Sliding partition
        </div>
        <Lines as="h3" className="t-display ms-title" lines={[<>{info.short}</>]} />
        <p className="t-lead reveal">{copy.description}</p>
        <dl className="ms-specs reveal">
          <div>
            <dt>Panels</dt>
            <dd>{p.mech === "telescopic" ? "3 on 3 tracks" : "4 panels"}</dd>
          </div>
          <div>
            <dt>Opens</dt>
            <dd>{p.mech === "synchro" ? "From the centre" : "To one side"}</dd>
          </div>
          <div>
            <dt>Shown with</dt>
            <dd>
              {slidingFrames.find((f) => f.id === p.frame)!.label} frame, {p.glass === "grid" ? "black grid" : p.glass} glass
            </dd>
          </div>
        </dl>
        <div className="ms-controls reveal">
          <ActionButton
            icon="doors"
            on={open}
            onToggle={() => animateTo(open ? 0 : 1)}
            labelOff="Open partition"
            labelOn="Close partition"
            hintOff="Or drag across the glass"
            hintOn="Fully open"
          />
          <ActionButton icon="light" on={evening} onToggle={() => setEvening((e) => !e)} labelOff="Evening" labelOn="Evening" size="sm" />
        </div>
        <a
          className="link-line reveal"
          style={{ alignSelf: "flex-start" }}
          href={whatsappLink(`Hi Vawe, I'm interested in a ${info.label} partition.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire about {info.short} →
        </a>
      </div>
    </section>
  );
}

export default function PartitionSections() {
  return (
    <div className="ms-list">
      {presets.map((_, i) => (
        <MechSection key={i} index={i} />
      ))}
    </div>
  );
}
