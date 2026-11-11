"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";


import { whatsappLink } from "@/lib/site";
import { useHash } from "@/lib/focus";
import { focusKey } from "@/lib/series";

// Client sample card: these finishes belong to the Partition Series only.
const glassTypes = [
  { id: "clear", label: "Clear" },
  { id: "frosted", label: "Frosted" },
  { id: "brown-tinted", label: "Brown Tinted" },
  { id: "grey-tinted", label: "Grey Tinted" },
  { id: "mirror", label: "Mirror" },
  { id: "brown-mirror", label: "Brown Mirror" },
  { id: "line-fluted", label: "Line Fluted" },
  { id: "clear-fluted", label: "Clear Fluted" },
  { id: "brown-fluted", label: "Brown Fluted" },
  { id: "grey-fluted", label: "Grey Fluted" },
] as const;
type GlassId = typeof glassTypes[number]["id"];

type Mechanism = "synchro" | "telescopic" | "ghost" | "pooja" | "slidefold";
const mechanisms: { id: Mechanism; label: string; description: string; width: number; height: number; opening: number[]; glass: GlassId }[] = [
  { id: "synchro", label: "Synchro", description: "Two linked centre panels glide apart together, stacking over the side panels.", width: 1254, height: 1254, opening: [3.5, 11.2, 93.5, 82.1], glass: "clear" },
  { id: "telescopic", label: "Telescopic", description: "Three panels travel together on parallel tracks and stack neatly to the right.", width: 736, height: 414, opening: [7.2, 9.5, 82.5, 82.5], glass: "clear" },
  { id: "ghost", label: "Ghost", description: "A single glass leaf glides across the wall with its sliding hardware concealed.", width: 814, height: 998, opening: [23, 6.3, 69, 89], glass: "clear" },
  { id: "pooja", label: "Pooja Bi-Fold", description: "A paired glass door folds to the side to open up your pooja space.", width: 360, height: 640, opening: [28.7, 25, 61, 59.7], glass: "clear" },
  { id: "slidefold", label: "Slide & Fold", description: "Glass panels slide and fold into a compact stack at the side of the opening.", width: 736, height: 736, opening: [15.5, 14.5, 64.8, 73.3], glass: "clear" },
];

const partitionFrames = [
  { id: "black", label: "Black", value: "#1c1c1e" },
  { id: "brush-gold", label: "Brush Gold", value: "#c9a14e" },
  { id: "rose-gold", label: "Rose Gold", value: "#c39486" },
];

