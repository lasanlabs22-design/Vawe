// Silhouettes interpreted from the client's November mirror references.
export const mirrorShapes = [
  { id: "mouse", label: "Mouse", wide: true, path: "M20 42 C-5 38 -3 4 20 4 C32 4 38 14 38 23 Q50 17 62 23 C62 12 70 4 82 4 C105 4 106 37 82 43 C94 67 78 96 50 96 C22 96 7 68 20 42Z" },
  { id: "bear", label: "Bear", wide: true, path: "M14 38 C-3 26 3 4 18 5 Q29 5 32 17 Q50 7 68 17 C76 -2 96 4 96 23 Q97 33 86 39 C95 61 91 91 79 96 H22 C9 94 5 63 14 38Z" },
  { id: "pebble", label: "Pebble", wide: true, path: "M5 35 C8 8 43 0 74 9 C103 16 106 47 85 67 C64 86 32 104 15 79 C5 66 0 49 5 35Z" },
  { id: "cloud", label: "Cloud", wide: true, path: "M4 42 C12 13 28 4 47 12 C66 20 77 0 86 16 C94 34 109 50 94 73 C82 94 66 80 55 81 C39 83 28 100 13 86 C0 75 -2 61 4 42Z" },
  { id: "organic", label: "Organic", wide: false, path: "M48 3 C69 -1 67 18 81 22 C105 30 86 47 87 62 C96 83 76 98 51 97 C26 98 3 84 8 66 C12 48 30 39 31 24 C32 12 36 5 48 3Z" },
  { id: "wave", label: "Wave", wide: false, path: "M30 3 H72 C99 3 97 18 87 25 C76 34 99 38 91 51 C79 64 100 69 89 81 C100 97 77 98 69 98 H30 C4 98 3 88 14 79 C25 69 2 64 13 52 C24 39 1 35 13 24 C2 11 5 3 30 3Z" },
  { id: "ribbon", label: "Ribbon", wide: false, path: "M42 3 C66 -5 82 7 80 24 C74 41 99 48 91 63 C86 72 76 77 81 91 C83 99 20 102 12 91 C2 75 28 64 21 52 C-2 35 24 26 28 17 C29 10 31 6 42 3Z" },
  { id: "crest", label: "Crest", wide: false, path: "M8 15 C11 8 29 11 38 6 Q50 -2 62 6 C75 12 90 8 94 16 C99 30 85 42 92 60 C99 74 91 83 94 91 Q96 98 82 98 H18 Q3 98 7 89 C16 67 4 59 10 44 C16 30 2 22 8 15Z" },
  { id: "asymmetric", label: "Asymmetric", wide: false, path: "M5 3 H52 Q95 3 95 28 V97 H48 Q5 97 5 73Z" },
  { id: "scallop", label: "Scallop", wide: false, path: "M5 12 Q5 -1 22 5 Q33 12 44 5 Q55 -1 65 5 Q76 12 87 5 Q95 1 95 12 V77 Q95 97 73 97 H27 Q5 97 5 77Z" },
  { id: "drop", label: "Teardrop", wide: false, path: "M50 2 C39 22 5 49 5 65 C5 108 95 108 95 65 C95 49 61 22 50 2Z" },
  { id: "teddy", label: "Teddy", wide: false, path: "M15 29 C-4 23 0 12 17 13 Q28 12 31 7 Q44 1 62 6 C72 -4 91 2 86 13 C102 23 96 33 85 38 C77 43 97 48 96 58 Q97 65 85 66 V88 Q85 98 70 98 H30 Q14 98 14 88 V68 C-2 65 1 54 13 47 Q22 41 15 29Z" },
  { id: "round", label: "Round", wide: true, path: "M50 3 A47 47 0 1 1 49.99 3Z" },
  { id: "arch", label: "Arch", wide: false, path: "M5 97 V43 A45 40 0 0 1 95 43 V97Z" },
] as const;
