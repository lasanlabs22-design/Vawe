"use client";

import Image from "next/image";
import { useState } from "react";
import { ActionButton } from "./Shutter";
import { colorsFor, fabrics, texUrl, type FabricId } from "@/lib/fabric";
import { findLabel, frameColors, profiles, type ProfileId } from "@/lib/shutters";
import { finishOptions } from "@/lib/sliding";

// Pixel boundaries in the supplied photograph. Door frames and the interior behind them use these exact pixels.
const edges = [268, 410, 555, 700, 844, 990, 1136, 1278];
const top = 78, height = 326; // the doors' row in the photograph
// Glass opening inside each photographed 45 mm frame, as a share of the door.
const glassW = 0.82, glassH = 0.92;
// Photo pixels to on-screen length (the room is 1545 photo pixels wide).
const px = (n: number) => `calc(${n.toFixed(1)} * 100cqw / 1545)`;

// Frame colours tint the photographed frame (graphite is the frame as photographed).
const tints: Record<string, [string, string]> = {
  black: ["#6a6a6a", "multiply"],
  champagne: ["#c8b48d", "screen"],
  gold: ["#c9a14e", "screen"],
  bronze: ["#6e4f37", "screen"],
  silver: ["#b9bec3", "screen"],
  rose: ["#c39486", "screen"],
};

// Every glass and insert the client offers, with the options already used by the sliding and fabric-glass studios.
type Kind = "clear" | "tinted" | "fluted" | "frosted" | "mirror" | "lacquer" | "highlighter" | "fabric" | "cane" | "print";
type Option = { id: string; label: string; value: string };
const inserts: { id: Kind; label: string }[] = [
  { id: "clear", label: "Clear" },
  { id: "tinted", label: "Tinted" },
  { id: "fluted", label: "Fluted" },
  { id: "frosted", label: "Frosted" },
  { id: "mirror", label: "Mirror" },
  { id: "lacquer", label: "Lacquered" },
  { id: "highlighter", label: "Highlighter" },
  { id: "fabric", label: "Fabric" },
  { id: "cane", label: "Cane" },
  { id: "print", label: "Digital print" },
];
const optionsFor: Partial<Record<Kind, Option[]>> = {
  tinted: finishOptions.tinted.options,
  lacquer: finishOptions.lacquer.options,
  fabric: fabrics.map((f) => ({ id: f.id, label: f.label, value: texUrl(f.id) })),
  cane: finishOptions.cane.options,
  print: finishOptions.print.options,
};

const gloss = "linear-gradient(118deg, #ffffff14 0 20%, transparent 40%)";
const lacquerGloss = "linear-gradient(115deg, transparent 35%, #ffffff3d 45%, transparent 55%)";
const goldLine = (deg: number, at: number) => `linear-gradient(${deg}deg, transparent calc(${at}% - .08cqw), #c9a14e calc(${at}% - .08cqw) calc(${at}% + .08cqw), transparent calc(${at}% + .08cqw))`;

/** The pane in each door: a CSS background for the insert (also used for its swatch). */
function pane(kind: Kind, opt?: Option, fabricColor = ""): string {
  const v = opt?.value ?? "";
  switch (kind) {
    case "clear": return `${gloss}, #f4f1ea26`;
    case "tinted": return opt?.id === "grey" ? `${gloss}, #1e1a1612` : `${gloss}, color-mix(in srgb, ${v} ${opt?.id === "black" ? 72 : 50}%, transparent)`;
    case "fluted": return "repeating-linear-gradient(90deg, #ffffff24 0 .1cqw, transparent .1cqw .22cqw, #00000030 .22cqw .34cqw), #e8e4dc1a";
    case "frosted": return "linear-gradient(118deg, #ffffff26 0 20%, transparent 40%), #e6e2db66";
    case "mirror": return "linear-gradient(180deg, #d2dee62e, #7887912e), url(/images/reflect-living.jpg) center / cover";
    case "lacquer": return `${lacquerGloss}, linear-gradient(170deg, color-mix(in srgb, ${v} 88%, #fff), color-mix(in srgb, ${v} 85%, #000))`;
    case "highlighter": return `${lacquerGloss}, ${goldLine(70, 12)}, ${goldLine(62, 30)}, ${goldLine(66, 52)}, ${goldLine(62, 78)}, ${goldLine(-58, 22)}, ${goldLine(-55, 45)}, ${goldLine(-62, 68)}, ${goldLine(-55, 92)}, ${goldLine(84, 40)}, ${goldLine(84, 88)}, linear-gradient(170deg, #1d1d20, #0a0a0b)`;
    case "fabric": return `url(${v}) 0 0 / 2.4cqw 2.4cqw, ${fabricColor}`;
    case "cane": return `radial-gradient(circle, #14100c59 0 24%, transparent 28%) 0 0 / .9cqw .9cqw, repeating-linear-gradient(45deg, ${v} 0 .13cqw, transparent .13cqw .45cqw), repeating-linear-gradient(-45deg, ${v} 0 .13cqw, transparent .13cqw .45cqw), repeating-linear-gradient(0deg, color-mix(in srgb, ${v} 85%, #fff) 0 .07cqw, transparent .07cqw .45cqw), #e9dcc038`;
    case "print": return `url(${v}) center / cover`;
  }
}

