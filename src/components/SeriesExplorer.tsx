"use client";

import { useState } from "react";
import Link from "next/link";
import BellaKitchen from "./BellaKitchen";
import ShutterStudio from "./ShutterStudio";
import SlidingRoomStudio from "./SlidingRoomStudio";
import PartitionStudio from "./PartitionStudio";
import FabricStudio from "./FabricStudio";
import ShowerRoomStudio from "./ShowerRoomStudio";
import MirrorRoomStudio from "./MirrorRoomStudio";

const choices = [
  { slug: "openable-shutters", label: "Openable Series", detail: "Hinged glass · Bella kitchen" },
  { slug: "sliding-wardrobe-shutters", label: "Sliding Shutter Series", detail: "Sliding doors · Finishes" },
  { slug: "sliding-partitions", label: "Partition Series", detail: "Sliding · Folding systems" },
  { slug: "mirrors", label: "Glass & Mirror", detail: "Illuminated · Signature mirrors" },
  { slug: "fabric-glass", label: "Fabric Glass", detail: "Textures · Decorative inserts" },
  { slug: "bathroom-partitions", label: "Shower Partitions", detail: "Glass · Bathroom systems" },
];

export default function SeriesExplorer({ initialSlug, mode = "room" }: { initialSlug: string; mode?: "room" | "studio" }) {
  const [active, setActive] = useState(choices.some(c => c.slug === initialSlug) ? initialSlug : choices[0].slug);
  const previewId = mode === "studio" ? "quick-studio-preview" : "series-preview";
  return (
    <section className="series-explorer" id={mode === "studio" ? "quick-studio" : "explore-series"} aria-label={mode === "studio" ? "Quick studio switcher" : "Interactive series previews"}>
      <div className="container explorer-heading"><div><div className="t-eyebrow">Explore in motion</div><h2>Every series. One place to explore.</h2></div><p>Choose a series to try it here.</p></div>
      <div className="container explorer-choices" role="group" aria-label="Choose a series preview">
        {choices.map((choice, i) => <button key={choice.slug} type="button" aria-pressed={active === choice.slug} aria-controls={previewId} onClick={() => setActive(choice.slug)}><span className="explorer-number">0{i + 1}</span><strong>{choice.label}</strong><small>{choice.detail}</small></button>)}
      </div>
      <div id={previewId} className="explorer-preview" key={active}>
        {active === "openable-shutters" && (mode === "studio" ? <ShutterStudio /> : <BellaKitchen />)}
        {active === "sliding-wardrobe-shutters" && <SlidingRoomStudio />}
        {active === "sliding-partitions" && <PartitionStudio />}
        {active === "fabric-glass" && <FabricStudio />}
        {active === "bathroom-partitions" && <ShowerRoomStudio />}
        {active === "mirrors" && <MirrorRoomStudio />}
        {active !== initialSlug && <div className="explorer-detail"><Link className="btn" href={`/series/${active}`}>View this collection <span aria-hidden="true">↗</span></Link></div>}
      </div>
    </section>
  );
}
