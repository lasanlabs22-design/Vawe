"use client";

export type EnclosureType = "fixed" | "hinged" | "sliding";
export type ShowerGlass = "clear" | "band" | "frosted" | "fluted" | "bronze";

export const enclosureTypes: { id: EnclosureType; label: string; short: string }[] = [
  { id: "fixed", label: "Fixed Panel (Walk-in)", short: "Walk-in" },
  { id: "hinged", label: "Hinged Door", short: "Hinged" },
  { id: "sliding", label: "Sliding Enclosure", short: "Sliding" },
];

export const showerGlass: { id: ShowerGlass; label: string }[] = [
  { id: "clear", label: "Clear toughened" },
  { id: "band", label: "Frosted privacy band" },
  { id: "frosted", label: "Fully frosted" },
  { id: "fluted", label: "Fluted" },
  { id: "bronze", label: "Bronze tint" },
];

export const hardware: { id: string; label: string; value: string }[] = [
  { id: "chrome", label: "Polished chrome", value: "#d3d7da" },
  { id: "black", label: "Matte black", value: "#1f1f21" },
  { id: "gold", label: "Brushed gold", value: "#c9a14e" },
  { id: "nickel", label: "Brushed nickel", value: "#a6a9ab" },
];

type Props = {
  type: EnclosureType;
  glass: ShowerGlass;
  hw: string;
  open: boolean;
  water: boolean;
  angle?: number;
  onToggleDoor?: () => void;
};

function Glass({ glass, children }: { glass: ShowerGlass; children?: React.ReactNode }) {
  return (
    <span className={`bt-glass bg-${glass}`}>
      {glass === "band" && <span className="bt-band" />}
      <span className="bt-fog" />
      <span className="bt-drops" />
      <span className="bt-sheen" />
      {children}
    </span>
  );
}

/**
 * A working shower-enclosure model: a CSS-3D tiled alcove with real fixtures,
 * a glass enclosure whose door opens, and a shower that runs, steams and fogs the glass.
 */
export default function Shower({ type, glass, hw, open, water, angle = 0, onToggleDoor }: Props) {
  return (
    <div
      className={`bt-wrap t-${type}${open ? " is-open" : ""}${water ? " is-on" : ""}`}
      style={{ "--hw": hw, "--ang": `${angle}deg` } as React.CSSProperties}
    >
      <div className="bt-room">
        {/* the alcove */}
        <span className="bt-back" />
        <span className="bt-side bt-left" />
        <span className="bt-side bt-right" />
        <span className="bt-ceiling" />
        <span className="bt-floor" />
        <span className="bt-downlight" />

        {/* fixtures */}
        <span className="bt-niche">
          <i className="bt-bottle b1" />
          <i className="bt-bottle b2" />
          <i className="bt-bottle b3" />
        </span>
        <span className="bt-mixer">
          <i />
        </span>
        <span className="bt-arm" />
        <span className="bt-head" />
        <span className="bt-drain" />

        {/* water + steam */}
        <span className="bt-water">
          <i />
          <i />
        </span>
        <span className="bt-splash" />
        <span className="bt-steam" />

        {/* the wall the alcove is set into */}
        <span className="bt-front" />

        {/* glass enclosure */}
        <span className="bt-enclosure">
          <span className="bt-channel bt-channel-l" />
          <span className="bt-channel bt-channel-r" />

          {type === "fixed" && (
            <>
              <span className="bt-panel bt-fixed">
                <Glass glass={glass} />
              </span>
              <span className="bt-support" />
            </>
          )}

          {type === "hinged" && (
            <>
              <span className="bt-panel bt-fixed bt-half">
                <Glass glass={glass} />
              </span>
              <span
                className="bt-panel bt-door"
                role="button"
                tabIndex={0}
                aria-pressed={open}
                aria-label={open ? "Close the shower door" : "Open the shower door"}
                onClick={onToggleDoor}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggleDoor?.();
                  }
                }}
              >
                <Glass glass={glass}>
                  <i className="bt-hinge h1" />
                  <i className="bt-hinge h2" />
                  <i className="bt-pull" />
                </Glass>
              </span>
            </>
          )}

          {type === "sliding" && (
            <>
              <span className="bt-rail" />
              <span className="bt-panel bt-fixed bt-back-track">
                <Glass glass={glass} />
              </span>
              <span
                className="bt-panel bt-slider"
                role="button"
                tabIndex={0}
                aria-pressed={open}
                aria-label={open ? "Close the sliding door" : "Open the sliding door"}
                onClick={onToggleDoor}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggleDoor?.();
                  }
                }}
              >
                <Glass glass={glass}>
                  <i className="bt-roller r1" />
                  <i className="bt-roller r2" />
                  <i className="bt-pull" />
                </Glass>
              </span>
            </>
          )}
          <span className="bt-threshold" />
        </span>
      </div>
    </div>
  );
}
