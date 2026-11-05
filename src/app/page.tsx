import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Lines from "@/components/Lines";
import Finishes from "@/components/Finishes";
import ContactForm from "@/components/ContactForm";
import Counter from "@/components/Counter";
import { ArrowUpRight, FinishIcon, MeasureIcon, ProfileIcon } from "@/components/Icons";
import MirrorShowcase from "@/components/MirrorShowcase";
import CatalogueBand from "@/components/CatalogueBand";
import WorkGrid from "@/components/WorkGrid";
import { collections, slidingSystems } from "@/lib/collections";
import { series } from "@/lib/series";
import { site, whatsappLink } from "@/lib/site";
import { featuredWork } from "@/lib/work";

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

const pillars = [
  {
    title: "Precision profiles",
    body: "Aluminium frames in 45 mm, 20 mm and CNC-routed profiles, chosen for the size and weight of every door.",
    Icon: ProfileIcon,
    image: "/images/work/openable-cnc-d-20.jpg",
  },
  {
    title: "Finishes without limits",
    body: "Tinted, lacquered, fabric, cane, mirror or your own artwork printed on glass. The surface is yours to choose.",
    Icon: FinishIcon,
    image: "/images/stock/wardrobe-fluted-bedroom.jpg",
  },
  {
    title: "Measure to handover",
    body: "We measure on site, build to the millimetre and install with our own team, so there's one point of contact from start to finish.",
    Icon: MeasureIcon,
    image: "/images/work/openable-leather-1.jpg",
  },
];

const ticker = [
  "Openable shutters",
  "Sliding wardrobes",
  "Synchro sliding",
  "Telescopic partitions",
  "Bi-fold & slide-fold",
  "LED mirrors",
  "Fabric glass",
  "Bevelled mirrors",
  "Bathroom partitions",
  "Cane & lacquer",
];

const steps = [
  { title: "Consult", body: "Share your space and ideas, at our studio, on a call or over WhatsApp. We'll suggest systems and finishes that suit it." },
  { title: "Measure", body: "Our team measures on site and confirms every detail, from profile and finish to hardware, before production." },
  { title: "Craft", body: "Each shutter, partition and mirror is cut and assembled to your exact dimensions." },
  { title: "Install", body: "We install, align and finish everything, then hand over a clean, ready-to-use space." },
];


