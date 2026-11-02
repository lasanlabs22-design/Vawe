"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

let lenis: Lenis | null = null;

export const getLenis = () => lenis;

const REVEAL = ".reveal, .reveal-lines, .reveal-img";

/**
 * Global motion layer: Lenis smooth scrolling, reveal-on-scroll and
 * scroll-linked parallax. Elements opt in via
 * class names / data attributes, so pages can stay server components.
 */
export default function Motion() {
  const pathname = usePathname();
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Smooth scroll, created once.
  useEffect(() => {
    if (reduced) return;
    lenis = new Lenis({ lerp: 0.09, anchors: { offset: -20 }, autoRaf: true });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, [reduced]);

  // Per-route: reset scroll, observe reveals, wire parallax.
  useEffect(() => {
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    document.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => io.observe(el));

    if (reduced) return () => io.disconnect();

    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of layers) {
        const host = el.parentElement;
        if (!host) continue;
        const r = host.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const speed = parseFloat(el.dataset.parallax || "0.1");
        const offset = (r.top + r.height / 2 - vh / 2) * speed;
        const max = r.height * 0.11;
        el.style.transform = `translate3d(0, ${Math.max(-max, Math.min(max, -offset)).toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname, reduced]);

  return null;
}
