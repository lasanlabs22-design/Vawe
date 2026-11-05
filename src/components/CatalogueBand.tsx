import Image from "next/image";
import { catalogue } from "@/lib/series";

/** Catalogue cover with a download button. */
export default function CatalogueBand() {
  return (
    <section className="section-sm dark on-dark" id="catalogue">
      <div className="container catalogue">
        <a className="catalogue-cover reveal-img" href={catalogue.href} target="_blank" rel="noopener noreferrer">
          <Image src={catalogue.cover} alt={`${catalogue.title} cover`} fill sizes="(max-width: 760px) 60vw, 280px" />
        </a>
        <div className="catalogue-body">
          <div className="t-eyebrow reveal">Catalogue</div>
          <h2 className="t-h2 reveal">{catalogue.title}</h2>
          <div className="c-apps reveal">
            {catalogue.ranges.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>
          <div className="catalogue-actions reveal">
            <a className="btn btn-pink on-dark-btn" href={catalogue.href} download={catalogue.fileName}>
              Download PDF <span className="arrow">↓</span>
            </a>
            <a className="btn btn-ghost-light" href={catalogue.href} target="_blank" rel="noopener noreferrer">
              View online
            </a>
            <span className="t-mono">
              {catalogue.pages} pages · {catalogue.size}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
