import { useState, useCallback, useRef } from "react";
import { HelpCircle, X } from "lucide-react";
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

function fixNegZero(s: string): string {
  return s === "-0.000" || s === "-0.00" || s === "-0.0" || s === "-0" ? s.slice(1) : s;
}

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

export default function BlochSpherePage() {
  const [quatState, setQuatState] = useState<QuaternionState>(identityQuat());
  const [history, setHistory] = useState<RotationOp[]>([]);
  const [activeRotation, setActiveRotation] = useState<{ axis: "x" | "y" | "z"; angle: number } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const accumRef = useRef({ x: 0, y: 0, z: 0 });

  const coords = quatToBloch(quatState);

  const handleCrankRotate = useCallback((axis: "x" | "y" | "z", angle: number) => {
    setQuatState(prev => applyRotation(prev, axis, angle));
    accumRef.current[axis] += angle;
    setActiveRotation({ axis, angle: accumRef.current[axis] });
  }, []);

  const handleCrankRotateEnd = useCallback((axis: "x" | "y" | "z", totalAngle: number) => {
    const label = `R${axis}(${formatAngle(totalAngle)})`;
    setHistory(prev => [...prev, { axis, angle: totalAngle, label }]);
    setActiveRotation(null);
    accumRef.current[axis] = 0;
  }, []);

  const handlePresetRotate = useCallback((axis: "x" | "y" | "z", angle: number, label: string) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveRotation({ axis, angle: 0 });
    animateRotation(
      axis, angle, ANIM_DURATION_MS,
      (delta) => setQuatState(prev => applyRotation(prev, axis, delta)),
      (applied) => setActiveRotation({ axis, angle: applied }),
    ).then(() => {
      setActiveRotation(null);
      setHistory(prev => [...prev, { axis, angle, label }]);
      setIsAnimating(false);
    });
  }, [isAnimating]);

  const handleReset = useCallback(() => {
    setQuatState(identityQuat());
    setHistory([]);
    setActiveRotation(null);
    setResetKey(k => k + 1);
    accumRef.current = { x: 0, y: 0, z: 0 };
    setIsAnimating(false);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleApplySequence = useCallback((ops: RotationOp[]) => {
    if (isAnimating) return;
    setIsAnimating(true);
    (async () => {
      for (const op of ops) {
        setActiveRotation({ axis: op.axis, angle: 0 });
        await animateRotation(
          op.axis, op.angle, ANIM_DURATION_MS,
          (delta) => setQuatState(prev => applyRotation(prev, op.axis, delta)),
          (applied) => setActiveRotation({ axis: op.axis, angle: applied }),
        );
        setActiveRotation(null);
        setHistory(prev => [...prev, op]);
        await new Promise(r => setTimeout(r, 100));
      }
      setIsAnimating(false);
    })();
  }, [isAnimating]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen w-full bg-background lg:overflow-hidden overflow-y-auto">
      <div className="relative h-[50vh] min-h-[350px] lg:flex-1 lg:h-auto lg:min-h-0 flex-shrink-0">
        <div className="absolute inset-0">
          <BlochSphereCanvas coords={coords} activeRotation={activeRotation} />
        </div>

        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1.5 pointer-events-none">
          <span className="text-xs font-mono text-muted-foreground">
            |&psi;&rang; = ({fixNegZero(coords.x.toFixed(2))}, {fixNegZero(coords.y.toFixed(2))}, {fixNegZero(coords.z.toFixed(2))})
          </span>
        </div>

        {showHelp ? (
          <div className="absolute bottom-4 left-4 right-4 lg:right-auto max-w-sm">
            <div className="bg-background/80 backdrop-blur-sm rounded-md px-3 py-2 text-[10px] text-muted-foreground space-y-0.5 relative">
              <button
                onClick={() => setShowHelp(false)}
                className="absolute top-1.5 right-1.5 text-muted-foreground/60 hover-elevate rounded-sm p-0.5"
                data-testid="button-close-help"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <p className="font-semibold text-xs text-foreground mb-1">How to use</p>
              <p>Drag the cranks on the right to apply Rx, Ry, Rz rotations.</p>
              <p>Use preset angle buttons for exact quantum gate angles.</p>
              <p>Try the "Gates" tab to see gate decompositions like H = Rz(&pi;/2) Rx(&pi;/2) Rz(&pi;/2).</p>
              <p>Scroll or pinch to zoom. Drag the sphere background to orbit the camera.</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowHelp(true)}
            className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-md p-1.5 text-muted-foreground hover-elevate"
            data-testid="button-show-help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border bg-card/50 lg:overflow-y-auto flex-shrink-0">
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
        />
      </div>
    </div>
  );
}
