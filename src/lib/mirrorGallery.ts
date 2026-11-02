import type { MirrorFinish, MirrorKind, MirrorShape } from "@/components/Mirror";

// Vawe's mirror catalogue: every modern shape × every style, rendered by the interactive Mirror component.
// To use real product photography later, add an `image` field per design and render it in MirrorGallery.

export type Wall = "plaster" | "sage" | "clay" | "stone" | "charcoal";

export const shapes: { id: MirrorShape; label: string; word: string }[] = [
  { id: "round", label: "Round", word: "Orbit" },
  { id: "squircle", label: "Soft square", word: "Cushion" },
  { id: "tombstone", label: "Tombstone arch", word: "Portal" },
  { id: "halfarch", label: "Half arch", word: "Crest" },
  { id: "capsule", label: "Capsule", word: "Pill" },
  { id: "egg", label: "Egg oval", word: "Ova" },
  { id: "pebble", label: "Organic", word: "Pebble" },
  { id: "fulllength", label: "Full length", word: "Tower" },
];

export const styles: {
  id: string;
  label: string;
  word: string;
  kind: MirrorKind;
  finish: MirrorFinish;
  led: boolean;
  frame: string;
  wall: Wall;
}[] = [
  { id: "halo", label: "LED backlit", word: "Halo", kind: "led", finish: "none", led: true, frame: "Frameless, backlit LED", wall: "charcoal" },
  { id: "lumen", label: "Black frame LED", word: "Lumen", kind: "frame-led", finish: "none", led: true, frame: "Slim black frame, backlit LED", wall: "stone" },
  { id: "frost", label: "Frosted LED", word: "Frost", kind: "frost", finish: "none", led: true, frame: "Frosted front-lit LED band", wall: "sage" },
  { id: "aurum", label: "Brushed gold", word: "Aurum", kind: "plain", finish: "gold", led: false, frame: "Slim brushed gold frame", wall: "plaster" },
  { id: "fluted", label: "Fluted gold", word: "Fluted", kind: "plain", finish: "fluted", led: false, frame: "Thick fluted gold rim", wall: "clay" },
  { id: "cane", label: "Cane", word: "Cane", kind: "plain", finish: "cane", led: false, frame: "Woven rattan cane border", wall: "plaster" },
];

export type GalleryMirror = {
  code: string;
  name: string;
  shape: MirrorShape;
  shapeLabel: string;
  style: string;
  styleLabel: string;
  kind: MirrorKind;
  finish: MirrorFinish;
  frame: string;
  led: boolean;
  wall: Wall;
  angle: number;
  reflect: string;
};

const reflects = ["/images/reflect-living.jpg", "/images/reflect-bedroom.jpg", "/images/reflect-vanity.jpg", "/images/reflect-studio.jpg"];

export const galleryMirrors: GalleryMirror[] = styles.flatMap((st, si) =>
  shapes.map((sh, hi) => {
    const n = si * shapes.length + hi + 1;
    return {
      code: `VW-MR-${String(n).padStart(3, "0")}`,
      name: `${st.word} ${sh.word}`,
      shape: sh.id,
      shapeLabel: sh.label,
      style: st.id,
      styleLabel: st.label,
      kind: st.kind,
      finish: st.finish,
      frame: st.frame,
      led: st.led,
      wall: st.wall,
      angle: n % 2 ? -8 : 8,
      reflect: reflects[n % reflects.length],
    };
  }),
);
