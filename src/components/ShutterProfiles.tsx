"use client";

import { useState } from "react";
import Lines from "./Lines";
import Shutter, { ActionButton } from "./Shutter";
import { frameColors, hingeFinishes, profiles, type InsertId, type ProfileId } from "@/lib/shutters";
import { focusKey } from "@/lib/series";
import { whatsappLink } from "@/lib/site";

const presets: { profile: ProfileId; frame: string; hinge: string; insert: InsertId; side: "left" | "right"; angle: number; wall: string }[] = [
  { profile: "regular", frame: "champagne", hinge: "gold", insert: "fluted", side: "left", angle: -16, wall: "#171513" },
  { profile: "slim", frame: "black", hinge: "black", insert: "tinted", side: "right", angle: 16, wall: "#131416" },
  { profile: "cnc", frame: "graphite", hinge: "nickel", insert: "lacquer-ivory", side: "left", angle: -14, wall: "#161514" },
];

const focusFor: Record<ProfileId, string> = { regular: focusKey("45 mm"), slim: focusKey("20 mm"), cnc: focusKey("CNC") };

function ProfileSection({ index }: { index: number }) {
  const p = presets[index];
  const info = profiles.find((x) => x.id === p.profile)!;
  const [frame, setFrame] = useState(p.frame);
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const hex = frameColors.find((f) => f.id === frame)!.hex;
  const hingeHex = hingeFinishes.find((h) => h.id === p.hinge)!.hex;
  const num = String(index + 1).padStart(2, "0");

  return (
    <section
      className={`ms-section ms-${p.side} tone-warm${light ? " is-lit" : ""}`}
      style={{ "--wall": p.wall } as React.CSSProperties}
      aria-label={info.label}
      data-focus={focusFor[p.profile]}
    >
      <div className="ms-stage sp-stage">
        <span className="ms-num" aria-hidden="true">
          {num}
        </span>
        <div data-parallax="0.05" suppressHydrationWarning>
          <div className="ms-anim reveal" style={{ "--from": p.side === "left" ? 1 : -1 } as React.CSSProperties}>
            <Shutter
              doors={2}
              profile={p.profile}
              frame={hex}
              hinge={hingeHex}
              insert={p.insert}
              open={open}
              light={light}
              angle={p.angle}
              onToggle={() => setOpen((o) => !o)}
              label={info.label}
            />
          </div>
        </div>
      </div>

      <div className="ms-copy on-dark">
        <div className="t-eyebrow reveal">
          {num} · Openable shutter profile
        </div>
        <Lines as="h3" className="t-display ms-title" lines={[<>{info.short}</>]} />
        <p className="t-lead reveal" style={{ "--d": 120 } as React.CSSProperties}>
          {info.description}
        </p>

        <div className={`pcut pcut-${p.profile} reveal`} style={{ "--frame": hex } as React.CSSProperties} aria-hidden="true">
          <span className="pcut-body">
            <span className="pcut-slot" />
            {p.profile === "cnc" && <span className="pcut-groove" />}
          </span>
          <span className="pcut-dim">
            <i />
            <b>{info.mm ? `${info.mm} mm` : "Routed groove"}</b>
          </span>
          <span className="pcut-label">Profile cross-section</span>
        </div>

        <div className="ss-group sp-colors reveal">
          <span className="sp-legend">Frame colour</span>
          <div className="swatches">
            {frameColors.slice(0, 6).map((f) => (
              <button
                key={f.id}
                type="button"
                className={`sw-metal${frame === f.id ? " is-active" : ""}`}
                style={{ "--c": f.hex } as React.CSSProperties}
                aria-label={f.label}
                aria-pressed={frame === f.id}
                onClick={() => setFrame(f.id)}
              />
            ))}
          </div>
        </div>

        <div className="ms-controls reveal">
          <ActionButton
            icon="doors"
            on={open}
            onToggle={() => setOpen((o) => !o)}
            labelOff="Open shutters"
            labelOn="Close shutters"
            hintOff="Watch them swing"
            hintOn="Doors are open"
          />
          <ActionButton
            icon="light"
            on={light}
            onToggle={() => setLight((l) => !l)}
            labelOff="Interior light"
            labelOn="Light on"
            size="sm"
          />
        </div>
        <a
          className="link-line reveal"
          style={{ alignSelf: "flex-start" }}
          href={whatsappLink(`Hi Vawe, I'm interested in openable shutters with the ${info.label}.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire about {info.short} →
        </a>
      </div>
    </section>
  );
}

export default function ShutterProfiles() {
  return (
    <div className="ms-list">
      {presets.map((_, i) => (
        <ProfileSection key={i} index={i} />
      ))}
    </div>
  );
}
