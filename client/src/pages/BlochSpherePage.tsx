import { useState, useCallback, useRef, useEffect } from "react";
import { HelpCircle, X, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import BlochSphereCanvas from "@/components/BlochSphere";
import ControlPanel from "@/components/ControlPanel";
import {
  type QuaternionState,
  type RotationOp,
  identityQuat,
  applyRotation,
  quatToBloch,
  formatAngle,
} from "@/lib/quantum";
import { trackToolLaunch, trackRotation, trackPresetClick } from "@/lib/analytics";

const ANIM_DURATION_MS = 400;

function animateRotation(
  axis: "x" | "y" | "z",
  totalAngle: number,
  duration: number,
  onStep: (delta: number) => void,
  onProgress?: (applied: number) => void,
): Promise<void> {
  return new Promise(resolve => {
    let applied = 0;
    let startTime: number | null = null;
    const step = (time: number) => {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const target = totalAngle * eased;
      const delta = target - applied;
      if (Math.abs(delta) > 1e-10) {
        onStep(delta);
      }
      applied = target;
      onProgress?.(applied);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        const remainder = totalAngle - applied;
        if (Math.abs(remainder) > 1e-10) {
          onStep(remainder);
        }
        resolve();
      }
    };
    requestAnimationFrame(step);
  });
}

const BLOCH_STORAGE_KEY = "blochSphere:state";

function loadBlochState(): {
  quatState: QuaternionState;
  history: RotationOp[];
  crankOffsets: { x: number; y: number; z: number };
} | null {
  try {
    const raw = sessionStorage.getItem(BLOCH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.quatState === "object" &&
      Array.isArray(parsed.history) &&
      typeof parsed.crankOffsets === "object"
    ) {
      return parsed;
    }
  } catch {
    // ignore corrupt data
  }
  return null;
}

export default function BlochSpherePage() {
  useEffect(() => {
    document.title = "Bloch Sphere Explorer | One Million Qubits";
    trackToolLaunch("bloch-sphere");
  }, []);

  const saved = useRef(loadBlochState());

  const [quatState, setQuatState] = useState<QuaternionState>(
    saved.current?.quatState ?? identityQuat()
  );
  const [history, setHistory] = useState<RotationOp[]>(
    saved.current?.history ?? []
  );
  const [activeRotation, setActiveRotation] = useState<{ axis: "x" | "y" | "z"; angle: number } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [crankOffsets, setCrankOffsets] = useState(
    saved.current?.crankOffsets ?? { x: 0, y: 0, z: 0 }
  );
  const accumRef = useRef({ x: 0, y: 0, z: 0 });

  // Persist state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(
      BLOCH_STORAGE_KEY,
      JSON.stringify({ quatState, history, crankOffsets })
    );
  }, [quatState, history, crankOffsets]);

  const coords = quatToBloch(quatState);

  const handleCrankRotate = useCallback((axis: "x" | "y" | "z", angle: number) => {
    setQuatState(prev => applyRotation(prev, axis, angle));
    accumRef.current[axis] += angle;
    setActiveRotation({ axis, angle: accumRef.current[axis] });
  }, []);

  const handleCrankRotateEnd = useCallback((axis: "x" | "y" | "z", totalAngle: number) => {
    const label = `R${axis}(${formatAngle(totalAngle)})`;
    setHistory(prev => [...prev, { axis, angle: totalAngle, label }]);
    setCrankOffsets(prev => ({ ...prev, [axis]: prev[axis] + totalAngle }));
    setActiveRotation(null);
    accumRef.current[axis] = 0;
    trackRotation(axis, totalAngle);
  }, []);

  const handlePresetRotate = useCallback((axis: "x" | "y" | "z", angle: number, label: string) => {
    if (isAnimating) return;
    setIsAnimating(true);
    trackPresetClick(label);
    setActiveRotation({ axis, angle: 0 });
    const startOffset = crankOffsets[axis];
    animateRotation(
      axis, angle, ANIM_DURATION_MS,
      (delta) => setQuatState(prev => applyRotation(prev, axis, delta)),
      (applied) => {
        setActiveRotation({ axis, angle: applied });
        setCrankOffsets(prev => ({ ...prev, [axis]: startOffset + applied }));
      },
    ).then(() => {
      setActiveRotation(null);
      setCrankOffsets(prev => ({ ...prev, [axis]: startOffset + angle }));
      setHistory(prev => [...prev, { axis, angle, label }]);
      setIsAnimating(false);
    });
  }, [isAnimating, crankOffsets]);

  const handleReset = useCallback(() => {
    setQuatState(identityQuat());
    setHistory([]);
    setActiveRotation(null);
    setResetKey(k => k + 1);
    accumRef.current = { x: 0, y: 0, z: 0 };
    setCrankOffsets({ x: 0, y: 0, z: 0 });
    setIsAnimating(false);
    sessionStorage.removeItem(BLOCH_STORAGE_KEY);
    sessionStorage.removeItem("blochSphere:camera");
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleApplySequence = useCallback((ops: RotationOp[]) => {
    if (isAnimating) return;
    setIsAnimating(true);
    (async () => {
      for (const op of ops) {
        const startOffset = crankOffsets[op.axis];
        setActiveRotation({ axis: op.axis, angle: 0 });
        await animateRotation(
          op.axis, op.angle, ANIM_DURATION_MS,
          (delta) => setQuatState(prev => applyRotation(prev, op.axis, delta)),
          (applied) => {
            setActiveRotation({ axis: op.axis, angle: applied });
            setCrankOffsets(prev => ({ ...prev, [op.axis]: startOffset + applied }));
          },
        );
        setCrankOffsets(prev => ({ ...prev, [op.axis]: startOffset + op.angle }));
        setActiveRotation(null);
        setHistory(prev => [...prev, op]);
        await new Promise(r => setTimeout(r, 100));
      }
      setIsAnimating(false);
    })();
  }, [isAnimating, crankOffsets]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-card/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <h1 className="text-sm font-bold tracking-tight" data-testid="text-title">Bloch Sphere Explorer</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={handleReset} data-testid="button-reset">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHelp(s => !s)}
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
            className="absolute top-1.5 right-2 text-muted-foreground/60 hover-elevate rounded-sm p-0.5"
            data-testid="button-close-help"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-semibold text-xs text-foreground mb-0.5">How to use</p>
          <p>Drag the cranks to apply Rx, Ry, Rz rotations. Use preset angle buttons for exact quantum gate angles.</p>
          <p>Try the "Gates" tab for gate decompositions like H = Rz(&pi;/2) Rx(&pi;/2) Rz(&pi;/2). Scroll or pinch to zoom the sphere.</p>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        <div className="h-[40vh] min-h-[250px] lg:flex-1 lg:h-auto lg:min-h-0 relative flex-shrink-0">
          <div className="absolute inset-0">
            <BlochSphereCanvas coords={coords} activeRotation={activeRotation} />
          </div>
        </div>

        <div className="flex-1 lg:flex-none lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border bg-card/50 overflow-y-auto min-h-0">
          <ControlPanel
            coords={coords}
            history={history}
            onRotate={handleCrankRotate}
            onRotateEnd={handleCrankRotateEnd}
            onPresetRotate={handlePresetRotate}
            onReset={handleReset}
            onClearHistory={handleClearHistory}
            onApplySequence={handleApplySequence}
            resetKey={resetKey}
            crankOffsets={crankOffsets}
          />
        </div>
      </div>
    </div>
  );
}
