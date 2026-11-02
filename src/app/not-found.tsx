import Link from "next/link";

export default function NotFound() {
  return (
    <section className="nf on-dark">
      <div>
        <p className="t-display">
          4<em>0</em>4
        </p>
        <p className="t-lead" style={{ margin: "20px auto 36px", maxWidth: 420 }}>
          This room doesn&apos;t exist yet. Let&apos;s take you somewhere beautiful.
        </p>
        <Link href="/" className="btn btn-pink on-dark-btn">
          Back to home <span className="arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
