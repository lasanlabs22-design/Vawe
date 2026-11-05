import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/lib/work";

const d = (ms: number) => ({ "--d": ms }) as React.CSSProperties;

/** Home page mosaic of install photos (`tall` marks two-row photos), each linking to its series. */
export default function WorkGrid({ items }: { items: (Work & { tall?: boolean })[] }) {
  return (
    <div className="work-grid">
      {items.map((p, i) => (
        <Link
          key={p.src}
          href={`/series/${p.collection}#work`}
          className={`tile work-item reveal-img${p.tall ? " is-tall" : ""}`}
          style={d((i % 4) * 80)}
        >
          <Image src={p.src} alt={`${p.title}, ${p.detail}`} fill sizes="(max-width: 900px) 50vw, 25vw" quality={85} />
          <div className="tile-grad" />
          <div className="work-cap">
            <b>{p.title}</b>
            <span>{p.detail}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
