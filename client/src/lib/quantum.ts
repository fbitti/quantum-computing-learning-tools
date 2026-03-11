export interface QuaternionState {
  w: number;
  x: number;
  y: number;
  z: number;
}

export interface BlochCoords {
  theta: number;
  phi: number;
  x: number;
  y: number;
  z: number;
}

export interface RotationOp {
  axis: "x" | "y" | "z";
  angle: number;
  label: string;
}

export const PRESET_ANGLES = [
  { label: "π", value: Math.PI },
  { label: "π/2", value: Math.PI / 2 },
  { label: "π/3", value: Math.PI / 3 },
  { label: "π/4", value: Math.PI / 4 },
  { label: "π/6", value: Math.PI / 6 },
  { label: "π/8", value: Math.PI / 8 },
  { label: "-π", value: -Math.PI },
  { label: "-π/2", value: -Math.PI / 2 },
  { label: "-π/3", value: -Math.PI / 3 },
  { label: "-π/4", value: -Math.PI / 4 },
  { label: "-π/6", value: -Math.PI / 6 },
  { label: "-π/8", value: -Math.PI / 8 },
] as const;

export function identityQuat(): QuaternionState {
  return { w: 1, x: 0, y: 0, z: 0 };
}

export function multiplyQuat(a: QuaternionState, b: QuaternionState): QuaternionState {
  return {
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
  };
}

export function normalizeQuat(q: QuaternionState): QuaternionState {
  const len = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
  if (len < 1e-10) return identityQuat();
  return { w: q.w / len, x: q.x / len, y: q.y / len, z: q.z / len };
}

export function rotationQuat(axis: "x" | "y" | "z", angle: number): QuaternionState {
  const halfAngle = angle / 2;
  const s = Math.sin(halfAngle);
  const c = Math.cos(halfAngle);
  switch (axis) {
    case "x": return { w: c, x: s, y: 0, z: 0 };
    case "y": return { w: c, x: 0, y: s, z: 0 };
    case "z": return { w: c, x: 0, y: 0, z: s };
  }
}

export function applyRotation(state: QuaternionState, axis: "x" | "y" | "z", angle: number): QuaternionState {
  const rot = rotationQuat(axis, angle);
  return normalizeQuat(multiplyQuat(rot, state));
}

export function quatToBloch(q: QuaternionState): BlochCoords {
  const { w, x: qx, y: qy, z: qz } = normalizeQuat(q);

  const bx = 2 * (qx * qz + w * qy);
  const by = 2 * (qy * qz - w * qx);
  const bz = w * w + qz * qz - qx * qx - qy * qy;

  const len = Math.sqrt(bx * bx + by * by + bz * bz);
  const nx = len > 1e-10 ? bx / len : 0;
  const ny = len > 1e-10 ? by / len : 0;
  const nz = len > 1e-10 ? bz / len : 1;

  const theta = Math.acos(Math.max(-1, Math.min(1, nz)));
  // At the poles (theta ≈ 0 or π), phi is undefined on the Bloch sphere.
  // Rz rotations on |0⟩ or |1⟩ only add a global phase and should not
  // change the displayed phi. Force phi to 0 when sin(theta) is negligible.
  const sinTheta = Math.sin(theta);
  const phi = sinTheta > 1e-10 ? Math.atan2(ny, nx) : 0;

  return { theta, phi, x: nx, y: ny, z: nz };
}

export function blochToKet(coords: BlochCoords): { alpha: [number, number]; beta: [number, number] } {
  const { theta, phi } = coords;
  const alphaReal = Math.cos(theta / 2);
  const alphaImag = 0;
  const betaReal = Math.sin(theta / 2) * Math.cos(phi);
  const betaImag = Math.sin(theta / 2) * Math.sin(phi);
  return {
    alpha: [alphaReal, alphaImag],
    beta: [betaReal, betaImag],
  };
}

export function formatComplex(re: number, im: number): string {
  const threshold = 1e-6;
  const absRe = Math.abs(re);
  const absIm = Math.abs(im);

  if (absRe < threshold && absIm < threshold) return "0";
  if (absIm < threshold) return formatNum(re);
  if (absRe < threshold) {
    if (Math.abs(absIm - 1) < threshold) return im > 0 ? "i" : "-i";
    return `${formatNum(im)}i`;
  }

  const sign = im > 0 ? "+" : "-";
  if (Math.abs(absIm - 1) < threshold) return `${formatNum(re)}${sign}i`;
  return `${formatNum(re)}${sign}${formatNum(absIm)}i`;
}

function formatNum(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";

  const knownValues: [number, string][] = [
    [1, "1"],
    [0, "0"],
    [0.5, "1/2"],
    [Math.SQRT1_2, "1/√2"],
    [Math.sqrt(3) / 2, "√3/2"],
    [0.25, "1/4"],
    [Math.sqrt(3) / 3, "1/√3"],
  ];

  for (const [val, repr] of knownValues) {
    if (Math.abs(abs - val) < 1e-6) return `${sign}${repr}`;
  }

  return `${sign}${abs.toFixed(3)}`;
}

export function formatAngle(rad: number): string {
  const threshold = 1e-6;
  const absRad = Math.abs(rad);
  const sign = rad < 0 ? "-" : "";

  const fractions: [number, string][] = [
    [Math.PI, "π"],
    [Math.PI / 2, "π/2"],
    [Math.PI / 3, "π/3"],
    [Math.PI / 4, "π/4"],
    [Math.PI / 6, "π/6"],
    [Math.PI / 8, "π/8"],
    [2 * Math.PI / 3, "2π/3"],
    [3 * Math.PI / 4, "3π/4"],
    [3 * Math.PI / 2, "3π/2"],
    [2 * Math.PI, "2π"],
  ];

  if (absRad < threshold) return "0";

  for (const [val, repr] of fractions) {
    if (Math.abs(absRad - val) < threshold) return `${sign}${repr}`;
  }

  return `${sign}${absRad.toFixed(3)}`;
}

export const KNOWN_EQUIVALENCES = [
  {
    name: "Hadamard (H)",
    ops: [
      { axis: "z" as const, angle: Math.PI / 2, label: "Rz(π/2)" },
      { axis: "x" as const, angle: Math.PI / 2, label: "Rx(π/2)" },
      { axis: "z" as const, angle: Math.PI / 2, label: "Rz(π/2)" },
    ],
  },
  {
    name: "Pauli-X",
    ops: [
      { axis: "x" as const, angle: Math.PI, label: "Rx(π)" },
    ],
  },
  {
    name: "Pauli-Y",
    ops: [
      { axis: "y" as const, angle: Math.PI, label: "Ry(π)" },
    ],
  },
  {
    name: "Pauli-Z",
    ops: [
      { axis: "z" as const, angle: Math.PI, label: "Rz(π)" },
    ],
  },
  {
    name: "S gate (√Z)",
    ops: [
      { axis: "z" as const, angle: Math.PI / 2, label: "Rz(π/2)" },
    ],
  },
  {
    name: "T gate",
    ops: [
      { axis: "z" as const, angle: Math.PI / 4, label: "Rz(π/4)" },
    ],
  },
  {
    name: "X via Y,Z",
    ops: [
      { axis: "y" as const, angle: Math.PI / 2, label: "Ry(π/2)" },
      { axis: "z" as const, angle: Math.PI, label: "Rz(π)" },
      { axis: "y" as const, angle: -Math.PI / 2, label: "Ry(-π/2)" },
    ],
  },
];
