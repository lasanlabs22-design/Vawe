// Options for the interactive openable-shutter configurator.

export type ProfileId = "regular" | "slim" | "cnc";
export type InsertId = "tinted" | "fluted" | "mirror" | "lacquer-ivory" | "lacquer-sage" | "fabric" | "cane";

export const profiles: { id: ProfileId; label: string; short: string; mm?: number; description: string }[] = [
  {
    id: "regular",
    label: "45 mm Regular Profile",
    short: "45 mm",
    mm: 45,
    description:
      "Our signature aluminium frame: substantial enough for full-height wardrobe and kitchen doors, finished with a slim bar handle.",
  },
  {
    id: "slim",
    label: "20 mm Profile",
    short: "20 mm",
    mm: 20,
    description: "A slender, barely-there frame that lets the insert take centre stage, ideal for display units and lighter doors.",
  },
  {
    id: "cnc",
    label: "CNC Profile",
    short: "CNC",
    description:
      "A precision-routed groove runs along the edge of the frame, so the door opens without any handle at all: clean and seamless.",
  },
];

export const frameColors: { id: string; label: string; hex: string }[] = [
  { id: "black", label: "Matte black", hex: "#1c1c1e" },
  { id: "graphite", label: "Graphite", hex: "#4a4d52" },
  { id: "champagne", label: "Champagne", hex: "#c8b48d" },
  { id: "gold", label: "Brushed gold", hex: "#c9a14e" },
  { id: "bronze", label: "Bronze", hex: "#6e4f37" },
  { id: "silver", label: "Silver anodised", hex: "#b9bec3" },
  { id: "rose", label: "Rose gold", hex: "#c39486" },
];

export const hingeFinishes: { id: string; label: string; hex: string }[] = [
  { id: "black", label: "Matte black", hex: "#1c1c1e" },
  { id: "nickel", label: "Brushed nickel", hex: "#a9adb1" },
  { id: "gold", label: "Gold", hex: "#c9a14e" },
  { id: "rose", label: "Rose gold", hex: "#c39486" },
];

export const inserts: { id: InsertId; label: string }[] = [
  { id: "fluted", label: "Fluted glass" },
  { id: "tinted", label: "Tinted glass" },
  { id: "mirror", label: "Mirror" },
  { id: "lacquer-ivory", label: "Ivory lacquer" },
  { id: "lacquer-sage", label: "Sage lacquer" },
  { id: "fabric", label: "Fabric" },
  { id: "cane", label: "Cane" },
];

export const findLabel = <T extends { id: string; label: string }>(list: T[], id: string) =>
  list.find((x) => x.id === id)?.label ?? id;
