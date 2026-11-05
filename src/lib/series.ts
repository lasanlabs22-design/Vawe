// The client's product tree, in their order. Drives the top nav and each page's "full range" list.

export type SeriesItem = { name: string; note?: string };

export type SeriesGroup = {
  title: string;
  href: string;
  items: SeriesItem[];
};

export type Series = {
  label: string;
  href: string;
  image: string;
  tagline: string;
  groups: SeriesGroup[];
  /** Shows the catalogue download in this menu. */
  catalogue?: boolean;
};

export const catalogue = {
  title: "Fabric Glass Catalogue 2026",
  href: "/downloads/vawe-fabric-glass-catalogue-2026.pdf",
  fileName: "Vawe-Fabric-Glass-Catalogue-2026.pdf",
  cover: "/images/work/catalogue-cover.jpg",
  size: "22 MB PDF",
  pages: 121,
  ranges: ["Fabric", "Rattan", "Wiremesh", "Interior film"],
};

const openable = "/series/openable-shutters";
const sliding = "/series/sliding-wardrobe-shutters";

export const series: Series[] = [
  {
    label: "Openable Series",
    href: openable,
    image: "/images/work/openable-45-g-handle.jpg",
    tagline: "Hinged aluminium shutters, by profile and handle.",
    groups: [
      { title: "45 mm", href: openable, items: [{ name: "I Handle" }, { name: "G Handle" }] },
      { title: "20 mm", href: openable, items: [{ name: "I Handle" }] },
      {
        title: "CNC",
        href: openable,
        items: [
          { name: "D Type" },
          { name: "L Type", note: "20 & 45 mm" },
          { name: "Diamond", note: "20 & 45 mm" },
          { name: "Concealed", note: "25 mm, horizontal & vertical" },
        ],
      },
      { title: "Air Hinges", href: openable, items: [{ name: "L Type" }, { name: "Diamond" }] },
      { title: "Pin Hinges", href: openable, items: [{ name: "Grooved Handle" }] },
      { title: "Vawe Star Product", href: openable, items: [{ name: "Leather Handles" }] },
    ],
  },
  {
    label: "Sliding Shutter Series",
    href: sliding,
    image: "/images/stock/wardrobe-glass-lit.jpg",
    tagline: "Floor-to-ceiling sliders, by handle and finish.",
    groups: [
      { title: "Handles", href: sliding, items: [{ name: "C Handle" }, { name: "H Handle" }, { name: "T / L Handle" }] },
      {
        title: "Finishes",
        href: sliding,
        items: [
          { name: "Tinted / Fluted" },
          { name: "Lacquered" },
          { name: "Digital Print" },
          { name: "Fabric" },
          { name: "Cane" },
          { name: "Highlighter" },
        ],
      },
    ],
  },
  {
    label: "Partition Series",
    href: "/series/sliding-partitions",
    image: "/images/work/partition-synchro.jpg",
    tagline: "Glass walls that slide, stack, fold or stay put.",
    groups: [
      {
        title: "Partitions",
        href: "/series/sliding-partitions",
        items: [{ name: "Synchro" }, { name: "Telescopic" }, { name: "Bi-Fold" }, { name: "Ghost" }, { name: "Fixed" }],
      },
      {
        title: "Bathroom Partition",
        href: "/series/bathroom-partitions",
        items: [{ name: "Fixed" }, { name: "Slide" }, { name: "Openable" }],
      },
    ],
  },
  {
    label: "Glass & Mirror",
    href: "/series/mirrors",
    image: "/images/mirrors-led.jpg",
    tagline: "Mirrors that light a room, and glass with texture.",
    catalogue: true,
    groups: [
      {
        title: "Mirrors",
        href: "/series/mirrors",
        items: [{ name: "Plain" }, { name: "LED" }, { name: "Frame" }, { name: "Frame LED" }],
      },
      { title: "Fabric Glass", href: "/series/fabric-glass", items: [] },
      { title: "Bevelled Mirror", href: "/series/bevelled-mirror", items: [] },
    ],
  },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * URL-hash key for a group or one of its items, e.g. "45-mm" or "45-mm--g-handle".
 * Nav links carry it so the page can highlight what was picked.
 */
export const focusKey = (group: string, item?: string) => (item ? `${slug(group)}--${slug(item)}` : slug(group));

/** The group key of an item key ("45-mm--g-handle" → "45-mm"). */
export const focusGroup = (key: string) => key.split("--")[0];

/** Groups from the client's tree that belong on a given collection page. */
export const rangeFor = (slug: string) =>
  series.flatMap((s) => s.groups).filter((g) => g.href === `/series/${slug}` && g.items.length);
