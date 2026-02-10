import { useState, useCallback, useRef } from "react";
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

export default function BlochSpherePage() {
  const [quatState, setQuatState] = useState<QuaternionState>(identityQuat());
  const [history, setHistory] = useState<RotationOp[]>([]);
  const [activeRotation, setActiveRotation] = useState<{ axis: "x" | "y" | "z"; angle: number } | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const accumRef = useRef({ x: 0, y: 0, z: 0 });

  const coords = quatToBloch(quatState);

  const handleCrankRotate = useCallback((axis: "x" | "y" | "z", angle: number) => {
    setQuatState(prev => applyRotation(prev, axis, angle));
    accumRef.current[axis] += angle;
    setActiveRotation({ axis, angle: accumRef.current[axis] });
  }, []);

  const handleCrankRotateEnd = useCallback((axis: "x" | "y" | "z", totalAngle: number) => {
    const axisLabel = axis.toUpperCase();
    const label = `R${axis}(${formatAngle(totalAngle)})`;
    setHistory(prev => [...prev, { axis, angle: totalAngle, label }]);
    setActiveRotation(null);
    accumRef.current[axis] = 0;
  }, []);

  const handlePresetRotate = useCallback((axis: "x" | "y" | "z", angle: number, label: string) => {
    setQuatState(prev => applyRotation(prev, axis, angle));
    setHistory(prev => [...prev, { axis, angle, label }]);
    setActiveRotation({ axis, angle });
    setTimeout(() => setActiveRotation(null), 600);
  }, []);

  const handleReset = useCallback(() => {
    setQuatState(identityQuat());
    setHistory([]);
    setActiveRotation(null);
    setResetKey(k => k + 1);
    accumRef.current = { x: 0, y: 0, z: 0 };
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleApplySequence = useCallback((ops: RotationOp[]) => {
    setQuatState(prev => {
      let state = prev;
      for (const op of ops) {
        state = applyRotation(state, op.axis, op.angle);
      }
      return state;
    });
    setHistory(prev => [...prev, ...ops]);
    if (ops.length > 0) {
      const lastOp = ops[ops.length - 1];
      setActiveRotation({ axis: lastOp.axis, angle: lastOp.angle });
      setTimeout(() => setActiveRotation(null), 800);
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-background overflow-hidden">
      <div className="flex-1 relative min-h-[400px] lg:min-h-0">
        <div className="absolute inset-0">
          <BlochSphereCanvas coords={coords} activeRotation={activeRotation} />
        </div>

        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1.5 pointer-events-none">
          <span className="text-xs font-mono text-muted-foreground">
            |&psi;&rang; = ({fixNegZero(coords.x.toFixed(2))}, {fixNegZero(coords.y.toFixed(2))}, {fixNegZero(coords.z.toFixed(2))})
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 lg:right-auto max-w-sm">
          <div className="bg-background/80 backdrop-blur-sm rounded-md px-3 py-2 text-[10px] text-muted-foreground space-y-0.5">
            <p className="font-semibold text-xs text-foreground mb-1">How to use</p>
            <p>Drag the cranks on the right to apply Rx, Ry, Rz rotations.</p>
            <p>Use preset angle buttons for exact quantum gate angles.</p>
            <p>Try the "Gates" tab to see gate decompositions like H = Rz(&pi;/2) Rx(&pi;/2) Rz(&pi;/2).</p>
            <p>Scroll or pinch to zoom. Drag the sphere background to orbit the camera.</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border bg-card/50 overflow-y-auto flex-shrink-0">
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
