// Fabric-glass options. Textures are original, procedurally generated tiles in /public/images/fabrics.

export type FabricId = "linen" | "sheer" | "herringbone" | "boucle" | "mesh" | "jacquard";

export const fabrics: { id: FabricId; label: string; note: string; tile: string; metal?: boolean }[] = [
  { id: "linen", label: "Linen", note: "Soft privacy", tile: "7em" },
  { id: "sheer", label: "Sheer voile", note: "Light and airy", tile: "6em" },
  { id: "herringbone", label: "Herringbone", note: "Tailored", tile: "9em" },
  { id: "boucle", label: "Bouclé", note: "Textured", tile: "10em" },
  { id: "mesh", label: "Metallic mesh", note: "Glints in the light", tile: "6em", metal: true },
  { id: "jacquard", label: "Jacquard", note: "Woven motif", tile: "8em" },
];

export const fabricColors: { id: string; label: string; value: string }[] = [
  { id: "ivory", label: "Ivory", value: "#efe7d8" },
  { id: "sand", label: "Sand", value: "#cdb594" },
  { id: "sage", label: "Sage", value: "#8f9c86" },
  { id: "blush", label: "Blush", value: "#dcb0a5" },
  { id: "indigo", label: "Indigo", value: "#3e4f78" },
  { id: "charcoal", label: "Charcoal", value: "#4a4846" },
];

export const metalColors: { id: string; label: string; value: string }[] = [
  { id: "gold", label: "Gold", value: "#d2ab58" },
  { id: "bronze", label: "Bronze", value: "#9a7448" },
  { id: "silver", label: "Silver", value: "#c4c8cb" },
  { id: "black", label: "Black", value: "#2c2c2c" },
];

export const colorsFor = (id: FabricId) => (fabrics.find((f) => f.id === id)?.metal ? metalColors : fabricColors);
export const texUrl = (id: FabricId) => `/images/fabrics/${id}.png`;
