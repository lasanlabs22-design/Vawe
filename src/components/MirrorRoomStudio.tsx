"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import { mirrorShapes } from "@/lib/mirrorStudio";
import { useHash } from "@/lib/focus";
import { whatsappLink } from "@/lib/site";

type Version = "front" | "back" | "frame";
const versions: { id: Version; label: string }[] = [{ id: "front", label: "Front Lit" }, { id: "back", label: "Backlit" }, { id: "frame", label: "Framed" }];
const tones = [{ id: "warm", label: "Warm", color: "#ffd292" }, { id: "neutral", label: "Natural", color: "#fff3df" }, { id: "cool", label: "Cool", color: "#d8efff" }];
const frames = [{ label: "Black", color: "#252525" }, { label: "Brush Gold", color: "#b69250" }, { label: "Rose Gold", color: "#bc8e7c" }];

/** Place a 0-100 shape path at its real size in room coordinates, so strokes and the reflection are never stretched. */
function placePath(d: string, x: number, y: number, w: number, h: number) {
  const sx = w / 100, sy = h / 100;
  const X = (v: number) => +(x + v * sx).toFixed(2), Y = (v: number) => +(y + v * sy).toFixed(2);
  return d.replace(/([MCQLHVAZ])([^MCQLHVAZ]*)/g, (_, cmd: string, args: string) => {
    const n = args.trim() ? args.trim().split(/[\s,]+/).map(Number) : [];
    const out = cmd === "H" ? n.map(X) : cmd === "V" ? n.map(Y)
      : cmd === "A" ? n.map((v, i) => [+(v * sx).toFixed(2), +(v * sy).toFixed(2), v, v, v, X(v), Y(v)][i % 7])
      : n.map((v, i) => (i % 2 ? Y(v) : X(v)));
    return cmd + out.join(" ");
  });
}

export default function MirrorRoomStudio() {
  const hash = useHash();
  const initial: Version = hash === "mirrors--front-lit" ? "front" : ["mirrors--framed", "mirrors--frame", "mirrors--frame-led", "mirrors--framed-front-lit", "mirrors--framed-backlit"].includes(hash) ? "frame" : "back";
  useEffect(() => {
    if (hash === "mirrors" || hash.startsWith("mirrors--")) document.getElementById("mirror-studio")?.scrollIntoView({ block: "start" });
  }, [hash]);
  return <MirrorStudio key={hash} initial={initial} initialFrameLight={hash === "mirrors--framed-front-lit" ? "front" : "back"} />;
}

