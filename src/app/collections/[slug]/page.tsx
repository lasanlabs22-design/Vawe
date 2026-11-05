import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Lines from "@/components/Lines";
import { ArrowUpRight } from "@/components/Icons";
import FabricSections from "@/components/FabricSections";
import FabricStudio from "@/components/FabricStudio";
import MirrorCard from "@/components/MirrorCard";
import MirrorSections from "@/components/MirrorSections";
import PartitionSections from "@/components/PartitionSections";
import PartitionStudio from "@/components/PartitionStudio";
import ShowerSections from "@/components/ShowerSections";
import ShowerStudio from "@/components/ShowerStudio";
import ShutterProfiles from "@/components/ShutterProfiles";
import ShutterStudio from "@/components/ShutterStudio";
import SlidingFinishes from "@/components/SlidingFinishes";
import SlidingStudio from "@/components/SlidingStudio";
import { collections, getCollection } from "@/lib/collections";
import { whatsappLink } from "@/lib/site";

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

// Every collection is prerendered above, and the whole page depends on the slug, so a navigation can
// wait for the finished page rather than flash a Suspense placeholder over all of it.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return {};
  return {
    title: c.name,
    description: `${c.intro} ${c.variants.map((v) => v.name).join(", ")}.`,
    openGraph: { images: [c.image] },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();

  const others = collections.filter((o) => o.slug !== c.slug);
  const [titleA, ...titleRest] = c.name.split(" ");

  return (
    <>
      <section className="c-hero">
        <div className="c-hero-bg">
          <div className="parallax" data-parallax="0.15" suppressHydrationWarning>
            <Image src={c.image} alt="" fill sizes="100vw" preload quality={85} />
          </div>
        </div>
        <div className="container">
          <nav className="crumbs hero-fade" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <i>/</i>
            <Link href="/#collections">Collections</Link>
            <i>/</i>
            <span>{c.index}</span>
          </nav>
          <Lines
            as="h1"
            onLoad
            className="t-display"
            lines={titleRest.length ? [<>{titleA}</>, <>{titleRest.join(" ")}</>] : [<>{titleA}</>]}
          />
          <p className="c-hero-tagline hero-fade" style={d(200)}>
            {c.tagline}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container c-intro">
          <div>
            <div className="t-eyebrow reveal" style={{ marginBottom: 26 }}>
              {c.index} · {c.tag}
            </div>
            <h2 className="t-h2 reveal">{c.intro}</h2>
          </div>
          <div>
            <p className="t-lead reveal" style={d(120)}>
              {c.body}
            </p>
            <div className="c-apps reveal" style={d(220)}>
              {c.applications.map((a) => (
                <span key={a}>{a}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {c.slug === "fabric-glass" ? (
        <>
          <FabricStudio />
          <FabricSections />
        </>
      ) : c.slug === "bathroom-partitions" ? (
        <>
          <ShowerStudio />
          <ShowerSections />
        </>
      ) : c.slug === "sliding-partitions" ? (
        <>
          <PartitionStudio />
          <PartitionSections />
        </>
      ) : c.slug === "sliding-wardrobe-shutters" ? (
        <>
          <SlidingStudio />
          <SlidingFinishes />
        </>
      ) : c.slug === "openable-shutters" ? (
        <>
          <ShutterStudio />
          <ShutterProfiles />
        </>
      ) : c.slug === "mirrors" ? (
        <>
          <section className="section-sm dark on-dark ms-intro">
            <div className="container section-head" style={{ marginBottom: 0 }}>
              <div>
                <div className="t-eyebrow reveal">Signature designs</div>
                <Lines
                  className="t-h2"
                  lines={[
                    <>Four mirrors.</>,
                    <>
                      <em>Switch</em> them on.
                    </>,
                  ]}
                />
              </div>
              <p className="t-lead reveal" style={d(150)}>
                Plain, LED and frame-LED mirrors, each with its own character. Press the light button in any section
                to see how it glows, and pick a warm, neutral or cool tone.
              </p>
            </div>
          </section>
          <MirrorSections />
          <section className="section-sm dark on-dark">
            <div className="container cta-band">
              <Lines
                className="t-h2"
                lines={[
                  <>48 designs.</>,
                  <>
                    One <em>gallery.</em>
                  </>,
                ]}
              />
              <Link href="/gallery/mirrors" className="btn btn-pink reveal">
                Browse the mirror gallery <span className="arrow">→</span>
              </Link>
            </div>
          </section>
        </>
      ) : (
      <section className="section dark on-dark">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="t-eyebrow reveal">The range</div>
              <Lines className="t-h2" lines={[<>{c.variantsTitle}</>]} />
            </div>
            <p className="t-lead reveal" style={d(150)}>
              {c.variants.some((v) => v.mirror)
                ? "Press the light button under any mirror to see it glow. Every piece is cut and finished to your size."
                : "Every option is made to measure. Mix and match within a project, and we'll help you choose on site."}
            </p>
          </div>
          <div className="variants">
            {c.variants.map((v, i) => (
              <article className="variant reveal" key={v.name} style={d(i * 100)}>
                {v.image && (
                  <div className="variant-img">
                    <Image src={v.image} alt={v.name} fill sizes="(max-width: 760px) 100vw, 25vw" />
                  </div>
                )}
                {v.mirror && <MirrorCard kind={v.mirror.kind} shape={v.mirror.shape} label={v.name} />}
                <div className="variant-top">
                  <span className="t-mono">0{i + 1}</span>
                  {v.swatch && <span className={`swatch sw-${v.swatch}`} aria-hidden="true" />}
                </div>
                <span className="variant-note">{v.note}</span>
                <h3 className="t-h3">{v.name}</h3>
                <p className="t-body">{v.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      <section className="section">
        <div className="container">
          <div className="gallery">
            <div className="tile reveal-img">
              <div className="parallax" data-parallax="0.08" suppressHydrationWarning>
                <Image src={c.gallery[0]} alt={`${c.name} in a finished interior`} fill sizes="(max-width: 760px) 100vw, 58vw" />
              </div>
            </div>
            <div className="tile reveal-img" style={d(150)}>
              <div className="parallax" data-parallax="0.14" suppressHydrationWarning>
                <Image src={c.gallery[1]} alt={`${c.name} detail`} fill sizes="(max-width: 760px) 100vw, 42vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm strip">
        <div className="container cta-band">
          <Lines
            className="t-h2"
            lines={[
              <>Planning {c.name.toLowerCase()}?</>,
              <>
                Let&apos;s <em>measure</em> your space.
              </>,
            ]}
          />
          <div className="reveal" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/#contact" className="btn btn-pink">
              Book a consultation <span className="arrow">→</span>
            </Link>
            <a
              className="btn"
              href={whatsappLink(`Hi Vawe, I'm interested in ${c.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head" style={{ alignItems: "center" }}>
            <div>
              <div className="t-eyebrow reveal">Keep exploring</div>
              <Lines
                className="t-h2"
                lines={[
                  <>
                    More <em>collections.</em>
                  </>,
                ]}
              />
            </div>
          </div>
          <div className="rail" data-lenis-prevent-horizontal>
            {others.map((o) => (
              <Link href={`/collections/${o.slug}`} className="tile" key={o.slug} aria-label={o.name}>
                <Image src={o.image} alt="" fill sizes="(max-width: 560px) 80vw, 25vw" />
                <div className="tile-grad" />
                <span className="cat-num">{o.index}</span>
                <span className="cat-arrow">
                  <ArrowUpRight />
                </span>
                <div className="tile-cap">
                  <h3 className="cat-title">{o.name}</h3>
                  <p className="cat-tagline">{o.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
