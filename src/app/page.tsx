import Image from "next/image";
import Hero from "@/components/Hero";
import Lines from "@/components/Lines";
import ContactForm from "@/components/ContactForm";
import { ArrowUpRight } from "@/components/Icons";
import WorkGrid from "@/components/WorkGrid";
import SeriesExplorer from "@/components/SeriesExplorer";
import { site, whatsappLink } from "@/lib/site";
import { featuredWork } from "@/lib/work";

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

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
      <div id="series"><SeriesExplorer initialSlug="" /></div>

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
        </div>
      </section>

      {/* ─── About ─── */}
      <section className="section" id="about">
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
          </div>
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
