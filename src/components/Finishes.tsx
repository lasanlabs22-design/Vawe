"use client";

import { useRef, useState } from "react";
import { wardrobeFinishes } from "@/lib/collections";

// Hover list with a material sample that trails the cursor (desktop only).
export default function Finishes() {
  const [hover, setHover] = useState<number | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });

  const follow = () => {
    const p = pos.current;
    p.x += (p.tx - p.x) * 0.16;
    p.y += (p.ty - p.y) * 0.16;
    if (floatRef.current) {
      floatRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${(p.tx - p.x) * 0.04}deg)`;
    }
    if (Math.abs(p.tx - p.x) > 0.3 || Math.abs(p.ty - p.y) > 0.3) p.raf = requestAnimationFrame(follow);
    else p.raf = 0;
  };

  const onMove = (e: React.MouseEvent) => {
    const p = pos.current;
    p.tx = e.clientX + 170;
    p.ty = e.clientY;
    if (hover === null) {
      p.x = p.tx;
      p.y = p.ty;
    }
    if (!p.raf) p.raf = requestAnimationFrame(follow);
  };

  return (
    <div className="finishes" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <ul className="finish-list">
        {wardrobeFinishes.map((f, i) => (
          <li
            key={f.name}
            className="finish-row reveal"
            style={{ "--d": i * 80 } as React.CSSProperties}
            onMouseEnter={() => setHover(i)}
          >
            <span className="t-mono">0{i + 1} / {f.note}</span>
            <span className="finish-name">{f.name}</span>
            <p className="t-body">{f.description}</p>
            <span className={`finish-mini swatch sw-${f.swatch}`} aria-hidden="true" />
          </li>
        ))}
      </ul>
      <div ref={floatRef} className={`finish-float${hover !== null ? " is-on" : ""}`} aria-hidden="true">
        {wardrobeFinishes.map((f, i) => (
          <div key={f.name} className={`swatch sw-${f.swatch}${hover === i ? " is-on" : ""}`} />
        ))}
        <span className="finish-float-label">{hover !== null ? wardrobeFinishes[hover].name : ""}</span>
      </div>
    </div>
  );
}
