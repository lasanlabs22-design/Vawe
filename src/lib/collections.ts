import type { MirrorKind, MirrorShape } from "@/components/Mirror";

export type Swatch = "tinted" | "lacquered" | "fabric" | "cane" | "print";

export type Variant = {
  name: string;
  note: string;
  description: string;
  image?: string;
  swatch?: Swatch;
  /** Renders an interactive, light-up mirror in the variant card. */
  mirror?: { kind: MirrorKind; shape: MirrorShape };
};

export type Collection = {
  slug: string;
  index: string;
  name: string;
  short: string;
  tag: string;
  tagline: string;
  image: string;
  /** Full-screen hero photo when the tile photo is too small to stay sharp at that size. */
  cover?: string;
  gallery: [string, string];
  intro: string;
  body: string;
  variantsTitle: string;
  variants: Variant[];
  applications: string[];
};

export const collections: Collection[] = [
  {
    slug: "openable-shutters",
    index: "01",
    name: "Openable Shutters",
    short: "Openable Shutters",
    tag: "Shutters",
    tagline: "Hinged doors, drawn in fine lines.",
    image: "/images/work/openable-45-g-handle.jpg",
    gallery: ["/images/about-dark-bedroom.jpg", "/images/wardrobe-alt.jpg"],
    intro: "Aluminium-framed shutters that turn storage into architecture.",
    body: "Every Vawe openable shutter is built to the exact opening it will live in. Choose a frame weight to suit the room, then pair it with glass, mirror, lacquer, fabric or cane, so wardrobes, kitchens and crockery units all read as one considered surface.",
    variantsTitle: "Three profiles.",
    variants: [
      {
        name: "Regular 45 mm Profile",
        note: "45 mm",
        description:
          "Our signature frame. Substantial enough for full-height wardrobe and kitchen doors, with a crisp, architectural edge.",
      },
      {
        name: "20 mm Profile",
        note: "20 mm",
        description:
          "A slender, barely-there frame that lets the insert take centre stage, ideal for display units and lighter doors.",
      },
      {
        name: "CNC Profiles",
        note: "CNC",
        description:
          "Precision-routed grooves and integrated handles cut into the profile for a seamless, handle-free face.",
      },
    ],
    applications: ["Wardrobes", "Modular kitchens", "Crockery units", "Vanity storage", "TV & display units"],
  },
  {
    slug: "sliding-wardrobe-shutters",
    index: "02",
    name: "Sliding Wardrobe Shutters",
    short: "Sliding Wardrobes",
    tag: "Wardrobes",
    tagline: "The wardrobe, re-surfaced.",
    image: "/images/work/sliding-highlighter.jpg",
    cover: "/images/stock/wardrobe-glass-lit.jpg",
    gallery: ["/images/hero-bedroom.jpg", "/images/wardrobe-alt.jpg"],
    intro: "Floor-to-ceiling sliders that save space and set the mood of a room.",
    body: "Sliding shutters glide on concealed tracks, so the wardrobe never fights the bed or the walkway. The face is where it gets personal: five finishes, each made for a different kind of room.",
    variantsTitle: "Five finishes.",
    variants: [
      { name: "Tinted", note: "Glass", swatch: "tinted", description: "Smoked, bronze and grey glass for a moody, softly reflective face." },
      { name: "Lacquered", note: "Glass", swatch: "lacquered", description: "Back-painted glass in the shade of your choice, in high-gloss or satin." },
      { name: "Fabric", note: "Textile", swatch: "fabric", description: "Woven textiles sealed behind glass, bringing warmth and texture without the upkeep." },
      { name: "Cane", note: "Natural", swatch: "cane", description: "A natural rattan weave held in slim aluminium. Light, airy and quietly tropical." },
      { name: "Digital Print", note: "Custom", swatch: "print", description: "Your artwork, photograph or pattern printed edge to edge on glass." },
    ],
    applications: ["Master bedrooms", "Kids' rooms", "Walk-in closets", "Guest rooms", "Utility storage"],
  },
  {
    slug: "sliding-partitions",
    index: "03",
    name: "Sliding Partitions",
    short: "Sliding Partitions",
    tag: "Partitions",
    tagline: "Rooms that open on cue.",
    image: "/images/work/partition-synchro.jpg",
    cover: "/images/stock/partition-steel-kitchen.jpg",
    gallery: ["/images/slide-telescopic.jpg", "/images/slide-bifold.jpg"],
    intro: "Glass walls that divide a space when you need it, and disappear when you don't.",
    body: "Separate the kitchen from the living room, close off a study, or open a home onto its balcony. Our sliding partitions come in four mechanisms, each tuned for a different opening width and stacking need.",
    variantsTitle: "Four systems.",
    variants: [
      { name: "Synchro Sliding", note: "Synchro", image: "/images/work/partition-synchro.jpg", description: "Linked panels move together. Pull one, and its partner glides open in sync from the opposite side." },
      { name: "Telescopic Sliding", note: "Telescopic", image: "/images/work/partition-telescopic-2.jpg", description: "Panels stack neatly behind one another on parallel tracks for wide, uninterrupted openings." },
      { name: "Bi-Fold", note: "Bi-Fold", image: "/images/stock/bifold-open.jpg", description: "Panels fold in pairs like a concertina, opening almost the full width of the frame." },
      { name: "Slide cum Fold", note: "Slide & Fold", image: "/images/work/partition-slide-fold-1.jpg", description: "Panels slide along the track, then fold flat against the wall, leaving a clear, column-free opening." },
    ],
    applications: ["Kitchen-living", "Home offices", "Balconies", "Conference rooms", "Retail & hospitality"],
  },
  {
    slug: "mirrors",
    index: "04",
    name: "Mirrors",
    short: "Mirrors",
    tag: "Mirrors",
    tagline: "Light, reflected.",
    image: "/images/mirrors-led.jpg",
    gallery: ["/images/hero-led-vanity.jpg", "/images/mirror-round.jpg"],
    intro: "From clean plain glass to backlit statement pieces, mirrors that light a room.",
    body: "A mirror doubles the light in a room and halves the visual clutter. Ours are cut and finished to size, with integrated LED options for vanities, dressers and entryways.",
    variantsTitle: "Three ways to reflect.",
    variants: [
      { name: "Plain Mirror", note: "Classic", mirror: { kind: "plain", shape: "tombstone" }, description: "Distortion-free mirror glass cut to any size or shape, from full walls to wardrobe insets." },
      { name: "LED Mirror", note: "Backlit", mirror: { kind: "led", shape: "round" }, description: "Soft, even backlighting that makes a vanity glow, with no visible fittings." },
      { name: "Frame LED Mirror", note: "Framed", mirror: { kind: "frame-led", shape: "capsule" }, description: "A slim metal frame with integrated light, a finishing touch for dressers and powder rooms." },
    ],
    applications: ["Vanities", "Dressing areas", "Entryways", "Gyms & studios", "Salons"],
  },
  {
    slug: "bathroom-partitions",
    index: "05",
    name: "Bathroom Partitions",
    short: "Bathroom Partitions",
    tag: "Bath",
    tagline: "Water, framed in glass.",
    image: "/images/bathroom-partition.jpg",
    gallery: ["/images/bathroom-partition-2.jpg", "/images/hero-led-vanity.jpg"],
    intro: "Toughened glass shower partitions that keep the wet zone in and the room open.",
    body: "A glass partition makes even a compact bathroom feel generous. Each enclosure is measured on site and fitted with hardware chosen for daily, wet use.",
    variantsTitle: "Made for every layout.",
    variants: [
      { name: "Fixed Panel", note: "Walk-in", description: "A single sheet of glass that defines the shower without a door. Minimal and easy to clean." },
      { name: "Hinged Door", note: "Swing", description: "A classic swing-door enclosure for corner and alcove showers." },
      { name: "Sliding Enclosure", note: "Slide", description: "Space-saving sliding doors for bathrooms where a swing door won't clear." },
    ],
    applications: ["Showers", "Wet & dry zoning", "Bathtub screens", "Hotel bathrooms"],
  },
  {
    slug: "fabric-glass",
    index: "06",
    name: "Fabric Glass",
    short: "Fabric Glass",
    tag: "Textile",
    tagline: "Textile, sealed in glass.",
    image: "/images/stock/partition-frosted.jpg",
    gallery: ["/images/about-living.jpg", "/images/studio-interior.jpg"],
    intro: "The softness of fabric, with the durability and easy care of glass.",
    body: "Fabric glass laminates real textiles between glass, giving you the warmth of linen or silk with a surface you can simply wipe down. It diffuses light beautifully, offering privacy without darkness.",
    variantsTitle: "Where it shines.",
    variants: [
      { name: "Partitions", note: "Divide", swatch: "fabric", description: "Soft-focus room dividers that let light through while keeping the view private." },
      { name: "Shutter Inserts", note: "Inset", swatch: "fabric", description: "Fabric glass panels framed in our openable and sliding shutter profiles." },
      { name: "Feature Walls", note: "Clad", swatch: "fabric", description: "Large-format panels that turn a plain wall into a tactile, textured backdrop." },
    ],
    applications: ["Wardrobes", "Room dividers", "Headboards", "Feature walls", "Cabin fronts"],
  },
  {
    slug: "bevelled-mirror",
    index: "07",
    name: "Bevelled Mirror",
    short: "Bevelled Mirror",
    tag: "Mirrors",
    tagline: "An edge that catches the light.",
    image: "/images/bevelled-mirror.jpg",
    gallery: ["/images/mirror-round-2.jpg", "/images/founder-living.jpg"],
    intro: "Mirrors with precision-ground, angled edges that frame themselves in light.",
    body: "A bevel is a small detail that changes everything: the angled edge refracts light into a fine, prismatic outline. Use it as a single statement piece or as tiled panels across a wall.",
    variantsTitle: "Three expressions.",
    variants: [
      { name: "Statement Mirrors", note: "Single", mirror: { kind: "bevelled", shape: "egg" }, description: "One generous bevelled piece above a console, bed or vanity." },
      { name: "Bevelled Wall Panels", note: "Tiled", mirror: { kind: "bevelled", shape: "squircle" }, description: "Panels laid in a grid or pattern for a luminous, art-deco wall." },
      { name: "Furniture Insets", note: "Inset", mirror: { kind: "bevelled", shape: "halfarch" }, description: "Bevelled mirror inserts for wardrobes, sideboards and dressers." },
    ],
    applications: ["Living rooms", "Dining walls", "Foyers", "Bedrooms", "Boutiques"],
  },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

export const slidingSystems = collections.find((c) => c.slug === "sliding-partitions")!.variants;
export const wardrobeFinishes = collections.find((c) => c.slug === "sliding-wardrobe-shutters")!.variants;
