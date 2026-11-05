"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Work } from "@/lib/work";
import { getLenis } from "./Motion";

/** Full-screen photo viewer with arrows, keyboard and swipe. Never enlarges a photo past its own size. */
export default function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: Work[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const n = photos.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const returnTo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      returnTo?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex((index + 1) % n);
      else if (e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, n, onIndex, onClose]);

  if (index === null) return null;
  const p = photos[index];
  const go = (step: number) => onIndex((index + step + n) % n);

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={`${p.title}, ${p.detail}`} onClick={onClose}>
      <div
        className="lb-stage"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          if (start === null) return;
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 50 && n > 1) go(dx < 0 ? 1 : -1);
        }}
      >
        <Image
          key={p.src}
          className="lb-img"
          src={p.src}
          alt={`${p.title}, ${p.detail}`}
          width={p.width}
          height={p.height}
          sizes="92vw"
          quality={85}
        />
      </div>

      <div className="lb-cap" onClick={(e) => e.stopPropagation()}>
        <b>{p.title}</b>
        <span>{p.detail}</span>
        {n > 1 && (
          <span className="t-mono">
            {index + 1} / {n}
          </span>
        )}
      </div>

      <button ref={closeRef} type="button" className="lb-close" aria-label="Close" onClick={onClose}>
        ×
      </button>
      {n > 1 && (
        <>
          <button
            type="button"
            className="lb-nav lb-prev"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            ←
          </button>
          <button
            type="button"
            className="lb-nav lb-next"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            →
          </button>
        </>
      )}
    </div>
  );
}
