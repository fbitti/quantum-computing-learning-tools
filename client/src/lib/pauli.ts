export type Complex = { re: number; im: number };
export type Matrix4x4 = Complex[][];
export type PauliLabel = "I" | "X" | "Y" | "Z";
export type PhaseLabel = "+1" | "-1" | "+i" | "-i";

const PAULI_MATRICES: Record<PauliLabel, Complex[][]> = {
  I: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: 1, im: 0 }],
  ],
  X: [
    [{ re: 0, im: 0 }, { re: 1, im: 0 }],
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
  ],
  Y: [
    [{ re: 0, im: 0 }, { re: 0, im: -1 }],
    [{ re: 0, im: 1 }, { re: 0, im: 0 }],
  ],
  Z: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: -1, im: 0 }],
  ],
};

const PHASE_VALUES: Record<PhaseLabel, Complex> = {
  "+1": { re: 1, im: 0 },
  "-1": { re: -1, im: 0 },
  "+i": { re: 0, im: 1 },
  "-i": { re: 0, im: -1 },
};

function cMul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

export function kronecker(a: Complex[][], b: Complex[][]): Matrix4x4 {
  const result: Matrix4x4 = [];
  for (let i = 0; i < 2; i++) {
    for (let k = 0; k < 2; k++) {
      const row: Complex[] = [];
      for (let j = 0; j < 2; j++) {
        for (let l = 0; l < 2; l++) {
          row.push(cMul(a[i][j], b[k][l]));
        }
      }
      result.push(row);
    }
  }
  return result;
}

export function buildMatrix(
  p1: PauliLabel,
  p0: PauliLabel,
  phase: PhaseLabel = "+1"
): Matrix4x4 {
  const kron = kronecker(PAULI_MATRICES[p1], PAULI_MATRICES[p0]);
  const ph = PHASE_VALUES[phase];
  return kron.map((row) => row.map((c) => cMul(ph, c)));
}

export function isZero(c: Complex): boolean {
  return Math.abs(c.re) < 1e-9 && Math.abs(c.im) < 1e-9;
}

export function formatComplex(c: Complex): string {
  const re = Math.round(c.re);
  const im = Math.round(c.im);
  if (re === 0 && im === 0) return "";
  if (im === 0) return re.toString();
  if (re === 0) {
    if (im === 1) return "i";
    if (im === -1) return "-i";
    return `${im}i`;
  }
  const sign = im > 0 ? "+" : "-";
  const absIm = Math.abs(im);
  const imStr = absIm === 1 ? "i" : `${absIm}i`;
  return `${re}${sign}${imStr}`;
}

const PAULI_LABELS: PauliLabel[] = ["I", "X", "Y", "Z"];
const PHASE_LABELS: PhaseLabel[] = ["+1", "-1", "+i", "-i"];

export function randomChallenge(includePhases: boolean): {
  p1: PauliLabel;
  p0: PauliLabel;
  phase: PhaseLabel;
  matrix: Matrix4x4;
} {
  const p1 = PAULI_LABELS[Math.floor(Math.random() * 4)];
  const p0 = PAULI_LABELS[Math.floor(Math.random() * 4)];
  const phase: PhaseLabel = includePhases
    ? PHASE_LABELS[Math.floor(Math.random() * 4)]
    : "+1";
  return { p1, p0, phase, matrix: buildMatrix(p1, p0, phase) };
}

const PAULI_DESCRIPTIONS: Record<PauliLabel, string> = {
  I: "no operation (identity)",
  X: "a bit flip",
  Y: "a bit and phase flip",
  Z: "a phase flip",
};

export function buildExplanation(
  correctP1: PauliLabel,
  correctP0: PauliLabel,
  correctPhase: PhaseLabel,
  guessP1: PauliLabel,
  guessP0: PauliLabel,
  guessPhase: PhaseLabel
): string {
  const parts: string[] = [];

  if (guessP1 !== correctP1) {
    parts.push(
      `Qubit 1 has ${PAULI_DESCRIPTIONS[correctP1]} (${correctP1}), not ${PAULI_DESCRIPTIONS[guessP1]} (${guessP1}).`
    );
  }
  if (guessP0 !== correctP0) {
    parts.push(
      `Qubit 0 has ${PAULI_DESCRIPTIONS[correctP0]} (${correctP0}), not ${PAULI_DESCRIPTIONS[guessP0]} (${guessP0}).`
    );
  }
  if (guessPhase !== correctPhase) {
    parts.push(
      `The global phase is ${correctPhase}, not ${guessPhase}.`
    );
  }

  if (parts.length === 0) return "Correct!";
  return parts.join(" ");
}

export { PAULI_LABELS, PHASE_LABELS };
