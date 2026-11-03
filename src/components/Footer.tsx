import Image from "next/image";
import Link from "next/link";
import { collections, slidingSystems } from "@/lib/collections";
import { site, whatsappLink } from "@/lib/site";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./Icons";
import FooterSign from "./FooterSign";

export default function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label={`${site.name}, home`}>
              <Image className="brand-mark" src="/brand/vawe-mark.png" alt="" width={904} height={796} />
              <span className="brand-text">
                <Image className="brand-word" src="/brand/vawe-wordmark-light.png" alt="Vawe" width={2525} height={625} />
                <span className="brand-tag">Interiors</span>
              </span>
            </Link>
            <p className="t-body">
              Made-to-measure shutters, sliding systems and mirrors, designed and installed by Vawe Interiors in{" "}
              {site.city}.
            </p>
            <div className="socials">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          <div>
            <h4>Collections</h4>
            <ul>
              {collections.map((c) => (
                <li key={c.slug}>
                  <Link href={`/collections/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Sliding systems</h4>
            <ul>
              {slidingSystems.map((s) => (
                <li key={s.name}>
                  <Link href="/collections/sliding-partitions">{s.name}</Link>
                </li>
              ))}
            </ul>
            <h4 style={{ marginTop: 36 }}>Explore</h4>
            <ul>
              <li>
                <Link href="/gallery/mirrors">Mirror gallery</Link>
              </li>
              <li>
                <Link href="/#finishes">Wardrobe finishes</Link>
              </li>
              <li>
                <Link href="/#process">How we work</Link>
              </li>
              <li>
                <Link href="/#studio">Visit the studio</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li>
                <a href={site.phoneHref}>{site.phone}</a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={site.studio.mapUrl} target="_blank" rel="noopener noreferrer">
                  {site.studio.address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <FooterSign />

        <div className="footer-bottom">
          <span>
            © {site.copyrightYear} {site.name}. All rights reserved.
          </span>
          <p className="powered-by">
            <span>Powered by</span>
            <span className="lasan-signature">Lasan Labs</span>
          </p>
          <nav aria-label="Footer">
            <Link href="/#contact">Get a quote</Link>
            <Link href="/#studio">Studio</Link>
            <a href={site.phoneHref}>Call us</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
