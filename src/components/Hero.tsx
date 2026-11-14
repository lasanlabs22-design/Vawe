"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLenis } from "./Motion";

type Slide = { src: string; series: string; caption: string; href: string; alt: string };

const slides: Slide[] = [
  { src: "/images/home/premium-openable.webp", series: "Openable Shutters", caption: "A finer frame for everyday living.", href: "/series/openable-shutters", alt: "Bronze-framed glass cabinetry with an open hinged door and illuminated walnut shelves" },
  { src: "/images/home/premium-sliding.webp", series: "Sliding Wardrobes", caption: "Space, beautifully composed.", href: "/series/sliding-wardrobe-shutters", alt: "Tinted glass sliding wardrobe panels revealing a warmly lit walnut dressing room" },
  { src: "/images/home/premium-partition.webp", series: "Glass Partitions", caption: "Connected spaces. Quiet boundaries.", href: "/series/sliding-partitions", alt: "Slim bronze-framed glass partition between a cream living room and dining room" },
  { src: "/images/home/premium-mirror.webp", series: "LED Mirrors", caption: "A softer light. A daily ritual.", href: "/series/mirrors", alt: "Illuminated pill-shaped mirror above a walnut and travertine bathroom vanity" },
  { src: "/images/home/premium-bathroom.webp", series: "Shower Partitions", caption: "Your own moment of calm.", href: "/series/bathroom-partitions", alt: "Clear glass shower enclosure with bronze hardware in a warm travertine bathroom" },
];

const DURATION = 6500;
// Share of the pinned scroll spent sliding the doors; the rest holds the open room in view.
const OPEN_SPAN = 0.7;

/**
 * The home landing: the room is first seen through two closed fluted-glass sliding doors. Scrolling
 * (or "Step inside") slides them apart, and the five segment photos keep rotating behind the glass.
 */
export default function Hero() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // Door position follows the scroll. Written straight to a CSS variable, so scrolling never re-renders.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const travel = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / (travel * OPEN_SPAN)));
      const eased = p * p * (3 - 2 * p);
      el.style.setProperty("--open", eased.toFixed(4));
      setOpen(eased > 0.6);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const stepInside = () => {
    const el = root.current;
    if (!el) return;
    const target = el.offsetTop + (el.offsetHeight - window.innerHeight) * OPEN_SPAN;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else window.scrollTo({ top: target, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const go = useCallback((i: number) => {
    setActive((i + slides.length) % slides.length);
    setCycle((c) => c + 1);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const t = setTimeout(() => go(active + 1), DURATION);
    return () => clearTimeout(t);
  }, [active, cycle, go, paused, reducedMotion]);

  // Horizontal swipe changes slide; vertical swipes are left to scroll the page.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start || !open) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(active + (dx < 0 ? 1 : -1));
  };

  const slide = slides[active];

  return (
    <section ref={root} className={`hero hero-doors${open ? " is-open" : ""}`} aria-label="Featured spaces" aria-roledescription="carousel">
      <div className="hero-sticky" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onFocusCapture={(e) => { if (!(e.target as HTMLElement).closest(".hero-play, .hero-step")) setPaused(true); }}>
        <div className="hero-stage">
          {slides.map((s, i) => (
            <div key={s.src} className={`hero-slide${i === active ? " is-active" : ""}`} aria-hidden={i !== active}>
              <Image className="hero-photo" src={s.src} alt={s.alt} fill sizes="100vw" preload={i === 0} quality={85} />
            </div>
          ))}
          <div className="hero-shade" aria-hidden="true" />

          {/* Two fluted-glass sliding doors in slim bronze frames, meeting at the centre. */}
          <div className="hero-door hero-door-l" aria-hidden="true"><span className="hero-door-handle" /></div>
          <div className="hero-door hero-door-r" aria-hidden="true"><span className="hero-door-handle" /></div>

          <div className="hero-intro" aria-hidden={open}>
            <div className="hero-kicker">Vawe Interio · Bengaluru</div>
            <h1>
              <em>Beyond</em> the ordinary.{" "}
              <span className="hero-intro-sub">Glass shutters, partition shutters, sliding shutters, glass and mirrors, crafted for every room.</span>
            </h1>
            <button type="button" className="hero-step" onClick={stepInside} tabIndex={open ? -1 : 0}>
              Step inside <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>

        <div className="container hero-content" aria-hidden={!open}>
          <div className="hero-heading-row">
            <div className="hero-caption" key={active} aria-live={paused || reducedMotion ? "polite" : "off"}>
              <div className="hero-kicker">Made to measure · Vawe Interio</div>
              <h2>{slide.series}</h2>
              <p>{slide.caption}</p>
              <Link className="hero-series-link" href={slide.href} tabIndex={open ? 0 : -1}>Explore series <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="hero-controls">
              <span className="hero-count">0{active + 1} / 05</span>
              <button type="button" aria-label="Previous image" tabIndex={open ? 0 : -1} onClick={() => go(active - 1)}>←</button>
              {!reducedMotion && <button className="hero-play" type="button" aria-label={paused ? "Play slideshow" : "Pause slideshow"} tabIndex={open ? 0 : -1} onClick={() => { setPaused(p => !p); setCycle(c => c + 1); }}>{paused ? "▷" : "Ⅱ"}</button>}
              <button type="button" aria-label="Next image" tabIndex={open ? 0 : -1} onClick={() => go(active + 1)}>→</button>
            </div>
          </div>
          <div className="hero-tabs">
            {slides.map((s, i) => (
              <button key={s.src} type="button" aria-label={`Show ${s.series}`} aria-current={i === active} tabIndex={open ? 0 : -1} onClick={() => go(i)}>
                <span className="hero-tab-bar">
                  {i === active && <span key={cycle} style={{ animationDuration: `${DURATION}ms`, animationPlayState: paused ? "paused" : "running", display: reducedMotion ? "none" : undefined }} />}
                </span>
                <span className="hero-tab-num">0{i + 1}</span>
                <span className="hero-tab-name">{s.series}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
