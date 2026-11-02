// Options for the interactive sliding-wardrobe configurator.

export type FinishKind = "tinted" | "lacquer" | "fabric" | "cane" | "print";
export type Finish = { kind: FinishKind; value: string };

type Option = { id: string; label: string; value: string };

export const finishOptions: Record<FinishKind, { label: string; note: string; description: string; options: Option[] }> = {
  tinted: {
    label: "Tinted",
    note: "Glass",
    description: "Smoked glass in bronze, grey or black. Moody and softly reflective, with the lit interior glowing through.",
    options: [
      { id: "bronze", label: "Bronze", value: "#5a4532" },
      { id: "grey", label: "Grey", value: "#3d4146" },
      { id: "black", label: "Black", value: "#141414" },
    ],
  },
  lacquer: {
    label: "Lacquered",
    note: "Glass",
    description: "Back-painted glass in the shade of your choice, with a deep, high-gloss finish that is easy to wipe clean.",
    options: [
      { id: "ivory", label: "Ivory", value: "#efe8dc" },
      { id: "sage", label: "Sage", value: "#8e9c88" },
      { id: "terracotta", label: "Terracotta", value: "#b8674a" },
      { id: "navy", label: "Navy", value: "#23314a" },
      { id: "blush", label: "Blush", value: "#e2b8b0" },
      { id: "onyx", label: "Onyx", value: "#1a1a1c" },
      { id: "vawe", label: "Vawe pink", value: "#e6005b" },
    ],
  },
  fabric: {
    label: "Fabric",
    note: "Textile",
    description: "Woven textile sealed behind glass, bringing the warmth of upholstery to the wardrobe without the upkeep.",
    options: [
      { id: "linen", label: "Linen", value: "#d6c9b3" },
      { id: "stone", label: "Stone grey", value: "#a9a7a2" },
      { id: "olive", label: "Olive", value: "#7c7a5a" },
      { id: "charcoal", label: "Charcoal", value: "#4a4846" },
    ],
  },
  cane: {
    label: "Cane",
    note: "Natural",
    description: "A rattan weave held in slim aluminium. Light, airy and breathable, with glimpses of the wardrobe behind.",
    options: [
      { id: "natural", label: "Natural", value: "#b48a52" },
      { id: "walnut", label: "Walnut", value: "#6b4a2b" },
      { id: "black", label: "Black", value: "#2a2a2a" },
    ],
  },
  print: {
    label: "Digital Print",
    note: "Custom",
    description: "Artwork printed edge to edge across the glass, continuous from one panel to the next. Choose ours or upload your own.",
    options: [
      { id: "arches", label: "Arches", value: "/images/prints/arches.jpg" },
      { id: "terrazzo", label: "Terrazzo", value: "/images/prints/terrazzo.jpg" },
      { id: "marble", label: "Marble", value: "/images/prints/marble.jpg" },
      { id: "dunes", label: "Dunes", value: "/images/prints/dunes.jpg" },
    ],
  },
};

export const finishKinds = Object.keys(finishOptions) as FinishKind[];

export const slidingFrames: Option[] = [
  { id: "black", label: "Matte black", value: "#1c1c1e" },
  { id: "graphite", label: "Graphite", value: "#4a4d52" },
  { id: "champagne", label: "Champagne", value: "#c8b48d" },
  { id: "gold", label: "Brushed gold", value: "#c9a14e" },
  { id: "bronze", label: "Bronze", value: "#6e4f37" },
  { id: "silver", label: "Silver anodised", value: "#b9bec3" },
];

export const optionLabel = (f: Finish) =>
  f.value.startsWith("blob:")
    ? "Your artwork"
    : (finishOptions[f.kind].options.find((o) => o.value === f.value)?.label ?? "");
