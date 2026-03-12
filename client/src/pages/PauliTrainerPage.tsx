import { useState, useCallback, useEffect, useRef } from "react";
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
  buildMatrix,
  buildExplanation,
  formatComplex,
  isZero,
  PAULI_LABELS,
} from "@/lib/pauli";
import { trackToolLaunch, trackPauliCheck } from "@/lib/analytics";

const BASIS_LABELS = ["\u222300\u27e9", "\u222301\u27e9", "\u222310\u27e9", "\u222311\u27e9"];

function MatrixDisplay({
  matrix,
  highlight,
}: {
  matrix: Matrix4x4;
  highlight?: { p1Wrong: boolean; p0Wrong: boolean };
}) {
  const quadrant = (r: number, c: number) => {
    if (r < 2 && c < 2) return "TL";
    if (r < 2 && c >= 2) return "TR";
    if (r >= 2 && c < 2) return "BL";
    return "BR";
  };

  return (
    <div className="flex flex-col gap-0 w-fit mx-auto" data-testid="matrix-display">
      {/* Column basis labels */}
      <div className="flex gap-1 mb-1">
        {BASIS_LABELS.map((label, c) => (
          <div
            key={`col-${c}`}
            className={`w-14 sm:w-16 text-center text-[10px] font-mono text-muted-foreground ${c === 2 ? "ml-2" : ""}`}
          >
            {label}
          </div>
        ))}
      </div>
      {/* Matrix rows with row basis labels on the right */}
      {[0, 1, 2, 3].map((r) => (
        <div key={r} className={`flex gap-1 items-center ${r === 2 ? "mt-2" : r > 0 ? "mt-1" : ""}`}>
          {[0, 1, 2, 3].map((c) => {
            const cell = matrix[r][c];
            const nonZero = !isZero(cell);
            const showHL = highlight && nonZero;
            let hlClass = "";
            if (showHL) {
              hlClass = "bg-primary/15 border-primary/40";
            }
            const q = quadrant(r, c);
            const quadrantLabel =
              q === "TL" ? "Q\u2081" : q === "TR" ? "Q\u2082" : q === "BL" ? "Q\u2083" : "Q\u2084";
            return (
              <div
                key={`${r}-${c}`}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-md border flex items-center justify-center text-sm font-mono font-semibold ${
                  hlClass || "border-border bg-card"
                } ${c === 2 ? "ml-2" : ""}`}
                data-testid={`matrix-cell-${r}-${c}`}
                title={`${quadrantLabel} [${r},${c}]`}
              >
                {nonZero && <span>{formatComplex(cell)}</span>}
              </div>
            );
          })}
          {/* Row basis label on the right */}
          <div className="w-10 sm:w-12 text-left text-[10px] font-mono text-muted-foreground pl-1 flex-shrink-0">
            {BASIS_LABELS[r]}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Human-readable 2×2 matrix strings for each Pauli gate. */
const PAULI_MATRIX_DISPLAY: Record<PauliLabel, string> = {
  I: "[1, 0]\n[0, 1]",
  X: "[0, 1]\n[1, 0]",
  Y: "[0, -i]\n[i, \u20020]",
  Z: "[1, \u20020]\n[0, -1]",
};

function PauliGateButton({
  gate,
  selected,
  onSelect,
  testId,
}: {
  gate: PauliLabel;
  selected: boolean;
  onSelect: () => void;
  testId: string;
}) {
  const [showMatrix, setShowMatrix] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startReveal = useCallback(() => {
    timerRef.current = setTimeout(() => setShowMatrix(true), 800);
  }, []);

  const cancelReveal = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setShowMatrix(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className="relative">
      <Button
        variant={selected ? "default" : "outline"}
        size="sm"
        className="w-12 font-mono font-bold"
        onClick={onSelect}
        onMouseEnter={startReveal}
        onMouseLeave={cancelReveal}
        onTouchStart={startReveal}
        onTouchEnd={cancelReveal}
        data-testid={testId}
      >
        {gate}
      </Button>
      {showMatrix && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-popover border border-border rounded-md shadow-lg px-3 py-2 z-50 whitespace-pre font-mono text-xs leading-relaxed pointer-events-none">
          <span className="block text-center text-[10px] text-muted-foreground mb-1 font-sans">{gate} gate</span>
          {PAULI_MATRIX_DISPLAY[gate]}
        </div>
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
          <PauliGateButton
            key={p}
            gate={p}
            selected={selected === p}
            onSelect={() => onSelect(p)}
            testId={`${testIdPrefix}-${p}`}
          />
        ))}
      </div>
    </div>
  );
}


export default function PauliTrainerPage() {
  useEffect(() => {
    document.title = "Pauli Trainer | One Million Qubits";
    trackToolLaunch("pauli-trainer");
  }, []);

  const [includePhases, setIncludePhases] = useState(() => {
    return sessionStorage.getItem("pauliTrainer:includePhases") === "true";
  });
  const [challenge, setChallenge] = useState(() =>
    randomChallenge(sessionStorage.getItem("pauliTrainer:includePhases") === "true")
  );
  const [guessP1, setGuessP1] = useState<PauliLabel | null>(null);
  const [guessP0, setGuessP0] = useState<PauliLabel | null>(null);
  const [guessSign, setGuessSign] = useState<"+" | "-">("+" );
  const [guessImag, setGuessImag] = useState(false);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  // When the user changes any selection after a wrong answer, reset to allow re-checking
  const resetIfWrong = useCallback(() => {
    if (checked && !correct) {
      setChecked(false);
      setShowAnswer(false);
      setExplanation("");
    }
  }, [checked, correct]);
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
    trackPauliCheck(isCorrect);
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
    setShowAnswer(false);
  }, [includePhases]);

  const handleTogglePhases = useCallback(
    (on: boolean) => {
      setIncludePhases(on);
      sessionStorage.setItem("pauliTrainer:includePhases", String(on));
      if (!on) {
        // When turning phases off, rebuild challenge with phase +1 but keep same p1/p0
        setChallenge((prev) => ({
          ...prev,
          phase: "+1" as PhaseLabel,
          matrix: buildMatrix(prev.p1, prev.p0, "+1"),
        }));
        setGuessSign("+");
        setGuessImag(false);
      }
      // When turning phases on, keep the current challenge (phase is already +1)
      // Don't reset guesses or checked state — the challenge stays the same
    },
    []
  );

  const canCheck = guessP1 !== null && guessP0 !== null && !checked;
  const canRecheck = checked && !correct;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[#1D2755]/50 bg-[#0B1020]/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <h1 className="text-sm font-heading font-bold tracking-tight text-[#F8FAFC]" data-testid="text-title">
            Pauli Trainer
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94A3B8] font-sans" data-testid="text-score">
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
        <div className="bg-[#111827]/80 border-b border-[#1D2755]/50 px-3 py-2 text-[11px] text-[#94A3B8] flex-shrink-0 relative font-sans">
          <button
            onClick={() => setShowHelp(false)}
            className="absolute top-1.5 right-2 text-[#94A3B8]/60 hover:text-[#F8FAFC] rounded-sm p-0.5"
            data-testid="button-close-help"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-semibold text-xs text-[#F8FAFC] mb-0.5 font-heading">How to use</p>
          <p>
            A 4×4 matrix is shown for a two-qubit Pauli operator of the form q1 ⊗ q0. Your task is to identify which Pauli gate acts on each qubit.
          </p>
          <p>The left factor acts on qubit 1, and the right factor acts on qubit 0.</p>
          <p>
            Remember: I = identity, X = bit flip, Y = bit flip with phase, Z = phase flip.
          </p>
          <p>
            Turn on Global Phases to include overall factors ±1 and ±i multiplying the entire operator.
          </p>
          <p>Hover or long-press a gate button to see its matrix.</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <MatrixDisplay
              matrix={challenge.matrix}
              highlight={
                checked && !correct
                  ? {
                      p1Wrong: guessP1 !== challenge.p1,
                      p0Wrong: guessP0 !== challenge.p0,
                    }
                  : undefined
              }
            />
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
              <h2 className="text-base font-heading font-semibold mb-1 text-[#F8FAFC]" data-testid="text-identify">
                Identify the Operator
              </h2>
              <p className="text-xs text-[#94A3B8] font-sans">
                Select the combination for <span className="text-[#7C3AED] font-medium">q1</span> and{" "}
                <span className="text-[#7C3AED] font-medium">q0</span>
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
                            resetIfWrong();
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
              label="QUBIT 1 (LEFT)"
              selected={guessP1}
              onSelect={(p) => { setGuessP1(p); resetIfWrong(); }}
              testIdPrefix="q1"
            />

            <div className="flex justify-center">
              <span className="text-muted-foreground/40 text-3xl font-bold">⊗</span>
            </div>

            <PauliSelector
              label="QUBIT 0 (RIGHT)"
              selected={guessP0}
              onSelect={(p) => { setGuessP0(p); resetIfWrong(); }}
              testIdPrefix="q0"
            />

            {!checked ? (
              <Button
                className="w-full mt-2"
                disabled={!canCheck}
                onClick={handleCheck}
                data-testid="button-check"
              >
                Check
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
                  Next
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2"
                  data-testid="feedback-incorrect"
                >
                  <p className="text-sm font-semibold text-destructive mb-1">Not quite</p>
                  {showAnswer ? (
                    <p className="text-xs text-muted-foreground">{explanation}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Try again or check the answer below.</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {!showAnswer && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowAnswer(true)}
                      data-testid="button-show-answer"
                    >
                      Explain
                    </Button>
                  )}
                  <Button className="flex-1" onClick={handleNext} data-testid="button-next">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
