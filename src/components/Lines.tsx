import type { ElementType, ReactNode } from "react";

type Props = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  /** Scroll-triggered (default) or CSS-on-load (hero). */
  onLoad?: boolean;
  delay?: number;
};

// Masked line-by-line headline reveal.
export default function Lines({ lines, as: Tag = "h2", className = "", onLoad = false, delay = 0 }: Props) {
  return (
    <Tag
      className={`lines${onLoad ? "" : " reveal-lines"} ${className}`}
      style={delay ? ({ "--d": delay } as React.CSSProperties) : undefined}
    >
      {lines.map((line, i) => (
        <span className="line" key={i}>
          <span style={{ "--i": i } as React.CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