function MirrorStudio({ initial, initialFrameLight }: { initial: Version; initialFrameLight: "front" | "back" }) {
  const id = useId().replace(/:/g, "");
  const [shape, setShape] = useState<typeof mirrorShapes[number]>(mirrorShapes[0]);
  const [version, setVersion] = useState<Version>(initial);
  const [frameLight, setFrameLight] = useState<"front" | "back">(initialFrameLight);
  const [frame, setFrame] = useState(frames[1]);
  const [tone, setTone] = useState(tones[0]);
  const [lit, setLit] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const backlit = version === "back" || (version === "frame" && frameLight === "back");
  const power = lit ? brightness / 100 : 0;
  const [w, h] = shape.id === "round" ? [530, 530] : shape.wide ? [570, 495] : [365, 555];
  const x = 590 - w / 2, y = 665 - h;
  const outline = placePath(shape.path, x, y, w, h);
  const inner = placePath(shape.path, x + w * .025, y + h * .025, w * .95, h * .95);
  const shadow = placePath(shape.path, x + w * .006, y + h * .01, w, h);
  // The opposite wall, at a constant real-world scale, centred on the mirror.
  const rw = 640, rh = rw * 1402 / 1122, cy = y + h / 2;
  const summary = `${shape.label} · ${versions.find(v => v.id === version)!.label}${version === "frame" ? ` · ${frame.label} · ${frameLight === "front" ? "Front Lit" : "Backlit"}` : ""} · ${tone.label}`;
  return <section className="mirror-studio dark on-dark" id="mirror-studio" aria-label="Mirror studio">
    <div className="container"><div className="mirror-studio-card">
      <div className="mirror-studio-heading"><div><span className="t-eyebrow">The mirror edit</span><h2>Same room. <em>A new reflection.</em></h2></div><span className="mirror-studio-count">{String(mirrorShapes.findIndex(s => s.id === shape.id) + 1).padStart(2, "0")} / {mirrorShapes.length} designs</span></div>
      <div className="mirror-studio-layout">
        <div className="mirror-studio-view">
          <svg className="mirror-room-scene" viewBox="0 0 1122 1402" role="img" aria-label={`${summary}, light ${lit ? `on at ${brightness}%` : "off"}`}>
            <defs>
              <clipPath id={`${id}-shape`}><path d={outline} /></clipPath>
              <filter id={`${id}-halo`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="13" /></filter>
              <filter id={`${id}-soft`} x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="3" /></filter>
              <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={frame.color} /><stop offset=".35" stopColor={frame.label === "Black" ? "#74797b" : frame.label === "Rose Gold" ? "#f5cfbf" : "#eee0bd"} /><stop offset=".55" stopColor={frame.color} /><stop offset="1" stopColor={frame.color} /></linearGradient>
              <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c0d3df" stopOpacity=".12" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".09" /></linearGradient>
            </defs>
            <image href="/images/mirror-studio/room.png" width="1122" height="1402" />
            <g>
              <path d={shadow} fill="#060c10" stroke="#060c10" strokeWidth="7" opacity=".65" filter={`url(#${id}-soft)`} />
              <g className="mirror-light-layer" opacity={backlit ? power : 0}>
                <path d={outline} fill="none" stroke={tone.color} strokeWidth="28" filter={`url(#${id}-halo)`} />
                <path d={outline} fill="none" stroke={tone.color} strokeWidth="7" filter={`url(#${id}-soft)`} />
              </g>
              <g clipPath={`url(#${id}-shape)`}>
                <image href="/images/mirror-studio/reflection.png" x={590 - rw / 2} y={cy - rh / 2} width={rw} height={rh} />
                <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-sheen)`} />
              </g>
              <path d={outline} fill="none" stroke={version === "frame" ? `url(#${id}-metal)` : "#aab7b9"} strokeWidth={version === "frame" ? 7 : 1} />
              {!backlit && <g>
                <path d={inner} fill="none" stroke="#e6e5dd" strokeWidth="5" opacity=".55" />
                <g className="mirror-light-layer" opacity={power}><path d={inner} fill="none" stroke={tone.color} strokeWidth="10" filter={`url(#${id}-soft)`} /><path d={inner} fill="none" stroke={tone.color} strokeWidth="5" /></g>
              </g>}
            </g>
          </svg>
          <div className="mirror-scene-toolbar"><button type="button" aria-pressed={lit} onClick={() => setLit(v => !v)}><span aria-hidden="true">⏻</span> {lit ? "Light on" : "Light off"}</button><span>{shape.label} / {versions.find(v => v.id === version)!.label}</span></div>
        </div>
        <div className="mirror-studio-options">
          <fieldset><legend>01 / Version</legend><div className="mirror-pills">{versions.map(v => <button key={v.id} type="button" aria-pressed={version === v.id} onClick={() => setVersion(v.id)}>{v.label}</button>)}</div></fieldset>
          <fieldset><legend>02 / Shape <span>{shape.label}</span></legend><div className="mirror-shape-options">{mirrorShapes.map(s => <button key={s.id} type="button" aria-label={`${s.label} mirror`} title={s.label} aria-pressed={shape.id === s.id} onClick={() => setShape(s)}><svg viewBox="-5 -5 110 110" aria-hidden="true" style={{ width: s.wide ? 35 : 24 }}><path d={s.path} /></svg><span>{s.label}</span></button>)}</div></fieldset>
          {version === "frame" && <fieldset><legend>03 / Frame &amp; lighting</legend><div className="mirror-frame-options">{frames.map(f => <button key={f.label} type="button" aria-label={`${f.label} mirror frame`} title={f.label} aria-pressed={frame.label === f.label} style={{ "--metal": f.color } as CSSProperties} onClick={() => setFrame(f)} />)}<div className="mirror-pills">{(["front", "back"] as const).map(v => <button key={v} type="button" aria-pressed={frameLight === v} onClick={() => setFrameLight(v)}>{v === "front" ? "Front Lit" : "Backlit"}</button>)}</div></div></fieldset>}
          <fieldset><legend>{version === "frame" ? "04" : "03"} / Light</legend><div className="mirror-pills mirror-tones">{tones.map(t => <button key={t.id} type="button" aria-pressed={tone.id === t.id} onClick={() => setTone(t)}><i style={{ background: t.color }} />{t.label}</button>)}</div><label className="mirror-brightness">Brightness<input aria-label="Mirror brightness" type="range" min="10" max="100" value={brightness} onChange={e => setBrightness(Number(e.target.value))} /><span>{brightness}%</span></label></fieldset>
          <div className="mirror-studio-summary"><p>{summary}</p><a href={whatsappLink(`Hi Vawe, I'd like a quote for a mirror: ${summary}.`)} className="btn btn-pink" target="_blank" rel="noopener noreferrer">Make this mine <span aria-hidden="true">↗</span></a></div>
        </div>
      </div>
    </div></div>
  </section>;
}
