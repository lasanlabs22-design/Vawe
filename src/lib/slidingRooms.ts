export type DoorCount = 2 | 3 | 4;
export type RoomRender = {
  id: number;
  name: string;
  doors: DoorCount;
  width: number;
  height: number;
  // Each vertical seam: x, top y, bottom y, measured in the original image.
  seams: [number, number, number][];
};

export const slidingRooms: RoomRender[] = [
  { id: 18, name: "Botanical garden", doors: 2, width: 864, height: 898, seams: [[220,125,773],[489,126,773],[758,126,772]] },
  { id: 19, name: "Champagne damask", doors: 2, width: 878, height: 988, seams: [[37,144,767],[298,145,767],[557,145,767]] },
  { id: 27, name: "Bronze geometry", doors: 2, width: 934, height: 600, seams: [[173,94,491],[387,95,491],[599,95,491]] },
  { id: 28, name: "Colour composition", doors: 3, width: 1117, height: 868, seams: [[119,96,755],[411,98,753],[698,100,752],[987,101,751]] },
  { id: 30, name: "Diagonal silver", doors: 3, width: 1531, height: 854, seams: [[804,63,661],[1005,65,660],[1205,66,660],[1407,67,659]] },
  { id: 35, name: "Oak & indigo", doors: 4, width: 1293, height: 687, seams: [[302,109,587],[515,110,587],[725,110,586],[934,110,585],[1139,110,584]] },
  { id: 38, name: "Amber leaves", doors: 4, width: 1600, height: 900, seams: [[249,216,791],[431,217,792],[615,217,793],[794,216,793],[981,214,794]] },
  { id: 41, name: "Ivory textile", doors: 4, width: 1375, height: 644, seams: [[480,70,518],[681,70,518],[878,70,518],[1076,70,518],[1274,70,518]] },
];

export const roomImage = (room: RoomRender) => `/images/sliding-rooms/IMG-20261015-WA00${room.id}.jpg`;

export type RevealSide = "left" | "centre" | "right";
// Two-track bypass: panels overlap their neighbours, never leave the cabinet.
export function roomOffsets(doors: DoorCount, side: RevealSide): number[] {
  if (doors === 2) return side === "right" ? [0, -1] : [1, 0];
  if (doors === 3) return side === "left" ? [1, 0, 0] : side === "right" ? [0, 0, -1] : [0, -1, 0];
  return side === "left" ? [1, 0, 0, 0] : side === "right" ? [0, 0, 0, -1] : [0, -1, 1, 0];
}
