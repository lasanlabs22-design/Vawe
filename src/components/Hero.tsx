"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Lines from "./Lines";

// pos: focal point kept in frame when the photo is cropped (phones, narrow side panels)
type Side = { src: string; pos?: string };
type Slide = {
  src: string;
  caption: string;
  pos?: string;
  // main photo's width / height: on desktop it is shown whole, flanked by two related photos
  ratio: string;
  left: Side;
  right: Side;
};

const slides: Slide[] = [
  // Full-screen slides need photos ~1400 px or more on both sides to stay sharp on desktop and phones.
  {
    src: "/images/work/openable-45-g-handle.jpg",
    caption: "Openable · 45 mm · G handle",
    ratio: "1435 / 1600",
    left: { src: "/images/stock/cabinet-arched-glass.jpg" },
    right: { src: "/images/stock/cabinet-glass-lit.jpg" },
  },
  {
    src: "/images/stock/partition-glass-living.jpg",
    caption: "Telescopic sliding · Living",
    ratio: "2400 / 1728",
    left: { src: "/images/stock/partition-steel-bedroom.jpg", pos: "85% center" },
    right: { src: "/images/stock/partition-glass-marble.jpg", pos: "30% center" },
  },
  {
    src: "/images/stock/wardrobe-glass-lit.jpg",
    caption: "Sliding wardrobe · Glass",
    ratio: "2400 / 1800",
    left: { src: "/images/stock/wardrobe-glass-corridor.jpg", pos: "75% center" },
    right: { src: "/images/stock/wardrobe-walkin-glass.jpg", pos: "40% center" },
  },
  {
    src: "/images/stock/wardrobe-fluted-bedroom.jpg",
    caption: "Sliding wardrobe · Bedroom",
    pos: "85% center",
    ratio: "2400 / 1686",
    left: { src: "/images/stock/wardrobe-glass-bedroom-lit.jpg", pos: "30% center" },
    right: { src: "/images/stock/closet-walkin-lit.jpg", pos: "70% center" },
  },
  {
    src: "/images/hero-led-vanity.jpg",
    caption: "LED mirror · Bath",
    pos: "92% center",
    ratio: "2400 / 1800",
    left: { src: "/images/stock/mirror-led-round-stone.jpg", pos: "45% center" },
    right: { src: "/images/stock/mirror-led-round-dark.jpg" },
  },
];

const DURATION = 6500;

// Side photos display about half the screen wide before the narrow panel crops them.
function HeroSide({ side }: { side: Side }) {
  return (
    <div className="hero-side">
      <Image
        src={side.src}
        alt=""
        fill
        sizes="50vw"
        quality={85}
        style={side.pos ? { objectPosition: side.pos } : undefined}
      />
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);

  const go = useCallback((i: number) => {
    setActive((i + slides.length) % slides.length);
    setCycle((c) => c + 1);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => go(active + 1), DURATION);
    return () => clearTimeout(t);
  }, [active, cycle, go]);

  // Horizontal swipe changes slide; vertical swipes are left to scroll the page.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section className="hero" aria-label="Featured spaces" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {slides.map((s, i) => (
        <div key={s.src} className={`hero-slide${i === active ? " is-active" : ""}`} aria-hidden={i !== active}>
          <div className="hero-trio">
            <HeroSide side={s.left} />
            <div className="hero-trio-main" style={{ aspectRatio: s.ratio }}>
              <Image
                className="hero-photo"
                src={s.src}
                alt=""
                fill
                sizes="100vw"
                preload={i === 0}
                quality={85}
                style={s.pos ? { objectPosition: s.pos } : undefined}
              />
            </div>
            <HeroSide side={s.right} />
          </div>
        </div>
      ))}
      <div className="hero-overlay" />

      <div className="hero-meta">
        <div className="hero-counter hero-fade" style={{ "--d": 500 } as React.CSSProperties}>
          <b>{String(active + 1).padStart(2, "0")}</b>
          <span className="hero-progress">
            <span key={cycle} style={{ animationDuration: `${DURATION}ms` }} />
          </span>
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>
        <div className="hero-caption hero-fade" style={{ "--d": 650 } as React.CSSProperties}>
          {slides[active].caption}
        </div>
      </div>

      <div className="container hero-content">
        <div className="t-eyebrow hero-eyebrow hero-fade">Vawe Interio · Bengaluru</div>
        <Lines
          as="h1"
          onLoad
          className="t-display"
          lines={[
            <>Glass, mirror</>,
            <>
              &amp; shutters, <em>crafted</em>
            </>,
            <>for every room.</>,
          ]}
        />
        <div className="hero-bottom">
          <div className="hero-actions hero-fade" style={{ "--d": 600 } as React.CSSProperties}>
            <Link href="/#series" className="btn btn-ghost-light">
              Explore our series
            </Link>
            <Link href="/#contact" className="btn btn-pink on-dark-btn">
              Book a consultation <span className="arrow">→</span>
            </Link>
          </div>
        </div>
        <div className="hero-dots hero-fade" style={{ marginTop: 36, "--d": 750 } as React.CSSProperties}>
          {slides.map((s, i) => (
            <button
              key={s.src}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === active}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true" />
    </section>
  );
}