const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** Continuous, reversible motion. No spring overshoot through the door stops. */
export function useOpening() {
  const [progress, setProgress] = useState(0);
  const value = useRef(0);
  const raf = useRef(0);
  const set = useCallback((n: number) => {
    cancelAnimationFrame(raf.current);
    value.current = clamp(n);
    setProgress(value.current);
  }, []);
  const animate = useCallback((target: number) => {
    cancelAnimationFrame(raf.current);
    const start = value.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { set(target); return; }
    const duration = Math.max(250, Math.abs(target - start) * 1800);
    const began = performance.now();
    const tick = (now: number) => {
      const t = clamp((now - began) / duration);
      const eased = t * t * (3 - 2 * t);
      value.current = start + (target - start) * eased;
      setProgress(value.current);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [set]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { progress, set, animate };
}

/** Panel positions use one shared progress value so paired hinges never separate. */
function leaves(mech: Mechanism, t: number) {
  if (mech === "ghost") return [{ x: -t * 98, width: 100, angle: 0, origin: "left", z: 2 }];
  if (mech === "synchro") return [
    { x: 0, width: 25, angle: 0, origin: "left", z: 1 },
    { x: 25 - 24 * t, width: 25, angle: 0, origin: "left", z: 2 },
    { x: 50 + 24 * t, width: 25, angle: 0, origin: "left", z: 2 },
    { x: 75, width: 25, angle: 0, origin: "left", z: 1 },
  ];
  if (mech === "telescopic") return [0, 1, 2].map(i => ({ x: i * 100 / 3 + (2 - i) * 32 * t, width: 100 / 3, angle: 0, origin: "left", z: 3 - i }));
  const count = mech === "pooja" ? 2 : 4;
  const width = 100 / count;
  const angle = t * 84;
  const projected = Math.cos(angle * Math.PI / 180);
  return Array.from({ length: count }, (_, i) => {
    const even = i % 2 === 0;
    const x = even ? i * width * projected : (i + 1) * width * projected - width;
    return { x: mech === "pooja" ? 100 - x - width : x, width, angle: (even ? -angle : angle) * (mech === "pooja" ? -1 : 1), origin: (even !== (mech === "pooja")) ? "left" : "right", z: count - i };
  });
}

export default function PartitionStudio() {
  const hash = useHash();
  const selected = mechanisms.find(m => focusKey("Partitions", m.label) === hash) ?? mechanisms[0];
  useEffect(() => {
    if (hash === "partitions" || hash.startsWith("partitions--")) {
      document.getElementById("partition-config")?.scrollIntoView({ block: "start" });
    }
  }, [hash]);
  return <PartitionConfigurator key={hash} initialMechanism={selected} />;
}

function PartitionConfigurator({ initialMechanism }: { initialMechanism: typeof mechanisms[number] }) {
  const [mechanism, setMechanism] = useState(initialMechanism);
  const [frame, setFrame] = useState(partitionFrames[0]);
  const [glass, setGlass] = useState<GlassId>(initialMechanism.glass);
  const { progress, set, animate } = useOpening();
  const drag = useRef<{ x: number; progress: number; width: number } | null>(null);
  const [x, y, width, height] = mechanism.opening;
  const glassLabel = glassTypes.find(g => g.id === glass)!.label;
  const summary = `${mechanism.label} · ${frame.label} frame · ${glassLabel}`;
  const percentage = Math.round(progress * 100);

  return <section className="partition-room dark on-dark" id="partition-config" aria-label="Partition studio">
    <div className="container"><div className="partition-card">
    <div className="partition-layout">
      <div className="partition-heading"><div><div className="t-eyebrow">Partition series</div><h2 className="t-h2">One space. <em>Five ways to open it.</em></h2></div><p className="t-lead">Choose your mechanism, frame colour and glass. Open, close or slide to find your view.</p></div>
      <div className="partition-preview">
        <div className="partition-photo-wrap">
          <div className={`partition-photo mechanism-${mechanism.id}`} style={{ aspectRatio: `${mechanism.width} / ${mechanism.height}`, "--photo-ratio": mechanism.width / mechanism.height, "--frame": frame.value } as CSSProperties}>
            <Image src={`/images/partition-rooms/${mechanism.id}.png`} alt={`${mechanism.label} partition in its interior setting`} fill unoptimized sizes="(max-width: 900px) 100vw, 65vw" draggable={false} />
            {mechanism.id === "slidefold" && <span className="partition-surround" aria-hidden="true" />}
            <div className="partition-opening" style={{ left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${height}%` }} aria-hidden="true">
              {leaves(mechanism.id, progress).map((leaf, i) => <div key={`${mechanism.id}-${i}`} className={`partition-leaf glass-${glass}`} style={{ left: `${leaf.x}%`, width: `${leaf.width}%`, transform: `rotateY(${leaf.angle}deg)`, transformOrigin: `${leaf.origin} center`, zIndex: leaf.z }}>
                <div className="partition-glass" />
                {(mechanism.id === "synchro" || mechanism.id === "ghost") && <><span className="partition-crossbar crossbar-one" /><span className="partition-crossbar crossbar-two" /></>}
                <span className="partition-handle" />
              </div>)}
            </div>
            <div className="partition-drag" role="slider" tabIndex={0} aria-label="Drag to open partition" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} aria-valuetext={`${percentage}% open`}
              onPointerDown={e => { if (e.button !== 0) return; e.currentTarget.setPointerCapture(e.pointerId); set(progress); drag.current = { x: e.clientX, progress, width: e.currentTarget.getBoundingClientRect().width }; }}
              onPointerMove={e => { const d = drag.current; if (d) set(d.progress + (e.clientX - d.x) / d.width * 1.8); }}
              onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}
              onKeyDown={e => { if (["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "Home", "End"].includes(e.key)) { e.preventDefault(); set(e.key === "Home" ? 0 : e.key === "End" ? 1 : progress + (["ArrowRight", "ArrowUp"].includes(e.key) ? .05 : -.05)); } }} />
            <span className="partition-photo-label">{mechanism.label}</span>
          </div>
        </div>
        <div className="partition-toolbar"><div className="partition-buttons"><button type="button" onClick={() => animate(1)}>Open doors <span aria-hidden="true">↔</span></button><button type="button" onClick={() => animate(0)}>Close doors <span aria-hidden="true">→←</span></button></div><span>{percentage === 0 ? "Closed" : percentage === 100 ? "Open" : `${percentage}% open`}</span></div>
        <label className="partition-range"><span>Closed</span><input type="range" min={0} max={100} value={percentage} aria-label="Partition opening" onChange={e => set(Number(e.target.value) / 100)} /><span>Open</span></label>
        
      </div>
      <div className="partition-options">
        <fieldset className="ss-group"><legend>01 / Mechanism</legend><div className="partition-mechanisms">{mechanisms.map((m, i) => <button key={m.id} type="button" aria-pressed={mechanism.id === m.id} onClick={() => { set(0); setMechanism(m); setGlass(m.glass); }}><span>0{i + 1}</span>{m.label}<span aria-hidden="true">↗</span></button>)}</div><p className="partition-description">{mechanism.description}</p></fieldset>
        <fieldset className="ss-group"><legend>02 / Frame colour <span>{frame.label}</span></legend><div className="swatches">{partitionFrames.map(f => <button key={f.id} type="button" className={`sw-metal${frame.id === f.id ? " is-active" : ""}`} style={{ "--c": f.value } as CSSProperties} aria-label={f.label} title={f.label} aria-pressed={frame.id === f.id} onClick={() => setFrame(f)} />)}</div></fieldset>
        <fieldset className="ss-group"><legend>03 / Glass <span>{glassLabel}</span></legend><div className="partition-glass-options">{glassTypes.map(g => <button key={g.id} type="button" aria-pressed={glass === g.id} onClick={() => setGlass(g.id)}><span className={`partition-glass-sample glass-${g.id}`}><i className="partition-glass" /></span>{g.label}</button>)}</div></fieldset>
        <div className="ss-summary"><span className="t-mono">Your partition</span><p>{summary}</p><a className="btn btn-pink" target="_blank" rel="noopener noreferrer" href={whatsappLink(`Hi Vawe, I'd like a quote for ${summary}.`)}>Get a quote for this <span aria-hidden="true">↗</span></a></div>
      </div>
    </div>
    </div></div>
  </section>;
}

