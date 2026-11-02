"use client";

import { useEffect, useRef, useState } from "react";

// Counts up from zero the first time it scrolls into view. Renders the final value on the server.
export default function Counter({ value, pad = 0 }: { value: number; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let armed = false;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        if (!armed && entry.boundingClientRect.top > window.innerHeight) {
          armed = true;
          setN(0);
        }
        return;
      }
      io.disconnect();
      if (!armed) return;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1800);
        setN(Math.round(value * (1 - Math.pow(1 - t, 4))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref}>{String(n).padStart(pad, "0")}</span>;
}
