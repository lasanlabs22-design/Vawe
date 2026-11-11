"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { setFocusHash } from "@/lib/focus";
import { series } from "@/lib/series";
import { site } from "@/lib/site";
import { getLenis } from "./Motion";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState<number | null>(null);
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
    setMenu(null);
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
        setMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openedAt = useRef(0);
  const openMenu = (i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (menu !== i) openedAt.current = Date.now();
    setMenu(i);
  };
  // A tap fires mouseenter (opening the menu) right before click, so a click that soon after keeps it open.
  const toggleMenu = (i: number) => {
    if (menu === i && Date.now() - openedAt.current > 400) setMenu(null);
    else openMenu(i);
  };
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 160);
  };

  const cls = [
    "nav",
    pathname === "/" || scrolled || menu !== null || open ? "is-scrolled" : "",
    hidden && menu === null && !open ? "is-hidden" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const active = menu === null ? null : series[menu];

  // Series picks carry a focus key in the hash. On the page already showing it, update the pick in
  // place (no navigation) so the page can highlight it straight away.
  const pick = (e: React.MouseEvent, href: string) => {
    setMenu(null);
    setOpen(false);
    const [path, hash] = href.split("#");
    if (path === pathname && hash && hash !== "work") {
      e.preventDefault();
      setFocusHash(hash);
    }
  };

  return (
    <>
      <header className={cls} onMouseLeave={closeMenu}>
        <div className="container nav-inner">
          <Link href="/" className="brand" aria-label={`${site.name}, home`}>
            <Image className="brand-mark" src="/brand/vawe-mark.png" alt="" width={904} height={796} preload />
            <span className="brand-text">
              <Image className="brand-word" src="/brand/vawe-wordmark-light.png" alt="Vawe" width={2525} height={625} />
              <span className="brand-tag">Interio</span>
            </span>
          </Link>

          <nav aria-label="Primary">
            <ul className="nav-links">
              {series.map((s, i) => {
                const current = s.href === pathname || s.groups.some((g) => g.href === pathname);
                return (
                  // The label goes to the series page; hover, focus or the chevron opens its menu.
                  <li key={s.label} className={menu === i ? "is-open" : undefined} onMouseEnter={() => openMenu(i)}>
                    <Link
                      className="nav-link"
                      href={s.href}
                      aria-current={current ? "page" : undefined}
                      onClick={() => setMenu(null)}
                      onFocus={() => openMenu(i)}
                    >
                      {s.label}
                    </Link>
                    <button
                      type="button"
                      className="nav-chev"
                      aria-label={`${s.label} menu`}
                      aria-expanded={menu === i}
                      aria-controls="mega-menu"
                      onClick={() => toggleMenu(i)}
                    >
                      <svg className="chev" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                        <path d="m1 1 4 4 4-4" stroke="currentColor" />
                      </svg>
                    </button>
                  </li>
                );
              })}
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

        {active && (
          <div className="mega" id="mega-menu" onMouseEnter={() => openMenu(menu!)}>
            <div className="container mega-grid">
              <p className="mega-uses">
                <span>Made for</span> {active.uses.join(" · ")}
              </p>
              {active.options && (
                <p className="mega-uses mega-options">
                  <span>{active.options.label}</span>
                  {active.options.items.map((o) => (
                    <Link key={o.name} href={o.href} onClick={(e) => pick(e, o.href)}>
                      {o.name}
                    </Link>
                  ))}
                </p>
              )}
              <ul className="mega-cards">
                {active.cards.map((c) => (
                  <li key={c.name}>
                    <Link className="mega-card" href={c.href} onClick={(e) => pick(e, c.href)}>
                      <span className="mega-card-img">
                        <Image src={c.image} alt="" fill sizes="150px" style={{ objectPosition: c.focus }} />
                      </span>
                      <span className="mega-card-name">{c.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="mega-more" href={active.href} onClick={() => setMenu(null)}>
                View all {active.label} →
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className={`mobile-panel${open ? " is-open" : ""}`} id="mobile-menu" aria-hidden={!open}>
        <ul className="mobile-links">
          {series.map((s, i) => (
            <li key={s.label}>
              <button
                className="mobile-series"
                style={{ "--i": i } as React.CSSProperties}
                aria-expanded={sub === i}
                onClick={() => setSub((v) => (v === i ? null : i))}
              >
                {s.label}
                <small>{sub === i ? "−" : "+"}</small>
              </button>
              {sub === i && (
                <div className="mobile-sub">
                  <p className="mega-uses">
                    <span>Made for</span> {s.uses.join(" · ")}
                  </p>
                  {s.options && (
                    <p className="mega-uses mega-options">
                      <span>{s.options.label}</span>
                      {s.options.items.map((o) => (
                        <Link key={o.name} href={o.href} onClick={(e) => pick(e, o.href)}>
                          {o.name}
                        </Link>
                      ))}
                    </p>
                  )}
                  <div className="mobile-cards" data-lenis-prevent-horizontal>
                    {s.cards.map((c) => (
                      <Link key={c.name} className="mobile-card" href={c.href} onClick={(e) => pick(e, c.href)}>
                        <span className="mega-card-img">
                          <Image src={c.image} alt="" fill sizes="40vw" style={{ objectPosition: c.focus }} />
                        </span>
                        <span className="mega-card-name">{c.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mobile-sub-links">
                    <Link className="mobile-view-all" href={s.href} onClick={() => setOpen(false)}>
                      View all {s.label} →
                    </Link>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="mobile-foot">
          <Link href="/#contact" className="btn btn-pink on-dark-btn" onClick={() => setOpen(false)}>
            Book your consultation <span className="arrow">→</span>
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
