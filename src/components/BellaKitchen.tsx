"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useHash } from "@/lib/focus";
import { ActionButton } from "./Shutter";
import { findLabel, profiles, type ProfileId } from "@/lib/shutters";
import { finishOptions } from "@/lib/sliding";

// Pixel boundaries in the supplied photograph. Door frames and the interior behind them use these exact pixels.
const edges = [268, 410, 555, 700, 844, 990, 1136, 1278];
const top = 78, height = 326; // the doors' row in the photograph
// Glass opening inside each photographed 45 mm frame, as a share of the door.
const glassW = 0.82, glassH = 0.92;
// Photo pixels to on-screen length (the room is 1545 photo pixels wide).
const px = (n: number) => `calc(${n.toFixed(1)} * 100cqw / 1545)`;

// Frame finishes from the client's profile board. The photographed frame is already ceramic black; each
// other finish screens a tint over it, chosen so the result lands on the board colour (`hex`, the swatch).
const finishes: { id: string; label: string; hex: string; tint?: string }[] = [
  { id: "ceramic-black", label: "Ceramic Black", hex: "#2b2c2f" },
  { id: "rose-gold", label: "Rose Gold", hex: "#b88a7c", tint: "#a46957" },
  { id: "brush-gold", label: "Brush Gold", hex: "#a08a5e", tint: "#856931" },
  { id: "glossy-gold", label: "Glossy Gold", hex: "#d4ac3c", tint: "#c89505" },
  { id: "grey", label: "Grey", hex: "#8a9298", tint: "#69737b" },
  { id: "cp-brush", label: "CP Brush", hex: "#c4ccd2", tint: "#b4bec6" },
  { id: "aluminium", label: "Aluminium", hex: "#e4e9ed", tint: "#dce3e8" },
  { id: "electro-champagne", label: "Electro Champagne", hex: "#7d694b", tint: "#583f18" },
];
// The finishes each profile comes in, in the client's order.
const finishesFor: Record<ProfileId, string[]> = {
  regular: finishes.map((f) => f.id),
  slim: ["ceramic-black", "rose-gold", "brush-gold", "glossy-gold"],
  cnc: ["ceramic-black", "brush-gold", "rose-gold"],
};

// Every glass and insert the client offers. Tints, lacquers and prints reuse the sliding studio's options.
type Kind = "clear" | "tinted" | "fluted" | "frosted" | "mirror" | "lacquer" | "fabric" | "cane" | "print";
type Option = { id: string; label: string; value: string };
const inserts: { id: Kind; label: string }[] = [
  { id: "clear", label: "Clear" },
  { id: "tinted", label: "Tinted" },
  { id: "fluted", label: "Fluted" },
  { id: "frosted", label: "Frosted" },
  { id: "mirror", label: "Mirror" },
  { id: "lacquer", label: "Lacquered" },
  { id: "fabric", label: "Fabric" },
  { id: "cane", label: "Cane" },
  { id: "print", label: "Digital print" },
];
// The client's four headings. Regular glass lists its kinds as buttons; a `mixed` heading shows the
// options of all its kinds together in one row of swatches.
const groups: { label: string; kinds: Kind[]; mixed?: boolean }[] = [
  { label: "Regular glass", kinds: ["clear", "tinted", "fluted", "frosted", "mirror"] },
  { label: "Lacquered", kinds: ["lacquer"] },
  { label: "Fabric / Cane", kinds: ["fabric", "cane"], mixed: true },
  { label: "Digital print", kinds: ["print"] },
];
const optionsFor: Partial<Record<Kind, Option[]>> = {
  tinted: finishOptions.tinted.options,
  lacquer: finishOptions.lacquer.options,
  // The client's own fabric glass samples, cropped from their studio photographs.
  fabric: [
    { id: "white-linen", label: "White Linen", value: "/images/fabric-glass/white-linen.webp" },
    { id: "champagne-weave", label: "Champagne Weave", value: "/images/fabric-glass/champagne-weave.webp" },
    { id: "bronze-stripe", label: "Bronze Stripe", value: "/images/fabric-glass/bronze-stripe.webp" },
    { id: "gold-web", label: "Gold Web", value: "/images/fabric-glass/gold-web.webp" },
    { id: "copper-crackle", label: "Copper Crackle", value: "/images/fabric-glass/copper-crackle.webp" },
    { id: "black-grid", label: "Black Grid", value: "/images/fabric-glass/black-grid.webp" },
  ],
  // Seamless cane weaves at architectural scale, with fine spacing guided by the wardrobe reference.
  cane: finishOptions.cane.options,
  print: finishOptions.print.options,
};

const gloss = "linear-gradient(118deg, #ffffff14 0 20%, transparent 40%)";
const lacquerGloss = "linear-gradient(115deg, transparent 35%, #ffffff3d 45%, transparent 55%)";

/** The pane in each door: a CSS background for the insert (also used for its swatch). */
function pane(kind: Kind, opt?: Option): string {
  const v = opt?.value ?? "";
  switch (kind) {
    case "clear": return `${gloss}, #f4f1ea26`;
    case "tinted": return `${gloss}, color-mix(in srgb, ${v} ${opt?.id === "black" ? 72 : 50}%, transparent)`;
    case "fluted": return "repeating-linear-gradient(90deg, #ffffff24 0 .1cqw, transparent .1cqw .22cqw, #00000030 .22cqw .34cqw), #e8e4dc1a";
    case "frosted": return "linear-gradient(118deg, #ffffff26 0 20%, transparent 40%), #e6e2db66";
    case "mirror": return "linear-gradient(180deg, #d2dee62e, #7887912e), url(/images/reflect-living.jpg) center / cover";
    case "lacquer": return `${lacquerGloss}, linear-gradient(170deg, color-mix(in srgb, ${v} 88%, #fff), color-mix(in srgb, ${v} 85%, #000))`;
    case "fabric": return `url(${v}) center / cover`;
    case "cane": return `url(${v}) center / var(--cane-tile, .32cqw) auto repeat`;
    case "print": return `url(${v}) center / cover`;
  }
}

