import type { Metadata } from "next";
import Link from "next/link";
import Lines from "@/components/Lines";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply to using the ${site.name} website and ordering our made-to-measure products.`,
};

export default function TermsPage() {
  return (
    <>
      <section className="gal-hero legal-hero dark on-dark">
        <div className="container">
          <nav className="crumbs hero-fade" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <i>/</i>
            <span>Terms &amp; conditions</span>
          </nav>
          <Lines
            as="h1"
            onLoad
            className="t-display"
            lines={[
              <>Terms &amp;</>,
              <>
                <em>conditions.</em>
              </>,
            ]}
          />
          <p className="t-mono hero-fade" style={{ "--d": 300, marginTop: 28 } as React.CSSProperties}>
            Last updated 5 November 2026
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container legal">
          <p className="t-lead">
            These terms apply to your use of this website and to orders placed with {site.name}. By using the site or
            confirming an order, you agree to them. Where your written quotation or invoice says something different, the
            quotation or invoice applies.
          </p>

          <h2>Using this website</h2>
          <p>
            The website is here to show our work and help you get in touch. Please do not misuse it, attempt to disrupt
            it, or copy its content for commercial use.
          </p>
          <p>
            All photographs, designs, text and logos on this site belong to {site.name} or are used with permission. You
            may share links to our pages, but you may not reproduce our content without written consent.
          </p>

          <h2>Product information</h2>
          <p>
            We take care to show our products accurately, but photos and on-screen previews are for illustration. Colours
            and finishes vary between screens, and natural materials such as cane, fabric and veneer vary from piece to
            piece. Please confirm finishes from physical samples at our studio or during the site visit.
          </p>
          <p>Prices, designs and specifications on this website may change without notice.</p>

          <h2>Quotations and orders</h2>
          <ul>
            <li>
              Every product is made to measure. Your quotation is based on our site measurement and the designs and
              finishes you select.
            </li>
            <li>
              A quotation is valid for the period stated on it. An order is confirmed once you approve the final design
              and pay the advance stated in the quotation.
            </li>
            <li>Changes requested after confirmation may affect the price and the delivery date.</li>
            <li>The balance is payable as set out in your quotation or invoice.</li>
          </ul>

          <h2>Cancellations</h2>
          <p>
            Because every piece is cut and built to your measurements, an order cannot be cancelled once fabrication has
            started, and the advance is not refundable from that point. If you cancel before fabrication begins, we will
            refund the advance less any costs already incurred.
          </p>

          <h2>Delivery and installation</h2>
          <ul>
            <li>Delivery and installation dates are estimates, which we will keep you informed about.</li>
            <li>
              Please make sure the site is ready on the agreed date, with clear access, power and finished walls, floors
              and ceilings where the product will be fitted.
            </li>
            <li>
              Delays caused by site readiness, design changes or events outside our control (such as weather, strikes or
              supply shortages) may extend the timeline.
            </li>
            <li>Please inspect the work at handover and tell us about any visible issue at that time.</li>
          </ul>

          <h2>Warranty</h2>
          <p>
            Our products carry the warranty stated on your quotation or invoice. It covers manufacturing and installation
            defects. It does not cover breakage from impact, normal wear, water or moisture damage, misuse, improper
            cleaning, or repairs and modifications made by anyone other than {site.name}.
          </p>
          <p>
            Glass and mirrors are inherently fragile. Toughened glass is designed to resist everyday use but can still
            break under impact or stress.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the extent permitted by law, our total liability for any claim relating to an order is limited to the
            amount you paid for that order. We are not liable for indirect or consequential loss. Nothing in these terms
            limits any right you have under the Consumer Protection Act, 2019.
          </p>

          <h2>Links to other sites</h2>
          <p>
            This site links to services such as WhatsApp, Google Maps, Instagram, Facebook and YouTube. We are not
            responsible for their content or practices. Our{" "}
            <Link href="/privacy">privacy policy</Link> explains how we handle your information.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of India. Any dispute will be subject to the exclusive jurisdiction of
            the courts in {site.city}, Karnataka.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may update these terms from time to time. The version on this page at the time you confirm your order
            applies to that order.
          </p>

          <h2>Contact us</h2>
          <address>
            {site.name}
            <br />
            {site.studio.address}
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={site.phoneHref}>{site.phone}</a>
          </address>
        </div>
      </section>
    </>
  );
}
