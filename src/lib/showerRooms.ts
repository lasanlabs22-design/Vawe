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

// The client's four frame colours (same hex values as the sliding shutter edge profiles). They also colour
// the hinges and fittings of frameless glass. deep → base → light: a frame's own light and shade are mapped
// onto this ramp; black keeps the photographed frame as it is.
export const showerFrames = [
  { id: "black", label: "Black", swatch: "#080707", ramp: null },
  { id: "rose", label: "Rose Gold", swatch: "#eda8a8", ramp: ["#8f5a58", "#cf8f8d", "#f2bcbb", "#fde6e4"] },
  { id: "electro-champagne", label: "Electro Champagne", swatch: "#815d22", ramp: ["#2e1f08", "#6a4b1a", "#9a7432", "#d9b878"] },
  { id: "champagne", label: "Champagne", swatch: "#e8d6b3", ramp: ["#6e5e40", "#c4b088", "#ecdcbc", "#fbf4e6"] },
] as const;

export const showerGlass = [
  { id: "clear", label: "Clear" },
  { id: "frosted", label: "Frosted" },
  { id: "fluted", label: "Fluted" },
  { id: "brown", label: "Brown Tinted" },
  { id: "grey", label: "Grey Tinted" },
] as const;
