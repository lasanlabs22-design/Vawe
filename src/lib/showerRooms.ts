// One real bathroom (the client's fixed-panel photo) carries all three partition layouts.
// Coordinates are in the photo's own pixels. The glass line runs from the left wall to the right wall.
export type ShowerLayoutId = "sliding" | "openable" | "fixed";

export const showerRoom = {
  image: "/images/shower-rooms/room.jpg", // the room with the photographed frame removed
  framed: "/images/shower-rooms/fixed.jpg", // the photograph as shot, for the fixed panel's real frame
  front: "/images/shower-rooms/room-front.png", // toilet, vanity and towel rail, which stand in front of the glass
  width: 1150,
  height: 1442,
  left: 70, // fixed panel, wall side
  split: 573, // fixed panel's free edge; the door closes against it
  right: 985, // right wall at the glass line
  top: 35,
  bottom: 1295,
  bar: 17, // frame thickness
  // Camera: vanishing point and distance, measured from how the side walls converge.
  vanish: [676, 583] as [number, number],
  distance: 1500,
  // The photographed frame of the fixed panel.
  frames: ["70,35 573,35 573,51 70,51", "70,35 91,35 91,889 70,889", "557,35 573,35 573,1295 557,1295", "357,1276 573,1276 573,1295 357,1295"],
};

export const showerLayouts: { id: ShowerLayoutId; label: string; navItem: string; variant: string }[] = [
  { id: "sliding", label: "Sliding", navItem: "Slide", variant: "Sliding Enclosure" },
  { id: "openable", label: "Openable", navItem: "Openable", variant: "Hinged Door" },
  { id: "fixed", label: "Fixed", navItem: "Fixed", variant: "Fixed Panel" },
];

// deep → base → light: a frame's own light and shade are mapped onto this ramp.
export const showerFrames = [
  { id: "black", label: "Matte Black", swatch: "#1f1f21", ramp: null },
  { id: "gold", label: "Brush Gold", swatch: "#c9a14e", ramp: ["#5a4318", "#a98236", "#d9b866", "#f3e2ad"] },
  { id: "rose", label: "Rose Gold", swatch: "#c39486", ramp: ["#7d5448", "#b88a7d", "#ddb4a7", "#f6dcd2"] },
  { id: "chrome", label: "Chrome", swatch: "#b9bec3", ramp: ["#3c4146", "#878e94", "#c9ced2", "#f5f7f8"] },
] as const;

export const showerGlass = [
  { id: "clear", label: "Clear" },
  { id: "frosted", label: "Frosted" },
  { id: "fluted", label: "Fluted" },
  { id: "brown", label: "Brown Tinted" },
  { id: "grey", label: "Grey Tinted" },
] as const;
