"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { focusGroup, focusKey, type SeriesGroup } from "@/lib/series";
import { setFocusHash, useHash } from "@/lib/focus";
import { whatsappLink } from "@/lib/site";
import type { Work } from "@/lib/work";
import Lightbox from "./Lightbox";
import { getLenis } from "./Motion";

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

/** Does a section's data-focus list match the picked key? Items light up their group's section too. */
const sectionMatches = (keys: string[], focus: string) =>
  keys.some((k) => k === focus || k === focusGroup(focus) || focusGroup(k) === focus);

/**
 * A series page's range chips and photo masonry. The pick from the nav (or a chip) is read from the
 * URL hash: matching chips, photos and interactive sections glow, and everything else steps back.
 */
export default function SeriesWork({ photos, range }: { photos: Work[]; range: SeriesGroup[] }) {
  const hash = useHash();
  const [open, setOpen] = useState<number | null>(null);
  const root = useRef<HTMLElement>(null);

  const labels = useMemo(() => {
    const m = new Map<string, string>();
    for (const g of range) {
      m.set(focusKey(g.title), g.title);
      for (const it of g.items) m.set(focusKey(g.title, it.name), `${g.title} · ${it.name}`);
    }
    return m;
  }, [range]);

  const focus = labels.has(hash) ? hash : null;
  const isMatch = (p: Work) =>
    !!focus && p.tags.some((t) => t === focus || (!focus.includes("--") && focusGroup(t) === focus));
  const count = focus ? photos.filter(isMatch).length : 0;

  // Light up matching interactive sections further down, then bring the selection into view.
  useEffect(() => {
    if (!focus) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-focus]")).filter((el) =>
      sectionMatches(el.dataset.focus!.split(" "), focus),
    );
    // The frame is its own overlay so the section's layered stage can't paint over it.
    for (const el of sections) {
      const frame = document.createElement("span");
      frame.className = "focus-frame";
      const badge = document.createElement("span");
      badge.className = "focus-badge";
      badge.textContent = "Your selection";
      el.append(frame, badge);
    }
    const hasPhoto = !!root.current?.querySelector("[data-match]");
    const target = hasPhoto ? root.current : (sections[0] ?? root.current);
    const t = setTimeout(() => {
      if (!target) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(target, { offset: -96 });
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
    return () => {
      clearTimeout(t);
      for (const el of sections) {
        el.querySelectorAll(":scope > .focus-frame, :scope > .focus-badge").forEach((n) => n.remove());
      }
    };
  }, [focus]);

  const pick = (key: string) => setFocusHash(focus === key ? null : key);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section className="section-sm" id="work" ref={root}>
      <div className="container">
        {range.length > 0 && (
          <div className="range reveal">
            {range.map((g) => {
              const gk = focusKey(g.title);
              return (
                <div className="range-group" key={g.title}>
                  <button
                    type="button"
                    className={`range-head${focus === gk ? " is-active" : focus && focusGroup(focus) === gk ? " is-within" : ""}`}
                    aria-pressed={focus === gk}
                    onClick={() => pick(gk)}
                  >
                    {g.title}
                  </button>
                  {g.items.map((it) => {
                    const key = focusKey(g.title, it.name);
                    return (
                      <button
                        type="button"
                        key={it.name}
                        className={`range-chip${focus === key ? " is-active" : ""}`}
                        aria-pressed={focus === key}
                        onClick={() => pick(key)}
                      >
                        {it.name}
                        {it.note && <small>{it.note}</small>}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {focus && (
          <div className="focus-bar" role="status" key={focus}>
            <span className="focus-dot" aria-hidden="true" />
            <span className="focus-label">Selected</span>
            <b>{labels.get(focus)}</b>
            {count > 0 ? (
              <span className="t-mono">
                {count} photo{count > 1 ? "s" : ""} highlighted
              </span>
            ) : (
              <a
                className="t-mono"
                href={whatsappLink(`Hi Vawe, could you share photos of ${labels.get(focus)}?`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask us for photos →
              </a>
            )}
            <button type="button" className="focus-clear" onClick={() => setFocusHash(null)}>
              Show all ×
            </button>
          </div>
        )}

        {photos.length > 0 && (
          <div
            className={`work-masonry${count ? " has-focus" : ""}`}
            style={{ "--cols": Math.min(4, Math.max(2, Math.ceil(photos.length / 2))) } as React.CSSProperties}
          >
            {photos.map((p, i) => (
              // Match state lives in a data attribute: React rewriting className would drop the
              // "is-in" class the scroll reveal adds, hiding the photo again.
              <figure
                key={p.src}
                className="tile work-item reveal-img"
                data-match={isMatch(p) || undefined}
                style={d((i % 4) * 80)}
              >
                <button type="button" className="work-open" onClick={() => setOpen(i)} aria-label={`View ${p.title} larger`}>
                  <Image
                    src={p.src}
                    alt={`${p.title}, ${p.detail}`}
                    width={p.width}
                    height={p.height}
                    sizes="(max-width: 900px) 50vw, 25vw"
                    quality={85}
                  />
                  <div className="tile-grad" />
                  <div className="work-cap">
                    <b>{p.title}</b>
                    <span>{p.detail}</span>
                  </div>
                </button>
              </figure>
            ))}
          </div>
        )}
      </div>

      <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={close} />
    </section>
  );
}
