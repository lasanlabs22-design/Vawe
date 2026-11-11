"use client";

import { useEffect, useRef, useState } from "react";
import Lines from "./Lines";
import Sliding, { homePositions, revealPositions } from "./Sliding";
import { ActionButton } from "./Shutter";
import { finishKinds, finishOptions, optionLabel, slidingFrames, type Finish, type FinishKind } from "@/lib/sliding";
import { whatsappLink } from "@/lib/site";

export function FinishSwatch({ kind, value }: { kind: FinishKind; value: string }) {
  const style =
    kind === "print"
      ? { backgroundImage: `url(${value})`, backgroundSize: "cover", backgroundPosition: "center" }
      : ({ "--fc": value } as React.CSSProperties);
  return <span className={`sl-swatch slf-${kind}`} style={style} />;
}

export default function SlidingStudio() {
  const [panels, setPanels] = useState(3);
  const [positions, setPositions] = useState(homePositions(3));
  const [frame, setFrame] = useState("black");
  const [finish, setFinish] = useState<Finish>({ kind: "tinted", value: finishOptions.tinted.options[0].value });
  const [light, setLight] = useState(false);
  const [custom, setCustom] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // release the preview object URL when it changes
  useEffect(() => () => {
    if (custom) URL.revokeObjectURL(custom);
  }, [custom]);

  const frameHex = slidingFrames.find((f) => f.id === frame)!.value;
  const isClosed = positions.every((p, i) => Math.abs(p - i / panels) < 0.01);

  const changePanels = (n: number) => {
    setPanels(n);
    setPositions(homePositions(n));
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setCustom(url);
    setFinish({ kind: "print", value: url });
  };

  const summary = [
    `${panels} sliding panels`,
    `${slidingFrames.find((f) => f.id === frame)!.label} frame`,
    `${finishOptions[finish.kind].label}: ${optionLabel(finish)}`,
  ];

  const slots = panels === 2 ? ["Left", "Right"] : panels === 3 ? ["Left", "Centre", "Right"] : ["Section 1", "Section 2", "Section 3", "Section 4"];

  return (
    <section className="ss dark on-dark tone-warm" id="sliding-config">
      <div className="container ss-head">
        <div>
          <div className="t-eyebrow reveal">Sliding studio</div>
          <Lines
            className="t-h2"
            lines={[
              <>Slide it. Light it.</>,
              <>
                <em>Make it yours.</em>
              </>,
            ]}
          />
        </div>
        <p className="t-lead reveal">
          Drag any panel along its track, or use the buttons to reveal a section. Then choose a frame, a finish and a
          shade, or print your own artwork across the doors.
        </p>
      </div>

      <div className="ss-grid">
        <div className={`ss-stage${light ? " is-lit" : ""}`}>
          <span className="sl-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 12h16M4 12l3-3M4 12l3 3M20 12l-3-3M20 12l-3 3" />
            </svg>
            Drag a panel to slide it
          </span>
          <div className="ms-anim reveal" style={{ "--from": 1 } as React.CSSProperties}>
            <Sliding
              panels={panels}
              positions={positions}
              onPositions={setPositions}
              frame={frameHex}
              finish={finish}
              light={light}
              angle={-12}
              label="studio wardrobe"
            />
          </div>
          <div className="ss-actions">
            <div className="seg sl-reveal" role="group" aria-label="Reveal a section">
              {slots.map((s, i) => (
                <button key={s} type="button" onClick={() => setPositions(revealPositions(panels, i))}>
                  {s}
                </button>
              ))}
              <button type="button" className={isClosed ? "is-active" : ""} onClick={() => setPositions(homePositions(panels))}>
                Close
              </button>
            </div>
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
            <legend>Panels</legend>
            <div className="seg">
              {[2, 3, 4].map((n) => (
                <button key={n} type="button" className={panels === n ? "is-active" : ""} aria-pressed={panels === n} onClick={() => changePanels(n)}>
                  {n} panels
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-group">
            <legend>
              Frame <span>{slidingFrames.find((f) => f.id === frame)!.label}</span>
            </legend>
            <div className="swatches">
              {slidingFrames.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`sw-metal${frame === f.id ? " is-active" : ""}`}
                  style={{ "--c": f.value } as React.CSSProperties}
                  aria-label={f.label}
                  aria-pressed={frame === f.id}
                  onClick={() => setFrame(f.id)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-group">
            <legend>Finish</legend>
            <div className="seg sl-kinds">
              {finishKinds.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={finish.kind === k ? "is-active" : ""}
                  aria-pressed={finish.kind === k}
                  onClick={() => setFinish({ kind: k, value: finishOptions[k].options[0].value })}
                >
                  {finishOptions[k].label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-group">
            <legend>
              {finish.kind === "print" ? "Artwork" : "Shade"} <span>{optionLabel(finish)}</span>
            </legend>
            <div className="swatches">
              {finishOptions[finish.kind].options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`sl-opt${finish.value === o.value ? " is-active" : ""}`}
                  aria-label={o.label}
                  aria-pressed={finish.value === o.value}
                  onClick={() => setFinish({ kind: finish.kind, value: o.value })}
                >
                  <FinishSwatch kind={finish.kind} value={o.value} />
                </button>
              ))}
              {finish.kind === "print" && (
                <>
                  {custom && (
                    <button
                      type="button"
                      className={`sl-opt${finish.value === custom ? " is-active" : ""}`}
                      aria-label="Your artwork"
                      onClick={() => setFinish({ kind: "print", value: custom })}
                    >
                      <FinishSwatch kind="print" value={custom} />
                    </button>
                  )}
                  <button type="button" className="sl-upload" onClick={() => fileRef.current?.click()}>
                    <span aria-hidden="true">+</span>
                    Upload your artwork
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
                </>
              )}
            </div>
            {finish.kind === "print" && (
              <p className="sl-note">Your image stays on your device and is only used for this preview.</p>
            )}
          </fieldset>

          <div className="ss-summary">
            <span className="t-mono">Your wardrobe</span>
            <p>{summary.join(" · ")}</p>
            <a
              className="btn btn-pink"
              href={whatsappLink(`Hi Vawe, I'd like a quote for a sliding wardrobe: ${summary.join(", ")}.`)}
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
