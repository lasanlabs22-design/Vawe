"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Lines from "./Lines";

const slides = [
  { src: "/images/hero-glass-pavilion.jpg", caption: "Telescopic sliding · Living" },
  { src: "/images/hero-bedroom.jpg", caption: "Sliding wardrobe · Bedroom" },
  { src: "/images/hero-kitchen-glass.jpg", caption: "Openable shutters · Kitchen" },
  { src: "/images/hero-led-vanity.jpg", caption: "LED mirror · Bath" },
];

const DURATION = 6500;

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
          <Image src={s.src} alt="" fill sizes="100vw" preload={i === 0} quality={85} />
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
          <p className="hero-lead hero-fade" style={{ "--d": 450 } as React.CSSProperties}>
            Openable and sliding shutters, sliding partitions, LED and bevelled mirrors, bathroom partitions and
            fabric glass, all made to measure and installed by our own team.
          </p>
          <div className="hero-actions hero-fade" style={{ "--d": 600 } as React.CSSProperties}>
            <Link href="/#collections" className="btn btn-ghost-light">
              Explore collections
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