export default function BellaKitchen() {
  const [opened, setOpened] = useState<boolean[]>(Array(7).fill(false));
  const [lit, setLit] = useState(true);
  const [profile, setProfile] = useState<ProfileId>("regular");
  const [frame, setFrame] = useState("graphite");
  const [kind, setKind] = useState<Kind>("tinted");
  const [picks, setPicks] = useState<Record<string, string>>({ tinted: "grey", lacquer: "ivory", fabric: "linen", fabricColor: "ivory", cane: "natural", print: "arches" });
  const anyOpen = opened.some(Boolean);
  const [tint, blend] = tints[frame] ?? ["transparent", "normal"];
  const options = optionsFor[kind];
  const opt = options?.find((o) => o.id === picks[kind]) ?? options?.[0];
  const fabricColors = colorsFor(picks.fabric as FabricId);
  const fabricColor = fabricColors.find((c) => c.id === picks.fabricColor) ?? fabricColors[0];
  const metal = !!fabrics.find((f) => f.id === picks.fabric)?.metal;
  const insertLabel = [findLabel(inserts, kind), opt?.label, kind === "fabric" ? fabricColor.label : null].filter(Boolean).join(" · ");
  // 20 mm keeps the outer half of the photographed frame; the glass grows to meet it. CNC uses the same slim frame (client request).
  const slim = profile === "slim" || profile === "cnc";
  const gwFrac = slim ? 0.91 : glassW, ghFrac = slim ? 0.964 : glassH;
  const roomStyle = {
    "--tint": `linear-gradient(${tint}, ${tint})`, "--blend": blend, "--gw": `${gwFrac * 100}%`, "--gh": `${ghFrac * 100}%`,
    "--pane": pane(kind, opt, fabricColor.value), "--pane-blend": kind === "fabric" ? (metal ? "overlay" : "multiply") : "normal",
    // Fabric glass diffuses the light inside rather than hiding it.
    "--pane-opacity": kind === "fabric" ? (picks.fabric === "sheer" ? 0.6 : metal ? 0.8 : 0.92) : 1,
  } as React.CSSProperties;
  return (
    <section className="bella dark on-dark">
      <div className="container bella-heading">
        <div><div className="t-eyebrow">Bella · Kitchen collection</div><h2 className="t-h2">A little movement.<br /><em>A different space.</em></h2></div>
        <p className="t-lead">Explore Bella in a real kitchen. Pick a profile, frame colour and glass or insert, then open the shutters and switch the warm lighting on.</p>
      </div>
      <div className="container bella-stage">
        <div className="bella-view">
          <div className={`bella-room glass-${kind}${lit ? " is-lit" : ""}`} style={roomStyle}>
            <Image src="/images/bella-kitchen.jpeg" alt="Bella kitchen with dark framed upper glass shutters, pale cabinetry and a stone worktop" width={1545} height={869} preload unoptimized />
            <div className="bella-cabinets">
              {opened.map((open, i) => {
                const w = edges[i + 1] - edges[i];
                const gw = w * glassW, gh = height * glassH, gx = edges[i] + (w - gw) / 2, gy = top + (height - gh) / 2;
                const stile = w * (1 - gwFrac) / 2;
                const opening = i % 2 ? edges[i] : edges[i + 1] - stile; // hinge-left doors open on the right
                return (
                  <div className={`bella-bay${open ? " is-open" : ""}`} key={i} style={{ left: `${(edges[i] - 268) / 1010 * 100}%`, width: `${w / 1010 * 100}%`, "--photo-size": `${1545 / w * 100}% ${869 / height * 100}%`, "--photo-position": `${edges[i] / (1545 - w) * 100}% ${top / (869 - height) * 100}%`, "--glass-size": `${1545 / gw * 100}% ${869 / gh * 100}%`, "--glass-position": `${gx / (1545 - gw) * 100}% ${gy / (869 - gh) * 100}%`,
                    // Where this door's pane sits in the run of seven, so prints and highlighter lines continue across doors.
                    "--pane-x": px(-(edges[i] - 268 + w * (1 - gwFrac) / 2)), "--pane-y": px(-height * (1 - ghFrac) / 2) } as React.CSSProperties}>
                    <div className="bella-interior" aria-hidden="true"><span className="bella-led" /></div>
                    <button type="button" className={`bella-door ${i % 2 ? "hinge-right" : "hinge-left"}`} aria-label={`${open ? "Close" : "Open"} Bella shutter ${i + 1}`} aria-pressed={open} onClick={() => setOpened(values => values.map((value, n) => n === i ? !value : value))}>
                      {/* CNC is handle-free: the handle tabs are covered with frame pixels from higher up each stile, and a groove is routed down the opening edge. */}
                      {profile === "cnc" && <span className="bella-cnc" aria-hidden="true">
                        {[edges[i], edges[i + 1] - stile].map((x) => <span key={x} className="bella-patch" style={{ left: `${(x - edges[i]) / w * 100}%`, width: `${stile / w * 100}%`, backgroundPosition: `0 0, ${px(-x)} ${px(-(top + height * 0.8 - 50))}` }} />)}
                        <span className="bella-groove" style={{ left: `${(opening + stile / 2 - edges[i]) / w * 100}%` }} />
                      </span>}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="bella-task-light" aria-hidden="true" />
          </div>
          <div className="bella-toolbar">
            <div className="bella-actions">
              <ActionButton icon="doors" on={anyOpen} onToggle={() => setOpened(Array(7).fill(!anyOpen))} labelOff="Open shutters" labelOn="Close shutters" hintOff="Explore the cabinet interior" hintOn="Return to the closed view" />
              <ActionButton icon="light" on={lit} onToggle={() => setLit(!lit)} labelOff="Lights off" labelOn="Lights on" hintOff="Switch on warm LEDs" hintOn="Switch off warm LEDs" />
            </div>
            <p role="status">{opened.filter(Boolean).length} / 7 doors open <span>·</span> {lit ? "Warm lighting on" : "Lighting off"}</p>
          </div>
        </div>

        <div className="bella-panel">
          <fieldset className="ss-group">
            <legend>Profile <span>{findLabel(profiles, profile)}</span></legend>
            <div className="seg">
              {profiles.map((p) => <button key={p.id} type="button" className={profile === p.id ? "is-active" : ""} aria-pressed={profile === p.id} onClick={() => setProfile(p.id)}>{p.short}</button>)}
            </div>
          </fieldset>
          <fieldset className="ss-group">
            <legend>Frame colour <span>{findLabel(frameColors, frame)}</span></legend>
            <div className="swatches">
              {frameColors.map((f) => <button key={f.id} type="button" className={`sw-metal${frame === f.id ? " is-active" : ""}`} style={{ "--c": f.hex } as React.CSSProperties} aria-label={f.label} aria-pressed={frame === f.id} onClick={() => setFrame(f.id)} />)}
            </div>
          </fieldset>
          <fieldset className="ss-group">
            <legend>Glass &amp; insert <span>{insertLabel}</span></legend>
            <div className="bella-kinds">
              {inserts.map((k) => <button key={k.id} type="button" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>{k.label}</button>)}
            </div>
            {options && <div className="swatches bella-options">
              {options.map((o) => <button key={o.id} type="button" className={`bella-swatch${opt?.id === o.id ? " is-active" : ""}`} style={{ "--sw": kind === "tinted" ? `${gloss}, ${o.value}` : pane(kind, o, fabricColor.value), "--sw-blend": kind === "fabric" ? (fabrics.find((f) => f.id === o.id)?.metal ? "overlay" : "multiply") : "normal" } as React.CSSProperties} aria-label={o.label} title={o.label} aria-pressed={opt?.id === o.id} onClick={() => setPicks({ ...picks, [kind]: o.id })} />)}
            </div>}
            {kind === "fabric" && <div className="swatches bella-options">
              {fabricColors.map((c) => <button key={c.id} type="button" className={`sw-metal sw-round${fabricColor.id === c.id ? " is-active" : ""}`} style={{ "--c": c.value } as React.CSSProperties} aria-label={c.label} title={c.label} aria-pressed={fabricColor.id === c.id} onClick={() => setPicks({ ...picks, fabricColor: c.id })} />)}
            </div>}
          </fieldset>
        </div>
      </div>
      <p className="container bella-note">Original Bella photograph and door frames. Profile, frame colour, glass and inserts are previews on its doors.</p>
    </section>
  );
}
