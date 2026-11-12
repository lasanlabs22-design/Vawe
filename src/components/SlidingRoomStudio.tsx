"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ActionButton } from "./Shutter";
import { FinishSwatch } from "./SlidingStudio";
import { finishKinds, finishOptions, optionLabel, type Finish } from "@/lib/sliding";
import { whatsappLink } from "@/lib/site";
import { roomImage, roomOffsets, slidingRooms, type DoorCount, type RevealSide, type RoomRender } from "@/lib/slidingRooms";
import { useHash } from "@/lib/focus";

const quad = (p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(" ");

/** The glass inside a door, inset just inside its seams: the render's frame stays visible and none of its design does. */
function inner(a: [number, number, number], b: [number, number, number]): [number, number][] {
  const i = 4.5;
  return [[a[0] + i, a[1] + i], [b[0] - i, b[1] + i], [b[0] - i, b[2] - i], [a[0] + i, a[2] - i]];
}

// Front-facing styled interior, generated for this preview. Each door gets a
// distinct full-height compartment so clothes remain visible in every layout.
const interior = { src: "/images/wardrobe-interiors/styled-oak-clothes.png", width: 1536, height: 1024 };
const interiorBays = { 2: [0, 1], 3: [0, 2, 3], 4: [0, 1, 2, 3] };

// Aluminium edge-profile colours the client offers on sliding shutters.
const edgeColors = [
  { id: "black", label: "Black", hex: "#080707" },
  { id: "light-champagne", label: "Light Champagne", hex: "#e8d6b3" },
  { id: "rose-gold", label: "Rose Gold", hex: "#eda8a8" },
  { id: "electro-champagne", label: "Electro Champagne", hex: "#815d22" },
];
const mix = (hex: string, to: number, amount: number) => `#${[1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - amount) + to * amount).toString(16).padStart(2, "0")).join("")}`;

function RoomScene({ room, progress, side, lit, finish, edge }: { room: RoomRender; progress: number; side: RevealSide; lit: boolean; finish: Finish | null; edge: string | null }) {
  const id = useId().replace(/:/g, "");
  const first = room.seams[0], last = room.seams[room.doors];
  const polygon = `${first[0]},${first[1]} ${last[0]},${last[1]} ${last[0]},${last[2]} ${first[0]},${first[2]}`;
  // The whole run of doors, so a print continues from one panel to the next.
  const box = { x: first[0], y: Math.min(first[1], last[1]), w: last[0] - first[0], h: Math.max(first[2], last[2]) - Math.min(first[1], last[1]) };
  const shifts = roomOffsets(room.doors, side);
  const panels = Array.from({ length: room.doors }, (_, i) => i);
  // Moving leaves run in front of the neighbour that they overlap.
  panels.sort((a, b) => Number(shifts[a] !== 0) - Number(shifts[b] !== 0));
  const v = finish?.value ?? "";
  // Cane tiles at the same real size as on the Bella kitchen doors: about 58 across a wardrobe door.
  const cane = (room.seams[1][0] - room.seams[0][0]) / 58;
  const fill =finish?.kind === "fabric" ? `url(#${id}-fabric)` : finish?.kind === "cane" ? `url(#${id}-cane)` : v;
  return <svg className={`sl-room-scene${lit ? " is-lit" : ""}`} viewBox={`0 0 ${room.width} ${room.height}`} role="img" aria-label={`${room.name}, ${room.doors} sliding doors${finish ? `, ${finishOptions[finish.kind].label} ${optionLabel(finish)}` : ""}, ${progress ? `${side} section ${progress}% open` : "closed"}${lit ? ", interior light on" : ", interior light off"}`}>
    <defs>
      <clipPath id={`${id}-opening`}><polygon points={polygon} /></clipPath>
      <linearGradient id={`${id}-wood`}><stop stopColor="#32291f" /><stop offset=".5" stopColor="#76614b" /><stop offset="1" stopColor="#3e3328" /></linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="0%" r="100%"><stop stopColor="#ffda9f" stopOpacity=".48" /><stop offset="1" stopColor="#ffda9f" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1"><stop offset=".3" stopColor="#fff" stopOpacity="0" /><stop offset=".45" stopColor="#fff" stopOpacity={finish?.kind === "lacquer" ? .3 : .13} /><stop offset=".58" stopColor="#fff" stopOpacity="0" /></linearGradient>
      <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff" stopOpacity=".12" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".2" /></linearGradient>
      <pattern id={`${id}-fabric`} width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill={v} /><path d="M0 .5H4" stroke="#fff" strokeOpacity=".16" /><path d="M.5 0V4" stroke="#000" strokeOpacity=".13" /></pattern>
      {finish?.kind === "cane" && <pattern id={`${id}-cane`} width={cane} height={cane} patternUnits="userSpaceOnUse"><image href={v} width={cane} height={cane} /></pattern>}
      {edge && <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={mix(edge, 255, .35)} /><stop offset=".4" stopColor={edge} /><stop offset="1" stopColor={mix(edge, 0, .3)} /></linearGradient>}
      {panels.map(i => {
        const a = room.seams[i], b = room.seams[i + 1];
        const outer: [number, number][] = [[a[0], a[1]], [b[0], b[1]], [b[0], b[2]], [a[0], a[2]]];
        return <g key={i}>
          <clipPath id={`${id}-door-${i}`}><polygon points={quad(outer)} /></clipPath>
          <clipPath id={`${id}-frame-${i}`}><path clipRule="evenodd" d={`M${quad(outer)}Z M${quad(inner(a, b))}Z`} /></clipPath>
          <clipPath id={`${id}-glass-${i}`}><polygon points={quad(inner(a, b))} /></clipPath>
        </g>;
      })}
    </defs>
    <image href={roomImage(room)} width={room.width} height={room.height} />
    <g clipPath={`url(#${id}-opening)`}>
      <polygon points={polygon} fill={`url(#${id}-wood)`} />
      {room.seams.slice(0, -1).map(([x, top, bottom], i) => {
        const width = room.seams[i + 1][0] - x;
        const height = bottom - top;
        return <g key={i}>
          <svg x={x} y={top} width={width} height={height} viewBox={`${interiorBays[room.doors][i] * 384} 0 384 1024`} preserveAspectRatio="none">
            <image href={interior.src} width={interior.width} height={interior.height} />
          </svg>
          <rect className="sl-room-glow" x={x} y={top} width={width} height={height} fill={`url(#${id}-glow)`} />
          <rect className="sl-room-led" x={x + 16} y={top + 14} width={width - 32} height="3" rx="1.5" />
        </g>;
      })}
      <polygon points={polygon} className="sl-room-dim" />
      <polygon points={polygon} className="sl-room-warm" />
      {panels.map(i => {
        const target = i + shifts[i];
        const dx = (room.seams[target][0] - room.seams[i][0]) * progress / 100;
        const glass = quad(inner(room.seams[i], room.seams[i + 1]));
        return <g key={i} className="sl-room-panel" style={{ transform: `translateX(${dx}px)` }}>
          {/* The original design, or just the render's frame with the chosen finish inside it. */}
          <image href={roomImage(room)} width={room.width} height={room.height} clipPath={`url(#${id}-${finish ? "frame" : "door"}-${i})`} />
          {finish && <g clipPath={`url(#${id}-glass-${i})`} key={`${finish.kind}-${v}`} className="sl-room-finish">
            {finish.kind === "print"
              ? <image href={v} x={box.x} y={box.y} width={box.w} height={box.h} preserveAspectRatio="xMidYMid slice" />
              : <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={fill} className={finish.kind === "tinted" ? "sl-room-tint" : undefined} />}
            {finish.kind !== "tinted" && finish.kind !== "cane" && <polygon points={glass} fill={`url(#${id}-shade)`} />}
            {/* Cane is matte, as on the Bella doors: no glass sheen over it. */}
            <polygon points={glass} fill={finish.kind === "cane" ? "none" : `url(#${id}-sheen)`} stroke="#000" strokeOpacity=".45" strokeWidth="2.5" />
          </g>}
          {/* Edge profile: the stroke is clipped to the door, so only its inner half shows, as a band along each edge. */}
          {edge && <polygon points={quad([[room.seams[i][0], room.seams[i][1]], [room.seams[i + 1][0], room.seams[i + 1][1]], [room.seams[i + 1][0], room.seams[i + 1][2]], [room.seams[i][0], room.seams[i][2]]])} fill="none" stroke={`url(#${id}-edge)`} strokeWidth={2 * Math.max(6, (room.seams[i + 1][0] - room.seams[i][0]) * .035)} clipPath={`url(#${id}-door-${i})`} className="sl-room-edge" />}
        </g>;
      })}
    </g>
  </svg>;
}

// Nav links pick a room render: /series/sliding-wardrobe-shutters#sliding--luxe opens the studio on it.
// Essential, Luxe and Premium are the client's three ranges, each shown by one of the studio's wardrobes.
const pickFor: Record<string, { room: number }> = {
  "sliding--essential": { room: 28 },
  "sliding--luxe": { room: 19 },
  "sliding--premium": { room: 38 },
  "sliding--2-doors": { room: slidingRooms.find(r => r.doors === 2)!.id },
  "sliding--3-doors": { room: slidingRooms.find(r => r.doors === 3)!.id },
  "sliding--4-doors": { room: slidingRooms.find(r => r.doors === 4)!.id },
};

export default function SlidingRoomStudio() {
  const hash = useHash();
  const pick = pickFor[hash];
  useEffect(() => {
    if (hash in pickFor) document.getElementById("sliding-studio")?.scrollIntoView({ block: "start" });
  }, [hash]);
  const room = slidingRooms.find(r => r.id === pick?.room) ?? slidingRooms[0];
  return <SlidingRooms key={hash} initialRoom={room} />;
}

function SlidingRooms({ initialRoom }: { initialRoom: RoomRender }) {
  const [selected, setSelected] = useState(initialRoom);
  const [progress, setProgress] = useState(0);
  const [side, setSide] = useState<RevealSide>(initialRoom.doors === 2 ? "left" : "centre");
  const [lit, setLit] = useState(false);
  const [finish, setFinish] = useState<Finish | null>(null); // null: the render's own design
  const [custom, setCustom] = useState<string | null>(null);
  const [edgeId, setEdgeId] = useState<string | null>(null); // null: the render's own frame
  const edge = edgeColors.find(e => e.id === edgeId) ?? null;
  const fileRef = useRef<HTMLInputElement>(null);

  // Release the preview object URL when it changes.
  useEffect(() => () => {
    if (custom) URL.revokeObjectURL(custom);
  }, [custom]);

  const choose = (room: RoomRender) => { setSelected(room); setProgress(0); setSide(room.doors === 2 ? "left" : "centre"); };
  const reveal = (next: RevealSide) => { setSide(next); setProgress(100); };
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setCustom(url);
    setFinish({ kind: "print", value: url });
  };
  const finishLabel = finish ? `${finishOptions[finish.kind].label}: ${optionLabel(finish)}` : "Original design";
  const summary = [`${selected.doors} sliding doors`, `${selected.name} room`, finishLabel, `${edge ? edge.label : "Original"} edge profile`];

  return <section className="sl-room-studio dark on-dark tone-warm" id="sliding-studio" aria-label="Sliding room studio">
    <div className="container sl-room-heading"><div><div className="t-eyebrow">Sliding collection · In your space</div><h2 className="t-h2">Two. Three. Four.<br /><em>A smooth move.</em></h2></div><p className="t-lead">Choose a door layout, a room and a finish. Slide the panels to explore the space behind them, and switch the light on.</p></div>
    <div className="container sl-room-stage">
      <div className="sl-room-view">
        <div className="sl-room-frame" key={selected.id}><RoomScene room={selected} progress={progress} side={side} lit={lit} finish={finish} edge={edge?.hex ?? null} /></div>
        <div className="sl-room-controls">
          <div className="sl-room-reveal" role="group" aria-label="Slide shutters"><button type="button" aria-pressed={progress > 0 && side === "left"} onClick={() => reveal("left")}>Reveal left</button>{selected.doors > 2 && <button type="button" aria-pressed={progress > 0 && side === "centre"} onClick={() => reveal("centre")}>Reveal centre</button>}<button type="button" aria-pressed={progress > 0 && side === "right"} onClick={() => reveal("right")}>Reveal right</button><button type="button" aria-pressed={progress === 0} onClick={() => setProgress(0)}>Close</button></div>
          <ActionButton icon="light" on={lit} onToggle={() => setLit(v => !v)} labelOff="Interior light" labelOn="Light on" hintOff="Soft glow inside the opening" hintOn="Switch off the interior glow" />
        </div>
        <div className="sl-room-position"><label>Opening <input aria-label="Sliding door opening" type="range" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} /><span>{progress}%</span></label><p role="status">{selected.doors} doors · {progress === 0 ? "Closed" : `${side} section ${progress}% open`} · Light {lit ? "on" : "off"}</p></div>
      </div>

      <div className="sl-room-options">
        <fieldset className="ss-group">
          <legend>Doors <span>{selected.doors} doors</span></legend>
          <div className="seg">{([2, 3, 4] as DoorCount[]).map(n => <button type="button" key={n} aria-pressed={selected.doors === n} className={selected.doors === n ? "is-active" : ""} onClick={() => choose(slidingRooms.find(r => r.doors === n)!)}>{n} doors</button>)}</div>
        </fieldset>
        <fieldset className="ss-group">
          <legend>Room <span>{selected.name}</span></legend>
          <div className="sl-room-designs">{slidingRooms.filter(r => r.doors === selected.doors).map(room => <button type="button" key={room.id} aria-pressed={room.id === selected.id} aria-label={room.name} title={room.name} onClick={() => choose(room)}><Image src={roomImage(room)} alt="" width={room.width} height={room.height} sizes="110px" /></button>)}</div>
        </fieldset>
        <fieldset className="ss-group">
          <legend>Finish <span>{finishLabel}</span></legend>
          <div className="sl-room-kinds">
            <button type="button" aria-pressed={!finish} onClick={() => setFinish(null)}>Original</button>
            {finishKinds.map(k => <button type="button" key={k} aria-pressed={finish?.kind === k} onClick={() => setFinish({ kind: k, value: finishOptions[k].options[0].value })}>{finishOptions[k].label}</button>)}
          </div>
          {finish && <div className="swatches sl-room-shades">
            {finishOptions[finish.kind].options.map(o => <button key={o.id} type="button" className={`sl-opt${finish.value === o.value ? " is-active" : ""}`} aria-label={o.label} title={o.label} aria-pressed={finish.value === o.value} onClick={() => setFinish({ kind: finish.kind, value: o.value })}><FinishSwatch kind={finish.kind} value={o.value} /></button>)}
            {finish.kind === "print" && <>
              {custom && <button type="button" className={`sl-opt${finish.value === custom ? " is-active" : ""}`} aria-label="Your artwork" onClick={() => setFinish({ kind: "print", value: custom })}><FinishSwatch kind="print" value={custom} /></button>}
              <button type="button" className="sl-upload" onClick={() => fileRef.current?.click()}><span aria-hidden="true">+</span>Upload artwork</button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
            </>}
          </div>}
          {finish?.kind === "print" && <p className="sl-note">Your image stays on your device and is only used for this preview.</p>}
        </fieldset>
        <fieldset className="ss-group">
          <legend>Edge profile <span>{edge ? edge.label : "Original"}</span></legend>
          <div className="swatches sl-room-edges">
            <button type="button" className="sl-room-edge-original" aria-pressed={!edge} onClick={() => setEdgeId(null)}>Original</button>
            {edgeColors.map(e => <button key={e.id} type="button" className={`sw-metal${edgeId === e.id ? " is-active" : ""}`} style={{ "--c": e.hex } as React.CSSProperties} aria-label={e.label} title={e.label} aria-pressed={edgeId === e.id} onClick={() => setEdgeId(e.id)} />)}
          </div>
        </fieldset>
        <div className="sl-room-summary">
          <p>{summary.join(" · ")}</p>
          <a className="btn btn-pink" href={whatsappLink(`Hi Vawe, I'd like a quote for a sliding wardrobe: ${summary.join(", ")}.`)} target="_blank" rel="noopener noreferrer">Get a quote for this <span className="arrow">→</span></a>
        </div>
      </div>
    </div>
    <p className="container sl-room-note">Original room renders and door frames. Finishes and the styled clothing interior are illustrative previews.</p>
  </section>;
}
