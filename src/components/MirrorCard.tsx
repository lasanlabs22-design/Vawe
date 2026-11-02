"use client";

import { useState } from "react";
import Mirror, { LightButton, type MirrorKind, type MirrorShape } from "./Mirror";

// Interactive mirror for collection variant cards; each card keeps its own light state.
export default function MirrorCard({ kind, shape, label }: { kind: MirrorKind; shape: MirrorShape; label: string }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn((o) => !o);
  return (
    <div className={`variant-mirror tone-warm${on ? " is-lit" : ""}`}>
      <Mirror kind={kind} shape={shape} on={on} tone="warm" label={label} onToggle={toggle} />
      <LightButton on={on} onToggle={toggle} size="sm" name={label} />
    </div>
  );
}
