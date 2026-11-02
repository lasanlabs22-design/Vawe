"use client";

import { useMemo, useState } from "react";
import Mirror, { LightButton } from "./Mirror";
import { galleryMirrors, shapes, styles } from "@/lib/mirrorGallery";
import { whatsappLink } from "@/lib/site";

export default function MirrorGallery() {
  const [shape, setShape] = useState("all");
  const [style, setStyle] = useState("all");
  const [lit, setLit] = useState<Set<string>>(new Set());

  const items = useMemo(
    () => galleryMirrors.filter((m) => (shape === "all" || m.shape === shape) && (style === "all" || m.style === style)),
    [shape, style],
  );
  const allOn = items.length > 0 && items.every((m) => lit.has(m.code));

  const toggle = (code: string) =>
    setLit((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });

  const toggleAll = () =>
    setLit((prev) => {
      const next = new Set(prev);
      items.forEach((m) => (allOn ? next.delete(m.code) : next.add(m.code)));
      return next;
    });

  return (
    <div className="gal">
      <div className="gal-filters">
        <div className="gal-filter-row" role="group" aria-label="Filter by shape">
          <span className="gal-filter-label">Shape</span>
          {[{ id: "all", label: "All" }, ...shapes].map((s) => (
            <button
              key={s.id}
              type="button"
              className={`gal-chip${shape === s.id ? " is-active" : ""}`}
              aria-pressed={shape === s.id}
              onClick={() => setShape(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="gal-filter-row" role="group" aria-label="Filter by style">
          <span className="gal-filter-label">Style</span>
          {[{ id: "all", label: "All" }, ...styles].map((s) => (
            <button
              key={s.id}
              type="button"
              className={`gal-chip${style === s.id ? " is-active" : ""}`}
              aria-pressed={style === s.id}
              onClick={() => setStyle(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="gal-bar">
          <span className="t-mono">
            Showing {items.length} of {galleryMirrors.length} designs
          </span>
          <div className="gal-bar-dark tone-warm">
            <LightButton on={allOn} onToggle={toggleAll} size="sm" name="all mirrors" />
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="t-lead gal-empty">No designs match those filters yet. Try another shape or style.</p>
      ) : (
        <div className="gal-grid">
          {items.map((m, i) => {
            const on = lit.has(m.code);
            return (
              <article
                key={m.code}
                className="g-card"
                style={{ "--k": Math.min(i, 11) } as React.CSSProperties}
              >
                <div className={`g-stage wall-${m.wall} tone-warm${on ? " is-lit" : ""}`}>
                  <span className="g-code">{m.code}</span>
                  {m.led && <span className="g-led">LED</span>}
                  <Mirror
                    kind={m.kind}
                    shape={m.shape}
                    finish={m.finish}
                    angle={m.angle}
                    reflect={m.reflect}
                    on={on}
                    tone="warm"
                    label={m.name}
                    onToggle={() => toggle(m.code)}
                  />
                </div>
                <div className="g-body">
                  <h3 className="g-name">{m.name}</h3>
                  <p className="g-spec">
                    {m.shapeLabel} · {m.frame}
                  </p>
                  <div className="g-actions">
                    <span className="tone-warm g-pwr">
                      <LightButton on={on} onToggle={() => toggle(m.code)} size="sm" name={m.name} />
                    </span>
                    <a
                      className="link-line"
                      href={whatsappLink(`Hi Vawe, I'm interested in mirror ${m.code} (${m.name}).`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Enquire
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
