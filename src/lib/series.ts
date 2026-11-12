// The client's product tree, in their order. Drives the top nav and each page's "full range" list.

export type SeriesItem = { name: string; note?: string };

export type SeriesGroup = {
  title: string;
  href: string;
  items: SeriesItem[];
};

/** focus: where the product sits in the photo, so the square tile crops around it (CSS object-position). */
export type SeriesCard = { name: string; href: string; image: string; focus?: string };

export type Series = {
  label: string;
  href: string;
  tagline: string;
  /** Where customers use this series, shown above the nav tiles. */
  uses: string[];
  /** The nav menu: one picture per product a customer can choose, linked to that pick in its studio. */
  cards: SeriesCard[];
  /** A small row of extra choices under the "Made for" line, such as door layouts. */
  options?: { label: string; items: { name: string; href: string }[] };
  groups: SeriesGroup[];
};

const openable = "/series/openable-shutters";
const sliding = "/series/sliding-wardrobe-shutters";

export const series: Series[] = [
  {
    label: "Openable Series",
    href: openable,
    tagline: "Hinged aluminium shutters, by profile and handle.",
    uses: ["Wardrobes", "Modular kitchens", "Crockery units", "TV & display units"],
    cards: [
      { name: "45 mm Profile", href: `${openable}#bella--45-mm`, image: "/images/work/openable-45-g-handle.jpg" },
      { name: "20 mm Profile", href: `${openable}#bella--20-mm`, image: "/images/work/openable-20-i-handle.jpg" },
      { name: "CNC Profile", href: `${openable}#bella--cnc`, image: "/images/work/openable-cnc-20.jpg" },
    ],
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
    tagline: "Floor-to-ceiling sliders, by handle and finish.",
    uses: ["Bedroom wardrobes", "Walk-in closets", "Kids' rooms", "Utility storage"],
    cards: [
      // The client's three ranges, each pictured by a wardrobe from the studio; the tile opens the studio on it.
      { name: "Essential", href: `${sliding}#sliding--essential`, image: "/images/sliding-rooms/IMG-20261015-WA0028.jpg" },
      { name: "Luxe", href: `${sliding}#sliding--luxe`, image: "/images/sliding-rooms/IMG-20261015-WA0019.jpg", focus: "30% 50%" },
      { name: "Premium", href: `${sliding}#sliding--premium`, image: "/images/sliding-rooms/IMG-20261015-WA0038.jpg", focus: "45% 50%" },
    ],
    options: {
      label: "Layouts",
      items: [
        { name: "2 doors", href: `${sliding}#sliding--2-doors` },
        { name: "3 doors", href: `${sliding}#sliding--3-doors` },
        { name: "4 doors", href: `${sliding}#sliding--4-doors` },
      ],
    },
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
        ],
      },
    ],
  },
  {
    label: "Partition Series",
    href: "/series/sliding-partitions",
    tagline: "Glass walls that slide, stack, fold or stay put.",
    uses: ["Kitchen & living", "Home offices", "Pooja rooms", "Balconies", "Showers"],
    cards: [
      { name: "Synchro", href: "/series/sliding-partitions#partitions--synchro", image: "/images/work/partition-synchro.jpg" },
      { name: "Telescopic", href: "/series/sliding-partitions#partitions--telescopic", image: "/images/work/partition-telescopic-2.jpg" },
      { name: "Ghost", href: "/series/sliding-partitions#partitions--ghost", image: "/images/work/partition-ghost-1.jpg" },
      { name: "Pooja Bi-Fold", href: "/series/sliding-partitions#partitions--pooja-bi-fold", image: "/images/partition-rooms/pooja.png" },
      { name: "Slide & Fold", href: "/series/sliding-partitions#partitions--slide-fold", image: "/images/work/partition-slide-fold-1.jpg" },
      { name: "Bathroom Partitions", href: "/series/bathroom-partitions#shower-studio", image: "/images/shower-rooms/fixed.jpg" },
    ],
    groups: [
      {
        title: "Partitions",
        href: "/series/sliding-partitions",
        items: [{ name: "Synchro" }, { name: "Telescopic" }, { name: "Ghost" }, { name: "Pooja Bi-Fold" }, { name: "Slide & Fold" }],
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
    tagline: "Mirrors that light a room.",
    uses: ["Bathroom vanities", "Dressing areas", "Bedrooms", "Entryways", "Feature walls"],
    cards: [
      { name: "Front Lit", href: "/series/mirrors#mirrors--front-lit", image: "/images/hero/mirrors.jpg", focus: "84% 40%" },
      { name: "Backlit", href: "/series/mirrors#mirrors--backlit", image: "/images/stock/mirror-led-round-stone.jpg", focus: "50% 35%" },
      { name: "Framed Front Lit", href: "/series/mirrors#mirrors--framed-front-lit", image: "/images/mirrors-led.jpg", focus: "0% 30%" },
      { name: "Framed Backlit", href: "/series/mirrors#mirrors--framed-backlit", image: "/images/nav/mirror-framed-backlit.jpg", focus: "56% 30%" },
      { name: "Bevelled Mirror", href: "/series/bevelled-mirror#work", image: "/images/work/bevel-diamond-backlit-wall.jpg", focus: "50% 40%" },
    ],
    groups: [
      {
        title: "Mirrors",
        href: "/series/mirrors",
        items: [{ name: "Front Lit" }, { name: "Backlit" }, { name: "Framed" }],
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