// Nav links pick a profile: /series/openable-shutters#bella--20-mm opens the studio on 20 mm.
const profileFor: Record<string, ProfileId> = { "bella--45-mm": "regular", "bella--20-mm": "slim", "bella--cnc": "cnc" };

export default function BellaKitchen() {
  const hash = useHash();
  useEffect(() => {
    if (hash in profileFor) document.getElementById("bella-studio")?.scrollIntoView({ block: "start" });
  }, [hash]);
  return <Bella key={hash} initialProfile={profileFor[hash] ?? "regular"} />;
}

function Bella({ initialProfile }: { initialProfile: ProfileId }) {
  const [opened, setOpened] = useState<boolean[]>(Array(7).fill(false));
  const [lit, setLit] = useState(true);
  const [profile, setProfile] = useState<ProfileId>(initialProfile);
  const [frame, setFrame] = useState("ceramic-black");
  const [kind, setKind] = useState<Kind>("clear");
  const [picks, setPicks] = useState<Record<string, string>>({ tinted: "bronze", lacquer: "ivory", fabric: "white-linen", cane: "natural-rattan", print: "arches" });
  const anyOpen = opened.some(Boolean);
  // A finish the new profile doesn't come in falls back to its first one (ceramic black).
  const frameOptions = finishesFor[profile].map((id) => finishes.find((f) => f.id === id)!);
  const finish = frameOptions.find((f) => f.id === frame) ?? frameOptions[0];
  const t = finish.tint;
  // A soft light-to-dark sheen down each door so the finish reads as metal, not flat paint.
  const tint = t ? `linear-gradient(165deg, color-mix(in srgb, ${t} 78%, #fff), ${t} 45%, color-mix(in srgb, ${t} 82%, #000))` : "linear-gradient(transparent, transparent)";
  const blend = t ? "screen" : "normal";
  const group = groups.find((g) => g.kinds.includes(kind))!;
  const options = optionsFor[kind];
  const opt = options?.find((o) => o.id === picks[kind]) ?? options?.[0];
  const swatches = (group.mixed ? group.kinds : [kind]).flatMap((k) => (optionsFor[k] ?? []).map((o) => ({ k, o })));
  const insertLabel = [findLabel(inserts, kind), opt?.label].filter(Boolean).join(" · ");
  // 20 mm keeps the outer half of the photographed frame; the glass grows to meet it. CNC uses the same slim frame (client request).
  const slim = profile === "slim" || profile === "cnc";
  const gwFrac = slim ? 0.91 : glassW, ghFrac = slim ? 0.964 : glassH;
  const roomStyle = {
    "--tint": tint, "--blend": blend, "--gw": `${gwFrac * 100}%`, "--gh": `${ghFrac * 100}%`,
    "--pane": pane(kind, opt),
    // Fabric glass lets a little of the lit interior glow through.
    "--pane-opacity": kind === "fabric" ? 0.9 : 1,
  } as React.CSSProperties;
  return (
    <section className="bella dark on-dark" id="bella-studio">
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
                    // Where this door's pane sits in the run of seven, so prints continue across doors.
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
            <legend>Frame colour <span>{finish.label}</span></legend>
            <div className="swatches bella-frames">
              {frameOptions.map((f) => <button key={f.id} type="button" className={`sw-metal${finish.id === f.id ? " is-active" : ""}`} style={{ "--c": f.hex } as React.CSSProperties} aria-label={f.label} title={f.label} aria-pressed={finish.id === f.id} onClick={() => setFrame(f.id)} />)}
            </div>
          </fieldset>
          <fieldset className="ss-group">
            <legend>Glass &amp; insert <span>{insertLabel}</span></legend>
            <div className="bella-groups">
              {groups.map((g) => <button key={g.label} type="button" aria-pressed={group === g} onClick={() => { if (group !== g) setKind(g.kinds[0]); }}>{g.label}</button>)}
            </div>
            {group.kinds.length > 1 && !group.mixed && <div className="bella-kinds">
              {group.kinds.map((k) => <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>{findLabel(inserts, k)}</button>)}
            </div>}
            {swatches.length > 0 && <div className="swatches bella-options">
              {swatches.map(({ k, o }) => {
                const on = kind === k && opt?.id === o.id;
                const label = group.mixed ? `${findLabel(inserts, k)} · ${o.label}` : o.label;
                return <button key={`${k}-${o.id}`} type="button" className={`bella-swatch${on ? " is-active" : ""}`} style={{ "--sw": k === "tinted" ? `${gloss}, ${o.value}` : pane(k, o) } as React.CSSProperties} aria-label={label} title={label} aria-pressed={on} onClick={() => { setKind(k); setPicks({ ...picks, [k]: o.id }); }} />;
              })}
            </div>}
          </fieldset>
        </div>
      </div>
      <p className="container bella-note">Original Bella photograph and door frames. Profile, frame colour, glass and inserts are previews on its doors.</p>
    </section>
  );
}