export default function Home() {
  return (
    <>
      <Hero />

      {/* ─── Client installs ─── */}
      <section className="section" id="work">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="t-eyebrow reveal">Our installs</div>
              <Lines
                className="t-h2"
                lines={[
                  <>Real homes.</>,
                  <>
                    <em>Real</em> Vawe.
                  </>,
                ]}
              />
            </div>
          </div>
          <WorkGrid items={featuredWork} />
          <div className="work-foot reveal">
            {series.map((s) => (
              <Link key={s.label} href={`${s.href}#work`} className="btn">
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Value ─── */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="t-eyebrow reveal">The Vawe standard</div>
              <Lines
                className="t-h2"
                lines={[
                  <>Made to measure.</>,
                  <>
                    <em>Fitted</em> to the millimetre.
                  </>,
                ]}
              />
            </div>
            <p className="t-lead reveal" style={d(150)}>
              Every opening in a home is different. We don&apos;t sell off-the-shelf panels. We design, build and
              install systems for the exact space you have.
            </p>
          </div>

          <div className="pillars">
            {pillars.map(({ title, body, Icon, image }, i) => (
              <article className="pillar reveal" key={title} style={d(i * 120)}>
                <div className="pillar-img">
                  <Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" quality={85} />
                </div>
                <span className="pillar-num">0{i + 1}</span>
                <h3 className="t-h3">{title}</h3>
                <p className="t-body">{body}</p>
                <Icon className="pillar-icon" />
              </article>
            ))}
          </div>

          <div className="value-actions reveal">
            <Link href="/#contact" className="btn btn-pink">
              Get a quote <span className="arrow">→</span>
            </Link>
            <Link href="/#process" className="btn">
              How it works
            </Link>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((g) => (
            <div className="marquee-group" key={g}>
              {ticker.map((t) => (
                <span key={t + g} style={{ display: "contents" }}>
                  <span>{t}</span>
                  <i>✦</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Editorial ─── */}
      <section className="section">
        <div className="container edit-grid">
          <div className="edit-media reveal-img">
            <div className="parallax" data-parallax="0.12" suppressHydrationWarning>
              <Image src="/images/stock/partition-steel-door.jpg" alt="A steel-framed glass door beside a fluted timber wall" fill sizes="(max-width: 900px) 100vw, 58vw" quality={85} />
            </div>
            <div className="edit-media-badge">
              <Image src="/brand/vawe-mark.png" alt="" width={904} height={796} />
              <span>Designed &amp; installed in {site.city}</span>
            </div>
          </div>
          <div className="edit-copy">
            <div className="t-eyebrow reveal">About Vawe</div>
            <Lines
              className="t-h2"
              lines={[
                <>Quiet luxury,</>,
                <>
                  <em>engineered.</em>
                </>,
              ]}
            />
            <p className="t-lead reveal">
              Vawe Interio brings architectural glass, mirror and aluminium systems into everyday homes, so
              wardrobes, kitchens, bathrooms and living spaces feel calm, bright and considered.
            </p>
            <p className="t-body reveal" style={d(100)}>
              From our studio and workshop in {site.studio.area}, we design and install openable and sliding
              shutters, sliding partitions, LED and bevelled mirrors, fabric glass and shower partitions, each one
              built for the room it lives in.
            </p>
            <div className="stats">
              {[
                { n: 45, u: "mm", l: "Regular profile" },
                { n: 20, u: "mm", l: "Slim profile" },
                { n: 4, u: "", l: "Sliding systems", pad: 2 },
                { n: 7, u: "", l: "Series", pad: 2 },
              ].map((s, i) => (
                <div className="stat reveal" key={s.l} style={d(i * 100)}>
                  <div className="stat-num">
                    <Counter value={s.n} pad={s.pad} />
                    {s.u && <small>{s.u}</small>}
                  </div>
                  <div className="stat-label">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Collections ─── */}
      <section className="section strip" id="series">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="t-eyebrow reveal">Seven series</div>
              <Lines
                className="t-h2"
                lines={[
                  <>One studio.</>,
                  <>
                    <em>Every</em> surface.
                  </>,
                ]}
              />
            </div>
            <p className="t-lead reveal" style={d(150)}>
              From the wardrobe door to the shower screen, explore the series our clients ask for most.
            </p>
          </div>

          <div className="cat-grid">
            {collections.map((c, i) => (
              <Link
                href={`/series/${c.slug}`}
                className="tile reveal-img"
                key={c.slug}
                style={d((i % 4) * 90)}
                aria-label={`${c.name}: ${c.tagline}`}
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes={i === 0 ? "(max-width: 980px) 100vw, 50vw" : "(max-width: 560px) 100vw, (max-width: 980px) 50vw, 25vw"}
                />
                <div className="tile-grad" />
                <span className="cat-num">{c.index}</span>
                <span className="cat-arrow">
                  <ArrowUpRight />
                </span>
                <div className="tile-cap">
                  <div className="t-tag" style={{ color: "var(--pink-light)" }}>
                    {c.tag}
                  </div>
                  <h3 className="cat-title">{c.name}</h3>
                  <p className="cat-tagline">{c.tagline}</p>
                  <div className="cat-chips">
                    {c.variants.slice(0, 5).map((v) => (
                      <span className="chip" key={v.name}>
                        {v.note}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sliding systems ─── */}
      <section className="section dark on-dark" id="sliding">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="t-eyebrow reveal">Sliding partitions</div>
              <Lines
                className="t-h2"
                lines={[
                  <>Four ways</>,
                  <>
                    to <em>open</em> a room.
                  </>,
                ]}
              />
            </div>
            <p className="t-lead reveal" style={d(150)}>
              Glass partitions that divide a space when you need privacy and fold, stack or glide away when you
              don&apos;t. Pick the mechanism that suits your opening.
            </p>
          </div>

          <div className="systems">
            {slidingSystems.map((s, i) => (
              <Link href="/series/sliding-partitions" className="system reveal" key={s.name} style={d(i * 110)}>
                <div className="tile">
                  <Image src={s.image!} alt={`${s.name} glass partition`} fill sizes="(max-width: 560px) 80vw, (max-width: 1100px) 50vw, 25vw" />
                  <div className="tile-grad" />
                  <span className="cat-num">0{i + 1}</span>
                </div>
                <div className="system-body">
                  <div className="system-top">
                    <h3 className="t-h3">{s.name}</h3>
                    <span className="t-mono">{s.note}</span>
                  </div>
                  <p className="t-body">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="systems-foot reveal">
            <p className="t-body" style={{ maxWidth: 520 }}>
              Not sure which system fits? Send us a photo of the opening and we&apos;ll recommend one.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/series/sliding-partitions" className="btn btn-ghost-light">
                Explore partitions
              </Link>
              <a href={whatsappLink("Hi Vawe, I'd like help choosing a sliding partition system.")} className="btn btn-pink" target="_blank" rel="noopener noreferrer">
                Ask on WhatsApp <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Finishes ─── */}
      <section className="section" id="finishes">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="t-eyebrow reveal">Sliding wardrobe shutters</div>
              <Lines
                className="t-h2"
                lines={[
                  <>Five finishes.</>,
                  <>
                    <em>Endless</em> moods.
                  </>,
                ]}
              />
            </div>
            <p className="t-lead reveal" style={d(150)}>
              The face of a wardrobe sets the tone of a bedroom. <span className="only-hover">Hover</span>
              <span className="only-touch">Tap</span> to preview each finish, or{" "}
              <Link href="/series/sliding-wardrobe-shutters" className="link-line" style={{ fontSize: 11 }}>
                see the collection
              </Link>
            </p>
          </div>
          <Finishes />
        </div>
      </section>

      {/* ─── Mirrors spotlight ─── */}
      <MirrorShowcase />

      <CatalogueBand />

      {/* ─── Quote ─── */}
      <section className="quote">
        <div className="quote-bg">
          <div className="parallax" data-parallax="0.18" suppressHydrationWarning>
            <Image src="/images/hero-bedroom.jpg" alt="" fill sizes="100vw" />
          </div>
        </div>
        <div className="quote-inner">
          <Image className="quote-mark reveal" src="/brand/vawe-mark.png" alt="" width={904} height={796} />
          <Lines
            as="blockquote"
            lines={[
              <>We don&apos;t just fit glass.</>,
              <>
                We shape how a room <em>opens,</em>
              </>,
              <>
                <em>reflects</em> and breathes.
              </>,
            ]}
          />
          <cite className="reveal" style={d(300)}>
            Vawe Interio · Studio philosophy
          </cite>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="section" id="process">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="t-eyebrow reveal">How we work</div>
              <Lines
                className="t-h2"
                lines={[
                  <>From first sketch</>,
                  <>
                    to <em>handover.</em>
                  </>,
                ]}
              />
            </div>
            <p className="t-lead reveal" style={d(150)}>
              One team from start to finish: four clear steps, with no surprises in between.
            </p>
          </div>
          <div className="process">
            {steps.map((s, i) => (
              <div className="step reveal" key={s.title} style={d(i * 140)}>
                <span className="step-dot">0{i + 1}</span>
                <h3 className="t-h3">{s.title}</h3>
                <p className="t-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="hairline" />

      {/* ─── Studio ─── */}
      <section className="section" id="studio">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="t-eyebrow reveal">Visit us</div>
              <Lines
                className="t-h2"
                lines={[
                  <>See it, touch it,</>,
                  <>
                    <em>before</em> you choose.
                  </>,
                ]}
              />
            </div>
            <p className="t-lead reveal" style={d(150)}>
              Samples look different in your hand than on a screen. Visit our studio and workshop to see the
              profiles, finishes and mirrors in person.
            </p>
          </div>
          <div className="visit-grid">
            <article className="visit-card reveal">
              <div className="tile">
                <Image src="/images/studio-interior.jpg" alt="Vawe studio interior" fill sizes="(max-width: 760px) 100vw, 50vw" />
              </div>
              <div className="visit-body">
                <span className="t-tag">Studio &amp; Workshop</span>
                <h3 className="t-h3">{site.studio.area}</h3>
                <p className="t-body">{site.studio.address}</p>
                <span className="t-mono">{site.studio.hours}</span>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: "auto" }}>
                  <a className="link-line" href={site.studio.mapUrl} target="_blank" rel="noopener noreferrer">
                    Get directions <ArrowUpRight />
                  </a>
                  <a className="link-line" href={site.phoneHref}>
                    Call to visit
                  </a>
                </div>
              </div>
            </article>
            <div className="map-card reveal" style={d(120)}>
              <iframe
                title={`Map to ${site.studio.name}`}
                src={site.studio.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a className="map-pin" href={site.studio.mapUrl} target="_blank" rel="noopener noreferrer">
                <Image src="/brand/vawe-mark.png" alt="" width={904} height={796} />
                <span>
                  <b>{site.name}</b>
                  <small>Open in Google Maps</small>
                </span>
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section className="section dark on-dark" id="contact">
        <div className="container contact-grid">
          <div className="contact-aside">
            <div className="t-eyebrow reveal">Book a consultation</div>
            <Lines
              className="t-h2"
              lines={[
                <>Tell us about</>,
                <>
                  your <em>space.</em>
                </>,
              ]}
            />
            <p className="t-lead reveal">
              Share a few details and a designer from our team will call you to plan measurements, finishes and a
              quote.
            </p>
            <div className="contact-direct reveal">
              <a href={site.phoneHref}>
                <span>Call</span>
                <span>{site.phone}</span>
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <span>WhatsApp</span>
                <span>Chat with us</span>
              </a>
              <a href={`mailto:${site.email}`}>
                <span>Email</span>
                <span>{site.email}</span>
              </a>
            </div>
          </div>
          <div className="reveal" style={d(150)}>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
