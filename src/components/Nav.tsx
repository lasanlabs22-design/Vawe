"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { collections } from "@/lib/collections";
import { site } from "@/lib/site";
import { getLenis } from "./Motion";

const links = [
  { href: "/#sliding", label: "Sliding Systems" },
  { href: "/#finishes", label: "Finishes" },
  { href: "/#mirrors", label: "Mirrors" },
  { href: "/#studio", label: "Studio" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [open, setOpen] = useState(false);
  const [feature, setFeature] = useState(collections[0]);
  const lastY = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 420 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change.
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
    setMega(false);
  }

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMega(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMega(false), 160);
  };

  const cls = ["nav", scrolled || mega || open ? "is-scrolled" : "", hidden && !mega && !open ? "is-hidden" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={cls} onMouseLeave={closeMega}>
        <div className="container nav-inner">
          <Link href="/" className="brand" aria-label={`${site.name}, home`}>
            <Image className="brand-mark" src="/brand/vawe-mark.png" alt="" width={904} height={796} preload />
            <span className="brand-text">
              <Image className="brand-word" src="/brand/vawe-wordmark-light.png" alt="Vawe" width={2525} height={625} />
              <span className="brand-tag">Interiors</span>
            </span>
          </Link>

          <nav aria-label="Primary">
            <ul className="nav-links">
              <li onMouseEnter={openMega}>
                <button
                  className="nav-link"
                  aria-expanded={mega}
                  aria-controls="mega-menu"
                  onClick={() => setMega((m) => !m)}
                  onFocus={openMega}
                >
                  Collections
                  <svg className="chev" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                    <path d="m1 1 4 4 4-4" stroke="currentColor" />
                  </svg>
                </button>
              </li>
              {links.map((l) => (
                <li key={l.href} onMouseEnter={closeMega}>
                  <Link className="nav-link" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-right">
            <a className="nav-phone" href={site.phoneHref}>
              {site.phone}
            </a>
            <Link href="/#contact" className="btn btn-pink btn-sm nav-cta on-dark-btn">
              Book consultation
            </Link>
            <button
              className="burger"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        {mega && (
          <div className="mega" id="mega-menu" onMouseEnter={openMega}>
            <div className="container mega-grid">
              <ul className="mega-list">
                {collections.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/collections/${c.slug}`}
                      onMouseEnter={() => setFeature(c)}
                      onFocus={() => setFeature(c)}
                      onClick={() => setMega(false)}
                    >
                      <span>{c.index}</span>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mega-feature">
                <Image key={feature.slug} src={feature.image} alt={feature.name} fill sizes="40vw" />
                <div className="tile-grad" />
                <div className="tile-cap">
                  <div className="t-tag" style={{ color: "var(--pink-light)" }}>
                    {feature.tag}
                  </div>
                  <div className="cat-tagline">{feature.tagline}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className={`mobile-panel${open ? " is-open" : ""}`} id="mobile-menu" aria-hidden={!open}>
        <ul className="mobile-links">
          {[{ href: "/#collections", label: "Collections" }, ...links, { href: "/#contact", label: "Contact" }].map(
            (l, i) => (
              <li key={l.href}>
                <Link href={l.href} style={{ "--i": i } as React.CSSProperties} onClick={() => setOpen(false)}>
                  {l.label}
                  <small>0{i + 1}</small>
                </Link>
              </li>
            ),
          )}
        </ul>
        <div className="mobile-sub">
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} onClick={() => setOpen(false)}>
              {c.short}
            </Link>
          ))}
        </div>
        <div className="mobile-foot">
          <Link href="/#contact" className="btn btn-pink on-dark-btn" onClick={() => setOpen(false)}>
            Book a consultation <span className="arrow">→</span>
          </Link>
          <a className="t-mono" href={site.phoneHref}>
            {site.phone}
          </a>
          <span className="t-mono">{site.studio.area}</span>
        </div>
      </div>
    </>
  );
}
