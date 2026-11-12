// Project photos grouped by collection: the client's own (Vawe Drive folder) plus a few sharp stock
// photos (Unsplash, free licence) where the client's originals are too small to stay crisp.

import { focusKey as k } from "./series";

export type Work = {
  src: string;
  width: number;
  height: number;
  title: string;
  detail: string;
  collection: string;
  /** Series focus keys this photo shows (see focusKey), so nav picks can highlight it. */
  tags: string[];
};

const w = (file: string, size: string, title: string, detail: string, collection: string, tags: string[] = []): Work => {
  const [width, height] = size.split("x").map(Number);
  const src = file.includes("/") ? `/images/${file}.jpg` : `/images/work/${file}.jpg`;
  return { src, width, height, title, detail, collection, tags };
};

const op = "openable-shutters";
const sl = "sliding-wardrobe-shutters";
const pa = "sliding-partitions";

export const work: Work[] = [
  w("openable-45-g-handle", "1435x1600", "G Handle", "45 mm openable", op, [k("45 mm", "G Handle")]),
  w("openable-45-i-handle", "675x1200", "I Handle", "45 mm openable", op, [k("45 mm", "I Handle")]),
  w("openable-g-handle-kitchen", "1600x900", "G Handle kitchen", "45 mm openable", op, [k("45 mm", "G Handle")]),
  w("openable-leather-1", "960x1280", "Leather Handle", "Vawe Star Product", op, [k("Vawe Star Product", "Leather Handles")]),
  w("openable-cnc-d-20", "1162x1280", "CNC D Handle", "20 mm openable", op, [k("CNC", "D Type")]),
  w("openable-45-i-handle-crockery", "736x616", "I Handle crockery unit", "45 mm openable", op, [k("45 mm", "I Handle")]),
  w("openable-cnc-walkin", "1000x1223", "CNC Handle walk-in", "Fluted glass", op, [k("CNC")]),
  w("openable-20-i-handle", "660x1000", "I Handle", "20 mm openable", op, [k("20 mm", "I Handle")]),
  w("openable-bella-kitchen", "1600x900", "Bella Profile", "Top & bottom profile", op),
  w("openable-cnc-20", "736x1101", "CNC Handle", "20 mm openable", op, [k("CNC")]),
  w("openable-leather-2", "960x1280", "Leather Handle", "Vawe Star Product", op, [k("Vawe Star Product", "Leather Handles")]),
  w("openable-20-pooja-arch", "736x981", "Pooja unit", "20 mm openable", op, [k("20 mm", "I Handle")]),
  w("openable-cnc-4ft", "735x893", "CNC 4 ft Handle", "Openable", op, [k("CNC")]),
  w("openable-bella", "1312x1600", "Bella Profile", "Crockery & appliance wall", op),
  w("openable-leather-3", "960x1280", "Leather Handle", "Vawe Star Product", op, [k("Vawe Star Product", "Leather Handles")]),

  w("sliding-fluted", "736x692", "Fluted", "Floor-to-ceiling slider", sl, [k("Finishes", "Tinted / Fluted")]),
  w("stock/wardrobe-fluted-bedroom", "2400x1686", "Tinted glass sliders", "Bedroom", sl, [k("Finishes", "Tinted / Fluted")]),
  w("sliding-two-tone", "735x848", "Lacquered, two-tone", "Floor-to-ceiling slider", sl, [k("Finishes", "Lacquered")]),
  w("stock/wardrobe-walkin-glass", "2160x1351", "Glass walk-in", "Dressing room", sl),

  w("partition-synchro", "1000x1199", "Synchro", "Sliding partition", pa, [k("Partitions", "Synchro")]),
  w("partition-ghost-1", "736x1004", "Ghost Sliding", "Invisible track", pa, [k("Partitions", "Ghost")]),
  w("partition-telescopic-2", "736x1092", "Telescopic", "Sliding partition", pa, [k("Partitions", "Telescopic")]),
  w("partition-ghost-2", "735x917", "Ghost Sliding", "Invisible track", pa, [k("Partitions", "Ghost")]),
  w("partition-slide-fold-1", "736x964", "Slide cum Fold", "Sliding partition", pa),
  w("stock/bifold-open", "2400x2400", "Bi-Fold", "Folds fully open", pa, [k("Partitions", "Bi-Fold")]),
  w("stock/partition-steel-bedroom", "1800x2400", "Fluted glass partition", "Bedroom", pa, [k("Partitions", "Fixed")]),
  w("stock/partition-steel-door", "2400x2400", "Steel-framed glass", "Living room", pa),
  w("stock/partition-steel-double", "2400x1600", "Glass double doors", "Hallway", pa),

  w("fabric-glass-doors", "638x902", "Fabric Glass", "Sliding doors", "fabric-glass"),
  w("fabric-swatch-gold-strand", "1065x1200", "Gold strand", "Fabric glass sample", "fabric-glass"),
  w("fabric-swatch-linen-stripe", "1065x1200", "Linen stripe", "Fabric glass sample", "fabric-glass"),
  w("fabric-swatch-crush", "1065x1200", "Crushed silk", "Fabric glass sample", "fabric-glass"),
  w("fabric-swatch-grid", "1065x1200", "Woven grid", "Fabric glass sample", "fabric-glass"),
  w("fabric-swatch-ripple", "1065x1200", "Ripple", "Fabric glass sample", "fabric-glass"),
  w("fabric-swatch-chevron", "1065x1200", "Chevron", "Fabric glass sample", "fabric-glass"),

  w("bevel-diamond-backlit-wall", "1200x1499", "Diamond bevelled wall", "Backlit entry feature", "bevelled-mirror"),
  w("bevel-tv-wall-triangles", "970x1200", "Bevelled TV wall", "Triangle-cut panels", "bevelled-mirror"),
  w("bevel-tv-wall-strips", "1007x1007", "Bevelled side panels", "Living room TV unit", "bevelled-mirror"),
  w("bevel-diamond-partition", "800x800", "Diamond bevelled partition", "Living & dining", "bevelled-mirror"),
];

export const workFor = (slug: string) => work.filter((p) => p.collection === slug);

const find = (file: string) => work.find((p) => p.src === (file.includes("/") ? `/images/${file}.jpg` : `/images/work/${file}.jpg`))!;

/**
 * Home page mosaic, in placement order: six tall and four wide photos,
 * which pack the 4-column (and 2-column mobile) grid with no gaps.
 */
export const featuredWork = [
  ["openable-45-g-handle", true],
  ["sliding-two-tone", true],
  ["partition-synchro", true],
  ["openable-g-handle-kitchen", false],
  ["sliding-fluted", false],
  ["openable-leather-1", true],
  ["openable-45-i-handle-crockery", false],
  ["partition-ghost-1", true],
  ["openable-cnc-d-20", true],
  ["stock/wardrobe-walkin-glass", false],
].map(([file, tall]) => ({ ...find(file as string), tall: tall as boolean }));
