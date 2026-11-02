import type { Metadata } from "next";
import Link from "next/link";
import Lines from "@/components/Lines";
import MirrorGallery from "@/components/MirrorGallery";
import { galleryMirrors } from "@/lib/mirrorGallery";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mirror Gallery",
  description: `Browse ${galleryMirrors.length} Vawe mirror designs: gold, ornate, walnut, ivory and onyx frames, LED backlit, frame LED and bevelled mirrors, all made to measure.`,
};

export default function MirrorGalleryPage() {
  return (
    <>
      <section className="gal-hero dark on-dark">
        <div className="container">
          <nav className="crumbs hero-fade" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <i>/</i>
            <Link href="/collections/mirrors">Mirrors</Link>
            <i>/</i>
            <span>Gallery</span>
          </nav>
          <Lines
            as="h1"
            onLoad
            className="t-display"
            lines={[
              <>The mirror</>,
              <>
                <em>gallery.</em>
              </>,
            ]}
          />
          <p className="t-lead hero-fade" style={{ "--d": 300, maxWidth: 620, marginTop: 28 } as React.CSSProperties}>
            {galleryMirrors.length} Vawe designs across six shapes and eight styles. Filter by what suits your room, press
            the light button to see each one glow, and enquire with its code.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <MirrorGallery />
        </div>
      </section>

      <section className="section-sm strip">
        <div className="container cta-band">
          <Lines
            className="t-h2"
            lines={[
              <>Don&apos;t see your shape?</>,
              <>
                We <em>cut to order.</em>
              </>,
            ]}
          />
          <div className="reveal" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/#contact" className="btn btn-pink">
              Book a consultation <span className="arrow">→</span>
            </Link>
            <a
              className="btn"
              href={whatsappLink("Hi Vawe, I'd like a custom mirror.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Send us a sketch
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
