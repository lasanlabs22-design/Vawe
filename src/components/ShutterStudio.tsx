"use client";

import { useState } from "react";
import Lines from "./Lines";
import Shutter, { ActionButton } from "./Shutter";
import { findLabel, frameColors, hingeFinishes, inserts, profiles, type InsertId, type ProfileId } from "@/lib/shutters";
import { whatsappLink } from "@/lib/site";

export default function ShutterStudio() {
  const [profile, setProfile] = useState<ProfileId>("regular");
  const [frame, setFrame] = useState("champagne");
  const [hinge, setHinge] = useState("gold");
  const [insert, setInsert] = useState<InsertId>("fluted");
  const [doors, setDoors] = useState(3);
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);

  const frameHex = frameColors.find((f) => f.id === frame)!.hex;
  const hingeHex = hingeFinishes.find((h) => h.id === hinge)!.hex;
  const summary = [
    findLabel(profiles, profile),
    `${findLabel(frameColors, frame)} frame`,
    findLabel(inserts, insert),
    `${findLabel(hingeFinishes, hinge)} hinges`,
    `${doors} doors`,
  ];

  return (
    <section className="ss dark on-dark tone-warm" id="studio-config">
      <div className="container ss-head">
        <div>
          <div className="t-eyebrow reveal">Shutter studio</div>
          <Lines
            className="t-h2"
            lines={[
              <>Design your shutter.</>,
              <>
                <em>Open</em> it up.
              </>,
            ]}
          />
        </div>
        <p className="t-lead reveal">
          Pick a profile, frame colour, insert and hinge finish. Then open the doors and switch on the interior light
          to see it the way it will live in your home.
        </p>
      </div>

      <div className="ss-grid">
        <div className={`ss-stage${light ? " is-lit" : ""}`}>
          <div className="ms-anim reveal" style={{ "--from": 1 } as React.CSSProperties}>
            <Shutter
              doors={doors}
              profile={profile}
              frame={frameHex}
              hinge={hingeHex}
              insert={insert}
              open={open}
              light={light}
              angle={-12}
              onToggle={() => setOpen((o) => !o)}
              label="studio"
            />
          </div>
          <div className="ss-actions">
            <ActionButton
              icon="doors"
              on={open}
              onToggle={() => setOpen((o) => !o)}
              labelOff="Open shutters"
              labelOn="Close shutters"
              hintOff="Swing the doors open"
              hintOn="Doors are open"
            />
            <ActionButton
              icon="light"
              on={light}
              onToggle={() => setLight((l) => !l)}
              labelOff="Interior light"
              labelOn="Light on"
              hintOff="Switch on the LED"
              hintOn="Press to switch off"
            />
          </div>
        </div>

        <div className="ss-panel">
          <fieldset className="ss-group">
            <legend>Profile</legend>
            <div className="seg">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={profile === p.id ? "is-active" : ""}
                  aria-pressed={profile === p.id}
                  onClick={() => setProfile(p.id)}
                >
                  {p.short}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-group">
            <legend>
              Frame colour <span>{findLabel(frameColors, frame)}</span>
            </legend>
            <div className="swatches">
              {frameColors.map((f) => (
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
          </fieldset>

          <fieldset className="ss-group">
            <legend>
              Insert <span>{findLabel(inserts, insert)}</span>
            </legend>
            <div className="swatches">
              {inserts.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  className={`sw-insert ins-${x.id}${insert === x.id ? " is-active" : ""}`}
                  aria-label={x.label}
                  aria-pressed={insert === x.id}
                  onClick={() => setInsert(x.id)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-group">
            <legend>
              Hinges &amp; handle <span>{findLabel(hingeFinishes, hinge)}</span>
            </legend>
            <div className="swatches">
              {hingeFinishes.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  className={`sw-metal sw-round${hinge === h.id ? " is-active" : ""}`}
                  style={{ "--c": h.hex } as React.CSSProperties}
                  aria-label={h.label}
                  aria-pressed={hinge === h.id}
                  onClick={() => setHinge(h.id)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-group">
            <legend>Doors</legend>
            <div className="seg">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={doors === n ? "is-active" : ""}
                  aria-pressed={doors === n}
                  onClick={() => setDoors(n)}
                >
                  {n} doors
                </button>
              ))}
            </div>
          </fieldset>

          <div className="ss-summary">
            <span className="t-mono">Your shutter</span>
            <p>{summary.join(" · ")}</p>
            <a
              className="btn btn-pink"
              href={whatsappLink(`Hi Vawe, I'd like a quote for openable shutters: ${summary.join(", ")}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get a quote for this <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
