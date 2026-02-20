import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, HelpCircle, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  type PauliLabel,
  type PhaseLabel,
  type Matrix4x4,
  randomChallenge,
  buildExplanation,
  formatComplex,
  isZero,
  PAULI_LABELS,
} from "@/lib/pauli";

function MatrixDisplay({ matrix }: { matrix: Matrix4x4 }) {
  return (
    <div className="grid grid-cols-4 gap-1 w-fit mx-auto" data-testid="matrix-display">
      {matrix.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-md border border-border bg-card flex items-center justify-center text-sm font-mono font-semibold"
            data-testid={`matrix-cell-${r}-${c}`}
          >
            {!isZero(cell) && (
              <span>{formatComplex(cell)}</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function PauliSelector({
  label,
  selected,
  onSelect,
  testIdPrefix,
}: {
  label: string;
  selected: PauliLabel | null;
  onSelect: (p: PauliLabel) => void;
  testIdPrefix: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-center text-primary" data-testid={`${testIdPrefix}-label`}>
        {label}
      </p>
      <div className="flex gap-2 justify-center">
        {PAULI_LABELS.map((p) => (
          <Button
            key={p}
            variant={selected === p ? "default" : "outline"}
            size="sm"
            className="w-12 font-mono font-bold"
            onClick={() => onSelect(p)}
            data-testid={`${testIdPrefix}-${p}`}
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  );
}


export default function PauliTrainerPage() {
  useEffect(() => {
    document.title = "Pauli Trainer | Quantum Computing Practice Tools";
  }, []);

  const [includePhases, setIncludePhases] = useState(false);
  const [challenge, setChallenge] = useState(() => randomChallenge(false));
  const [guessP1, setGuessP1] = useState<PauliLabel | null>(null);
  const [guessP0, setGuessP0] = useState<PauliLabel | null>(null);
  const [guessSign, setGuessSign] = useState<"+" | "-">("+" );
  const [guessImag, setGuessImag] = useState(false);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const getGuessPhase = useCallback((): PhaseLabel => {
    if (!includePhases) return "+1";
    if (guessSign === "+" && !guessImag) return "+1";
    if (guessSign === "-" && !guessImag) return "-1";
    if (guessSign === "+" && guessImag) return "+i";
    return "-i";
  }, [includePhases, guessSign, guessImag]);

  const handleCheck = useCallback(() => {
    if (!guessP1 || !guessP0) return;
    const guessPhase = getGuessPhase();
    const isCorrect =
      guessP1 === challenge.p1 &&
      guessP0 === challenge.p0 &&
      guessPhase === challenge.phase;
    setCorrect(isCorrect);
    setChecked(true);
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    if (!isCorrect) {
      setExplanation(
        buildExplanation(
          challenge.p1,
          challenge.p0,
          challenge.phase,
          guessP1,
          guessP0,
          guessPhase
        )
      );
    }
  }, [guessP1, guessP0, getGuessPhase, challenge]);

  const handleNext = useCallback(() => {
    setChallenge(randomChallenge(includePhases));
    setGuessP1(null);
    setGuessP0(null);
    setGuessSign("+");
    setGuessImag(false);
    setChecked(false);
    setCorrect(false);
    setExplanation("");
  }, [includePhases]);

  const handleTogglePhases = useCallback(
    (on: boolean) => {
      setIncludePhases(on);
      setChallenge(randomChallenge(on));
      setGuessP1(null);
      setGuessP0(null);
      setGuessSign("+");
      setGuessImag(false);
      setChecked(false);
      setCorrect(false);
      setExplanation("");
    },
    []
  );

  const canCheck = guessP1 !== null && guessP0 !== null && !checked;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-card/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <h1 className="text-sm font-bold tracking-tight" data-testid="text-title">
            Pauli Trainer
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground" data-testid="text-score">
            {score.correct}/{score.total}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHelp((s) => !s)}
            data-testid="button-toggle-help"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showHelp && (
        <div className="bg-muted/60 border-b border-border px-3 py-2 text-[11px] text-muted-foreground flex-shrink-0 relative">
          <button
            onClick={() => setShowHelp(false)}
            className="absolute top-1.5 right-2 text-muted-foreground/60 rounded-sm p-0.5"
            data-testid="button-close-help"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-semibold text-xs text-foreground mb-0.5">How to use</p>
          <p>
            A 4×4 matrix is shown representing a two-qubit Pauli operator (P1 ⊗ P0).
            Identify which Pauli gate applies to each qubit.
          </p>
          <p>
            I = identity, X = bit flip, Y = bit & phase flip, Z = phase flip.
            Toggle "Global Phases" to include ±1, ±i phase factors.
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <MatrixDisplay matrix={challenge.matrix} />
            <div className="flex items-center gap-2">
              <Switch
                id="phase-toggle"
                checked={includePhases}
                onCheckedChange={handleTogglePhases}
                data-testid="switch-global-phases"
              />
              <Label htmlFor="phase-toggle" className="text-xs cursor-pointer">
                Global Phases
              </Label>
            </div>
          </div>

          <div className="flex flex-col gap-5 w-full max-w-xs mx-auto lg:mx-0">
            <div className="text-center">
              <h2 className="text-base font-semibold mb-1" data-testid="text-identify">
                Identify the Operator
              </h2>
              <p className="text-xs text-muted-foreground">
                Select the combination for <span className="text-primary font-medium">q1</span> and{" "}
                <span className="text-primary font-medium">q0</span>
              </p>
            </div>

            {includePhases && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-center text-muted-foreground">GLOBAL PHASE</p>
                <div className="flex gap-1 justify-center">
                  {(["+", "-"] as const).map((s) =>
                    [false, true].map((im) => {
                      const label = `${s}${im ? "i" : "1"}`;
                      const isSelected = guessSign === s && guessImag === im;
                      return (
                        <Button
                          key={label}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className="w-12 font-mono font-bold"
                          onClick={() => {
                            setGuessSign(s);
                            setGuessImag(im);
                          }}
                          data-testid={`phase-select-${label}`}
                        >
                          {s === "-" && !im ? "−1" : s === "-" && im ? "−i" : label}
                        </Button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            <PauliSelector
              label="QUBIT 1 (P1)"
              selected={guessP1}
              onSelect={setGuessP1}
              testIdPrefix="q1"
            />

            <div className="flex justify-center">
              <span className="text-muted-foreground/40 text-lg">⊗</span>
            </div>

            <PauliSelector
              label="QUBIT 0 (P0)"
              selected={guessP0}
              onSelect={setGuessP0}
              testIdPrefix="q0"
            />

            {!checked ? (
              <Button
                className="w-full mt-2"
                disabled={!canCheck}
                onClick={handleCheck}
                data-testid="button-check"
              >
                Check Answer
              </Button>
            ) : correct ? (
              <div className="space-y-3">
                <div
                  className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-center"
                  data-testid="feedback-correct"
                >
                  <p className="text-sm font-semibold text-green-600">Correct!</p>
                </div>
                <Button className="w-full" onClick={handleNext} data-testid="button-next">
                  Next Challenge
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2"
                  data-testid="feedback-incorrect"
                >
                  <p className="text-sm font-semibold text-destructive mb-1">Not quite</p>
                  <p className="text-xs text-muted-foreground">{explanation}</p>
                </div>
                <Button className="w-full" onClick={handleNext} data-testid="button-next">
                  Next Challenge
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
