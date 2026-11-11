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

    const pending = new Set(document.querySelectorAll<HTMLElement>(REVEAL));
    const show = (el: Element) => {
      // Animate presentation without mutating React-owned class attributes before
      // streamed client components hydrate (which caused hydration mismatches).
      const timing: KeyframeAnimationOptions = { duration: reduced ? 0 : 900, fill: "both", easing: "cubic-bezier(.22,.68,.18,1)" };
      if (el.matches(".reveal")) el.animate([{ opacity: 0, transform: "translateY(28px)" }, { opacity: 1, transform: "none" }], timing);
      if (el.matches(".reveal-img")) {
        el.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], timing);
        el.querySelectorAll("img").forEach(img => img.animate([{ transform: "scale(1.18)" }, { transform: "scale(1)" }], timing));
      }
      if (el.matches(".reveal-lines")) el.querySelectorAll(".line > span").forEach((line, i) => line.animate([{ transform: "translateY(110%)" }, { transform: "none" }], { ...timing, delay: reduced ? 0 : i * 110 }));
      // These restyle their children once in view (the footer sign's power-on, studio slide-ins), so they
      // still need the class. They sit well below the fold, so they are only reached after hydration.
      if (el.matches(".sign, .ms-anim, .pcut")) el.classList.add("is-in");
      io.unobserve(el);
      pending.delete(el as HTMLElement);
    };
    const io = new IntersectionObserver(
      (entries) => {
        let hit = false;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          hit = true;
        }
        // Chrome counts a reveal-img's own clip-path, so one cut by the top of the viewport
        // (after an anchor jump, or scrolling back up) never intersects. Sweep those in too.
        if (!hit) return;
        const fold = window.innerHeight;
        for (const el of pending) if (el.getBoundingClientRect().top < fold) show(el);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    pending.forEach((el) => io.observe(el));

    if (reduced) return () => io.disconnect();

    // This can run before React has hydrated the page under the layout, so every [data-parallax]
    // element carries suppressHydrationWarning for the transform written here.
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
