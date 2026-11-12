"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import { useOpening } from "./PartitionStudio";
import { showerFrames, showerGlass, showerLayouts, showerRoom as R, type ShowerLayoutId } from "@/lib/showerRooms";
import { getCollection } from "@/lib/collections";
import { useHash } from "@/lib/focus";
import { focusKey } from "@/lib/series";
import { whatsappLink } from "@/lib/site";

type Pt = [number, number];
/** Places a point of a panel (u across, v down) in the photo. */
type Place = (u: number, v: number) => Pt;
type Box = [number, number, number, number]; // u0, v0, u1, v1
type Frame = (typeof showerFrames)[number];
type GlassId = (typeof showerGlass)[number]["id"];

const variants = getCollection("bathroom-partitions")!.variants;
const doorWidth = R.right - R.split;
const tints: Partial<Record<GlassId, [string, number]>> = { frosted: ["#eef3f1", 0.42], fluted: ["#eef3f1", 0.12], brown: ["#6b4a30", 0.4], grey: ["#22363a", 0.46] };

/** A panel standing on the glass line, its left edge at x. */
const flat = (x: number): Place => (u, v) => [x + u, v];
/** A door hinged on the right wall and swung into the shower: its free edge moves away from the camera, so it draws in towards the vanishing point. */
const hinged = (angle: number): Place => (u, v) => {
  const x = R.right - u * Math.cos(angle), s = R.distance / (R.distance + u * Math.sin(angle));
  return [R.vanish[0] + (x - R.vanish[0]) * s, R.vanish[1] + (v - R.vanish[1]) * s];
};
const quad = (p: Place, [u0, v0, u1, v1]: Box) => [p(u0, v0), p(u1, v0), p(u1, v1), p(u0, v1)].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
const line = (p: Place, u: number, v0: number, v1: number) => { const a = p(u, v0), b = p(u, v1); return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`; };

/** Frame bars. They are drawn dark, like the photographed frame, so one tint colours both alike. */
function Bars({ id, p, bars }: { id: string; p: Place; bars: Box[] }) {
  return <>{bars.map((b) => <polygon key={b.join()} points={quad(p, b)} fill={`url(#${id}-${b[2] - b[0] > b[3] - b[1] ? "rail" : "post"})`} />)}</>;
}

/** Frameless hardware (rollers, track, hinges, handles, wall clamps), in the chosen colour. */
function Fittings({ id, p, boxes }: { id: string; p: Place; boxes: Box[] }) {
  return <>{boxes.map((b) => <polygon key={b.join()} points={quad(p, b)} fill={`url(#${id}-clamp)`} stroke="#00000040" />)}</>;
}

/** A pane of glass: what is behind it is softened for frosted and fluted, coloured for tints, and always catches a little light. */
function Pane({ id, name, p, box, glass, edge = false }: { id: string; name: string; p: Place; box: Box; glass: GlassId; edge?: boolean }) {
  const points = quad(p, box), tint = tints[glass];
  const flutes = (offset: number) => Array.from({ length: Math.floor((box[2] - box[0]) / 11) }, (_, i) => line(p, box[0] + 5 + offset + i * 11, box[1], box[3])).join("");
  return (
    <g>
      <clipPath id={`${id}-${name}`}><polygon points={points} /></clipPath>
      {(glass === "frosted" || glass === "fluted") && <image href={R.image} width={R.width} height={R.height} filter={`url(#${id}-${glass === "frosted" ? "frost" : "soften"})`} clipPath={`url(#${id}-${name})`} />}
      {tint && <polygon points={points} fill={tint[0]} fillOpacity={tint[1]} />}
      {glass === "fluted" && <g fill="none" strokeWidth="2.2"><path d={flutes(0)} stroke="#fff" strokeOpacity=".5" /><path d={flutes(4)} stroke="#20302e" strokeOpacity=".2" /></g>}
      <polygon points={points} fill={`url(#${id}-sheen)`} />
      {edge && <polygon points={points} fill="none" stroke="#f1faf7" strokeOpacity=".7" strokeWidth="2.5" />}
    </g>
  );
}

function Scene({ layout, frame, frameless, glass, progress, label }: { layout: ShowerLayoutId; frame: Frame; frameless: boolean; glass: GlassId; progress: number; label: string }) {
  const id = useId().replace(/:/g, "");
  const { left, split, right, top, bottom, bar: t } = R;
  const tint = frame.ramp ? `url(#${id}-tint)` : undefined;
  const stops = frame.ramp ? [frame.ramp[0], frame.ramp[1], frame.ramp[2], frame.ramp[3], frame.ramp[3], frame.ramp[3]] : [];
  const channel = (i: number) => stops.map((hex) => (parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255).toFixed(3)).join(" ");

  // Sliding: the door hangs from the track and runs behind the fixed panel.
  const slideP = flat(split - 8 - (doorWidth - 8) * progress), slideW = doorWidth + 8;
  // Openable: the door swings up to 80° into the shower and folds towards the right wall.
  const swingP = hinged(progress * 80 * Math.PI / 180), doorTop = top + t;
  const handle = (w: number): Box => [w - 64, 620, w - 52, 800];

  return (
    <svg className="shower-room-scene" viewBox={`0 0 ${R.width} ${R.height}`} role="img" aria-label={label}>
      <defs>
        {frame.ramp && <filter id={`${id}-tint`} filterUnits="userSpaceOnUse" x="0" y="0" width={R.width} height={R.height} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values=".3 .59 .11 0 0 .3 .59 .11 0 0 .3 .59 .11 0 0 0 0 0 1 0" />
          <feComponentTransfer><feFuncR type="table" tableValues={channel(0)} /><feFuncG type="table" tableValues={channel(1)} /><feFuncB type="table" tableValues={channel(2)} /></feComponentTransfer>
        </filter>}
        <filter id={`${id}-frost`}><feGaussianBlur stdDeviation="13" /></filter>
        <filter id={`${id}-soften`}><feGaussianBlur stdDeviation="7 1.5" /></filter>
        <clipPath id={`${id}-frames`}>{R.frames.map((f) => <polygon key={f} points={f} />)}</clipPath>
        {(["post", "rail"] as const).map((k) => <linearGradient key={k} id={`${id}-${k}`} x1="0" y1="0" x2={k === "post" ? 1 : 0} y2={k === "post" ? 0 : 1}><stop stopColor="#141415" /><stop offset=".3" stopColor="#262628" /><stop offset=".5" stopColor="#444447" /><stop offset=".72" stopColor="#242426" /><stop offset="1" stopColor="#121213" /></linearGradient>)}
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".12" /><stop offset=".38" stopColor="#fff" stopOpacity=".02" /><stop offset=".62" stopColor="#fff" stopOpacity=".1" /><stop offset="1" stopColor="#fff" stopOpacity=".02" /></linearGradient>
        <linearGradient id={`${id}-clamp`} x1="0" y1="0" x2="1" y2="1">{(frame.ramp ? [frame.ramp[3], frame.ramp[1], frame.ramp[2]] : ["#5c5c60", "#0d0d0e", "#343437"]).map((c, i) => <stop key={i} offset={i / 2} stopColor={c} />)}</linearGradient>
      </defs>

      <image href={R.image} width={R.width} height={R.height} />

      {/* Frameless doors are bare toughened glass: the sliding one hangs from two rollers, the openable one swings on two wall hinges. */}
      {layout === "sliding" && <g>
        <Pane id={id} name="door" p={slideP} box={frameless ? [2, top + 20, slideW - 2, bottom - 4] : [t, top + 20, slideW - t, bottom - t]} glass={glass} edge={frameless} />
        {frameless
          ? <Fittings id={id} p={slideP} boxes={[[34, top + 2, 76, top + 32], [slideW - 76, top + 2, slideW - 34, top + 32], handle(slideW)]} />
          : <g filter={tint}><Bars id={id} p={slideP} bars={[[0, top + 20, t, bottom], [slideW - t, top + 20, slideW, bottom], [0, bottom - t, slideW, bottom], handle(slideW)]} /></g>}
      </g>}

      {layout === "openable" && <g>
        <Pane id={id} name="door" p={swingP} box={frameless ? [2, doorTop + 2, doorWidth - 2, bottom - 4] : [t, doorTop + t, doorWidth - t, bottom - t]} glass={glass} edge={frameless} />
        {frameless
          ? <Fittings id={id} p={swingP} boxes={[[0, doorTop + 110, 34, doorTop + 160], [0, bottom - 190, 34, bottom - 140], handle(doorWidth)]} />
          : <g filter={tint}><Bars id={id} p={swingP} bars={[[0, doorTop, t, bottom], [doorWidth - t, doorTop, doorWidth, bottom], [0, doorTop, doorWidth, doorTop + t], [0, bottom - t, doorWidth, bottom], handle(doorWidth)]} /></g>}
      </g>}

      {/* The fixed panel, in every layout: its photographed frame, or bare glass edges and wall clamps. */}
      <Pane id={id} name="fixed" p={flat(left)} box={frameless ? [6, top + 3, split - left - 4, bottom - 4] : [21, top + 16, split - left - 16, bottom - 19]} glass={glass} edge={frameless} />
      {frameless
        ? [250, 640].map((y) => <rect key={y} x={left - 4} y={y} width="30" height="34" rx="3" fill={`url(#${id}-clamp)`} stroke="#00000040" />)
        : <image href={R.framed} width={R.width} height={R.height} clipPath={`url(#${id}-frames)`} filter={tint} />}

      {frameless
        ? layout === "sliding" && <Fittings id={id} p={flat(0)} boxes={[[left - 8, top - 8, right + 4, top + 8]]} />
        : <g filter={tint}>
            {layout === "sliding" && <Bars id={id} p={flat(0)} bars={[[left - 8, top - 16, right + 4, top + 22]]} />}
            {layout === "openable" && <Bars id={id} p={flat(0)} bars={[[split - 1, top, right, top + t]]} />}
          </g>}

      <image href={R.front} width={R.width} height={R.height} />
    </svg>
  );
}

export default function ShowerRoomStudio() {
  const hash = useHash();
  const initial = showerLayouts.find((l) => focusKey("Bathroom Partition", l.navItem) === hash)?.id ?? showerLayouts[0].id;
  useEffect(() => {
    if (hash === "shower-studio" || hash === "bathroom-partition" || hash.startsWith("bathroom-partition--")) document.getElementById("shower-studio")?.scrollIntoView({ block: "start" });
  }, [hash]);
  return <ShowerStudio key={hash} initial={initial} />;
}

function ShowerStudio({ initial }: { initial: ShowerLayoutId }) {
  const [layoutId, setLayoutId] = useState(initial);
  const [frameId, setFrameId] = useState<Frame["id"]>("black");
  const [glass, setGlass] = useState<GlassId>("clear");
  const [frameless, setFrameless] = useState(false);
  const { progress, set, animate } = useOpening();
  const layout = showerLayouts.find((l) => l.id === layoutId)!;
  const frame = showerFrames.find((f) => f.id === frameId)!;
  const hasDoor = layoutId !== "fixed";
  const variant = variants.find((v) => v.name === layout.variant)!;
  const finish = frameless ? `Frameless, ${frame.label} hinges` : `${frame.label} frame`;
  const glassLabel = showerGlass.find((g) => g.id === glass)!.label;
  const summary = `${variant.name} · ${finish} · ${glassLabel} glass`;
  const percentage = Math.round(progress * 100);
  const status = !hasDoor ? "Walk-in, no door" : percentage === 0 ? "Closed" : percentage === 100 ? "Open" : `${percentage}% open`;

  return (
    <section className="shower-room dark on-dark" id="shower-studio" aria-label="Bathroom partition studio">
      <div className="container"><div className="shower-room-card"><div className="shower-room-layout">
        <div className="shower-room-heading">
          <span className="t-eyebrow">Shower studio</span>
          <h2>Plan your shower. <em>Try it before it&apos;s built.</em></h2>
          <p>Pick a layout, frame finish and glass, then open the door to see it in a real bathroom.</p>
        </div>
        <div className="shower-room-view">
          <div className="shower-room-photo">
            <Scene layout={layoutId} frame={frame} frameless={frameless} glass={glass} progress={hasDoor ? progress : 0} label={`${layout.label} shower partition, ${finish.toLowerCase()}, ${glassLabel.toLowerCase()} glass, ${status.toLowerCase()}`} />
            <span className="shower-room-label">{layout.label}</span>
          </div>
          {hasDoor
            ? <div className="shower-room-controls">
                <div className="shower-room-buttons"><button type="button" onClick={() => animate(1)}>Open door <span aria-hidden="true">↔</span></button><button type="button" onClick={() => animate(0)}>Close door <span aria-hidden="true">→←</span></button></div>
                <label className="shower-room-range"><span>Closed</span><input type="range" min={0} max={100} value={percentage} aria-label="Door opening" onChange={(e) => set(Number(e.target.value) / 100)} /><span>Open</span></label>
                <span className="shower-room-status" role="status">{status}</span>
              </div>
            : <div className="shower-room-controls"><span className="shower-room-walkin">Walk-in: no door to open</span></div>}
        </div>
        <div className="shower-room-options">
          <fieldset>
            <legend>01 / Layout</legend>
            <div className="shower-pills">{showerLayouts.map((l) => <button key={l.id} type="button" aria-pressed={layoutId === l.id} onClick={() => { set(0); setLayoutId(l.id); }}>{l.label}</button>)}</div>
            <p className="shower-room-note"><strong>{variant.name}.</strong> {variant.description}</p>
          </fieldset>
          <fieldset>
            <legend>02 / Frame <span>{frameless ? `Frameless · ${frame.label} hinges` : frame.label}</span></legend>
            <div className="shower-pills shower-frame-mode">{[false, true].map((f) => <button key={String(f)} type="button" aria-pressed={frameless === f} onClick={() => setFrameless(f)}>{f ? "Frameless" : "With frame"}</button>)}</div>
            {/* The same four colours colour the frame, or the hinges and fittings when frameless. */}
            <div className="swatches">{showerFrames.map((f) => <button key={f.id} type="button" className={`sw-metal${frameId === f.id ? " is-active" : ""}`} style={{ "--c": f.swatch } as CSSProperties} aria-label={`${f.label} ${frameless ? "hinges" : "frame"}`} title={f.label} aria-pressed={frameId === f.id} onClick={() => setFrameId(f.id)} />)}</div>
          </fieldset>
          <fieldset>
            <legend>03 / Glass <span>{glassLabel}</span></legend>
            <div className="shower-glass-options">{showerGlass.map((g) => <button key={g.id} type="button" aria-pressed={glass === g.id} onClick={() => setGlass(g.id)}><span className={`shower-glass-sample is-${g.id}`} />{g.label}</button>)}</div>
          </fieldset>
          <ul className="bt-specs">
            <li>Toughened safety glass, cut to your opening</li>
            <li>Measured and installed on site by our team</li>
            <li>Hardware chosen for daily, wet use</li>
          </ul>
          <div className="shower-room-summary">
            <span className="t-mono">Your enclosure</span>
            <p>{summary}</p>
            <a className="btn btn-pink" href={whatsappLink(`Hi Vawe, I'd like a quote for a bathroom partition: ${summary}.`)} target="_blank" rel="noopener noreferrer">Get a quote for this <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div></div></div>
    </section>
  );
}
