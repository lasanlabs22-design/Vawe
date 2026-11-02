"use client";

import { useState } from "react";
import Lines from "./Lines";
import Shower, { enclosureTypes, hardware, showerGlass, type EnclosureType, type ShowerGlass } from "./Shower";
import { ActionButton } from "./Shutter";
import { whatsappLink } from "@/lib/site";

/** Door + shower controls shared by the studio and the type sections. */
export function ShowerControls({
  type,
  open,
  water,
  onDoor,
  onWater,
  compact = false,
}: {
  type: EnclosureType;
  open: boolean;
  water: boolean;
  onDoor: () => void;
  onWater: () => void;
  compact?: boolean;
}) {
  return (
    <>
      {type === "fixed" ? (
        <span className="bt-walkin">Walk-in: no door to open</span>
      ) : (
        <ActionButton
          icon="doors"
          on={open}
          onToggle={onDoor}
          labelOff={type === "sliding" ? "Slide door open" : "Open door"}
          labelOn="Close door"
          hintOff={compact ? undefined : "Or click the door"}
          hintOn={compact ? undefined : "Door is open"}
          size={compact ? "sm" : "md"}
        />
      )}
      <button type="button" className={`pwr pwr-${compact ? "sm" : "md"} bt-tap${water ? " is-on" : ""}`} aria-pressed={water} onClick={onWater}>
        <span className="pwr-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M5 8h14M7 8a5 5 0 0 1 10 0" />
            <path d="M8 12v2M12 12v3M16 12v2M10 17v2M14 17v2" />
          </svg>
        </span>
        <span className="pwr-text">
          <b>{water ? "Shower on" : "Turn on shower"}</b>
          {!compact && <small>{water ? "Watch the glass mist" : "See it in use"}</small>}
        </span>
      </button>
    </>
  );
}

export default function ShowerStudio() {
  const [type, setType] = useState<EnclosureType>("hinged");
  const [glass, setGlass] = useState<ShowerGlass>("clear");
  const [hw, setHw] = useState("black");
  const [open, setOpen] = useState(false);
  const [water, setWater] = useState(false);

  const hwInfo = hardware.find((h) => h.id === hw)!;
  const summary = [
    enclosureTypes.find((x) => x.id === type)!.label,
    showerGlass.find((g) => g.id === glass)!.label + " glass",
    `${hwInfo.label} hardware`,
  ];

  return (
    <section className="ss dark on-dark" id="shower-config">
      <div className="container ss-head">
        <div>
          <div className="t-eyebrow reveal">Shower studio</div>
          <Lines
            className="t-h2"
            lines={[
              <>Plan your shower.</>,
              <>
                <em>Try it</em> before it&apos;s built.
              </>,
            ]}
          />
        </div>
        <p className="t-lead reveal">
          A working model of your enclosure. Choose the layout, glass and hardware, open the door, and turn on the
          shower to see how the glass behaves in use.
        </p>
      </div>

      <div className="ss-grid">
        <div className="ss-stage bt-stage">
          <Shower type={type} glass={glass} hw={hwInfo.value} open={open} water={water} angle={-8} onToggleDoor={() => setOpen((o) => !o)} />
          <div className="ss-actions">
            <ShowerControls type={type} open={open} water={water} onDoor={() => setOpen((o) => !o)} onWater={() => setWater((w) => !w)} />
          </div>
        </div>

        <div className="ss-panel">
          <fieldset className="ss-group">
            <legend>Layout</legend>
            <div className="seg">
              {enclosureTypes.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  className={type === x.id ? "is-active" : ""}
                  aria-pressed={type === x.id}
                  onClick={() => {
                    setType(x.id);
                    setOpen(false);
                  }}
                >
                  {x.short}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-group">
            <legend>
              Glass <span>{showerGlass.find((g) => g.id === glass)!.label}</span>
            </legend>
            <div className="swatches">
              {showerGlass.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`sl-opt${glass === g.id ? " is-active" : ""}`}
                  aria-label={g.label}
                  aria-pressed={glass === g.id}
                  onClick={() => setGlass(g.id)}
                >
                  <span className="bt-swatch">
                    <span className={`bt-glass bg-${g.id}`}>{g.id === "band" && <span className="bt-band" />}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-group">
            <legend>
              Hardware <span>{hwInfo.label}</span>
            </legend>
            <div className="swatches">
              {hardware.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  className={`sw-metal sw-round${hw === h.id ? " is-active" : ""}`}
                  style={{ "--c": h.value } as React.CSSProperties}
                  aria-label={h.label}
                  aria-pressed={hw === h.id}
                  onClick={() => setHw(h.id)}
                />
              ))}
            </div>
          </fieldset>

          <ul className="bt-specs">
            <li>Toughened safety glass, cut to your opening</li>
            <li>Measured and installed on site by our team</li>
            <li>Hardware chosen for daily, wet use</li>
          </ul>

          <div className="ss-summary">
            <span className="t-mono">Your enclosure</span>
            <p>{summary.join(" · ")}</p>
            <a
              className="btn btn-pink"
              href={whatsappLink(`Hi Vawe, I'd like a quote for a bathroom partition: ${summary.join(", ")}.`)}
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
