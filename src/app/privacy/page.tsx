import type { Metadata } from "next";
import Link from "next/link";
import Lines from "@/components/Lines";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects the personal information you share with us.`,
};

export default function PrivacyPage() {
  return (
    <>
      <section className="gal-hero legal-hero dark on-dark">
        <div className="container">
          <nav className="crumbs hero-fade" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <i>/</i>
            <span>Privacy policy</span>
          </nav>
          <Lines
            as="h1"
            onLoad
            className="t-display"
            lines={[
              <>Privacy</>,
              <>
                <em>policy.</em>
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
            {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) designs and installs made-to-measure shutters, sliding
            systems, partitions and mirrors in {site.city}. This policy explains what personal information we collect
            through this website and our projects, why we collect it, and the choices you have. It is written in line with
            India&apos;s Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.
          </p>

          <h2>What we collect</h2>
          <p>We only collect what we need to answer your enquiry and deliver your project:</p>
          <ul>
            <li>
              <strong>Enquiry details.</strong> When you use our enquiry form, call, WhatsApp or email us, we receive your
              name, phone number, location, the product you are interested in and anything you tell us about your
              project, including reference photos.
            </li>
            <li>
              <strong>Project details.</strong> If you go ahead with a project, we also record your site address,
              measurements, photos of the space, your chosen designs and finishes, and billing details such as your GSTIN
              where applicable.
            </li>
            <li>
              <strong>Technical data.</strong> Our hosting provider automatically logs basic request data (such as IP
              address, browser type and pages requested) to keep the site secure and running.
            </li>
          </ul>

          <h2>Cookies and tracking</h2>
          <p>
            We do not use analytics, advertising or tracking cookies. The site stores a single flag in your browser&apos;s
            session storage so the opening animation plays only once per visit. It holds no personal information and is
            cleared when you close the tab.
          </p>
          <p>
            Our home page shows an embedded Google Map of our studio. Google may set its own cookies when the map loads,
            under{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google&apos;s privacy policy
            </a>
            .
          </p>

          <h2>How we use your information</h2>
          <ul>
            <li>To reply to your enquiry, prepare quotations and arrange site visits.</li>
            <li>To measure, fabricate, deliver and install your order.</li>
            <li>To provide after-sales service and honour any warranty.</li>
            <li>To keep invoices and records required by tax and other laws.</li>
          </ul>
          <p>
            We do not sell or rent your personal information, and we do not send marketing messages unless you ask us to.
          </p>

          <h2>WhatsApp and other services</h2>
          <p>
            Our enquiry form does not store anything on our servers. It composes a message that opens in WhatsApp, and you
            choose whether to send it. Messages sent over WhatsApp are handled by WhatsApp under{" "}
            <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              its own privacy policy
            </a>
            . The same applies when you follow our links to Instagram, Facebook or YouTube.
          </p>

          <h2>Who we share it with</h2>
          <p>We share your information only where it is needed to do the work, or where the law requires it:</p>
          <ul>
            <li>Our installation team and trusted fabrication partners, limited to what they need for your order.</li>
            <li>Our accountants and payment providers, for billing and tax compliance.</li>
            <li>Government or law enforcement authorities, when we are legally required to.</li>
          </ul>

          <h2>How long we keep it</h2>
          <p>
            We keep enquiry details for as long as the conversation is active. For customers, we keep project records for
            the length of any warranty and after-sales period, and invoices for as long as Indian tax law requires. After
            that we delete or anonymise them.
          </p>

          <h2>Keeping it safe</h2>
          <p>
            Access to customer information is limited to the people who need it. No method of storage or transmission is
            completely secure, but we take reasonable steps to protect your data from loss, misuse and unauthorised
            access.
          </p>

          <h2>Your rights</h2>
          <p>You can ask us at any time to:</p>
          <ul>
            <li>tell you what personal information we hold about you;</li>
            <li>correct or update it;</li>
            <li>delete it, unless we must keep it by law;</li>
            <li>withdraw consent you have given us.</li>
          </ul>
          <p>
            Email <a href={`mailto:${site.email}`}>{site.email}</a> or call <a href={site.phoneHref}>{site.phone}</a>.
            We aim to respond within 30 days. If you are not satisfied with our response, you may complain to the Data
            Protection Board of India.
          </p>

          <h2>Children</h2>
          <p>
            This website is meant for adults planning work on their homes or businesses. We do not knowingly collect
            information from anyone under 18.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The date at the top of this page shows when it last changed.
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
