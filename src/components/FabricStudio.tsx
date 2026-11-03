"use client";

import { useState } from "react";
import Lines from "./Lines";
import FabricPanel from "./FabricPanel";
import { ActionButton } from "./Shutter";
import { colorsFor, fabrics, texUrl, type FabricId } from "@/lib/fabric";
import { whatsappLink } from "@/lib/site";

/** Fabric + colour pickers shared by the studio and the application sections. */
export function FabricPickers({
  fabric,
  color,
  onFabric,
  onColor,
}: {
  fabric: FabricId;
  color: string;
  onFabric: (f: FabricId) => void;
  onColor: (c: string) => void;
}) {
  const colors = colorsFor(fabric);
  const fInfo = fabrics.find((f) => f.id === fabric)!;
  const cInfo = colors.find((c) => c.value === color);
  return (
    <>
      <fieldset className="ss-group">
        <legend>
          Fabric <span>{fInfo.label}</span>
        </legend>
        <div className="swatches">
          {fabrics.map((f) => {
            const c = colorsFor(f.id)[0].value;
            return (
              <button
                key={f.id}
                type="button"
                className={`sl-opt${fabric === f.id ? " is-active" : ""}`}
                aria-label={f.label}
                aria-pressed={fabric === f.id}
                onClick={() => {
                  onFabric(f.id);
                  if (!colorsFor(f.id).some((x) => x.value === color)) onColor(colorsFor(f.id)[0].value);
                }}
              >
                <span className="fg-swatch" style={{ "--fc": fabric === f.id ? color : c, "--tex": `url(${texUrl(f.id)})` } as React.CSSProperties}>
                  <i />
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset className="ss-group">
        <legend>
          Colour <span>{cInfo?.label}</span>
        </legend>
        <div className="swatches">
          {colors.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`sw-metal sw-round${color === c.value ? " is-active" : ""}`}
              style={{ "--c": c.value } as React.CSSProperties}
              aria-label={c.label}
              aria-pressed={color === c.value}
              onClick={() => onColor(c.value)}
            />
          ))}
        </div>
      </fieldset>
    </>
  );
}

export default function FabricStudio() {
  const [fabric, setFabric] = useState<FabricId>("linen");
  const [color, setColor] = useState(colorsFor("linen")[0].value);
  const [backlight, setBacklight] = useState(false);
  const [exploded, setExploded] = useState(false);
  const fInfo = fabrics.find((f) => f.id === fabric)!;
  const cInfo = colorsFor(fabric).find((c) => c.value === color);
  const summary = [`${fInfo.label} fabric`, cInfo?.label ?? "", backlight ? "with LED backlight" : "laminated in toughened glass"];

  return (
    <section className="ss dark on-dark tone-warm" id="fabric-config">
      <div className="container ss-head">
        <div>
          <div className="t-eyebrow reveal">Fabric glass studio</div>
          <Lines
            className="t-h2"
            lines={[
              <>Real textile.</>,
              <>
                <em>Sealed in glass.</em>
              </>,
            ]}
          />
        </div>
        <p className="t-lead reveal">
          Pick a weave and a colour, look closely at the fabric, switch on a backlight to see light pass
          through it, or take the panel apart to see how it&apos;s made.
        </p>
      </div>

      <div className="ss-grid">
        <div className="ss-stage fg-stage">
          {!exploded && (
            <span className="sl-hint" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="6" />
                <path d="m20 20-4.5-4.5" />
              </svg>
              <span className="only-hover">Hover</span>
              <span className="only-touch">Tap</span> the glass to see the weave
            </span>
          )}
          <FabricPanel
            fabric={fabric}
            color={color}
            backlight={backlight}
            exploded={exploded}
            mode="studio"
            view="/images/about-living.jpg"
            loupe
            angle={-8}
          />
          <div className="ss-actions">
            <ActionButton
              icon="light"
              on={backlight}
              onToggle={() => setBacklight((b) => !b)}
              labelOff="LED backlight"
              labelOn="Backlight on"
              hintOff="See light through the weave"
              hintOn="Press to switch off"
            />
            <button type="button" className={`pwr pwr-md${exploded ? " is-on" : ""}`} aria-pressed={exploded} onClick={() => setExploded((x) => !x)}>
              <span className="pwr-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                  <path d="M4 7l8-4 8 4-8 4-8-4Z" />
                  <path d="M4 12l8 4 8-4M4 17l8 4 8-4" />
                </svg>
              </span>
              <span className="pwr-text">
                <b>{exploded ? "Assemble panel" : "Exploded view"}</b>
                <small>{exploded ? "Put the layers back" : "See the layers"}</small>
              </span>
            </button>
          </div>
        </div>

        <div className="ss-panel">
          <FabricPickers fabric={fabric} color={color} onFabric={setFabric} onColor={setColor} />
          <ul className="bt-specs">
            <li>Real woven textile, laminated between two sheets of glass</li>
            <li>Wipe-clean surface: no dust, no fading fabric to wash</li>
            <li>Diffuses light while keeping rooms private</li>
          </ul>
          <div className="ss-summary">
            <span className="t-mono">Your fabric glass</span>
            <p>{summary.filter(Boolean).join(" · ")}</p>
            <a
              className="btn btn-pink"
              href={whatsappLink(`Hi Vawe, I'd like a quote for fabric glass: ${summary.filter(Boolean).join(", ")}.`)}
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
