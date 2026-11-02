// Illuminated "VAWE" signage: each letter of the real wordmark sits in its own light box.
// Letters are the logo glyphs used as CSS masks, so the shapes match the brand exactly.
const letters = [
  { key: "v", w: 552 },
  { key: "a", w: 594 },
  { key: "w", w: 851 },
  { key: "e", w: 419 },
];
const LETTER_H = 574;

export default function FooterSign() {
  return (
    <div className="sign-wrap" aria-hidden="true">
      <div className="sign reveal">
        {letters.map((l, i) => (
          <div className="lightbox" key={l.key} style={{ "--i": i } as React.CSSProperties}>
            <span className="lb-strip" />
            <span className="lb-smoke" />
            <span className="lb-glow">
              <span
                className="lb-letter"
                style={{
                  WebkitMaskImage: `url(/brand/letter-${l.key}.png)`,
                  maskImage: `url(/brand/letter-${l.key}.png)`,
                  aspectRatio: `${l.w} / ${LETTER_H}`,
                }}
              />
            </span>
          </div>
        ))}
      </div>
      <div className="sign-floor" />
    </div>
  );
}
