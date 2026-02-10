import { useRef, useState, useCallback, useEffect } from "react";
import { RotateCw } from "lucide-react";
import { formatAngle } from "@/lib/quantum";

interface CrankControlProps {
  axis: "x" | "y" | "z";
  color: string;
  onRotate: (angle: number) => void;
  onRotateEnd: (totalAngle: number) => void;
  label: string;
  resetKey?: number;
}

export default function CrankControl({ axis, color, onRotate, onRotateEnd, label, resetKey = 0 }: CrankControlProps) {
  const crankRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [crankAngle, setCrankAngle] = useState(0);
  const lastAngleRef = useRef(0);
  const accumulatedRef = useRef(0);
  useEffect(() => {
    setCrankAngle(0);
    accumulatedRef.current = 0;
  }, [resetKey]);

  const getCrankAngle = useCallback((clientX: number, clientY: number) => {
    if (!crankRef.current) return 0;
    const rect = crankRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    lastAngleRef.current = getCrankAngle(e.clientX, e.clientY);
    accumulatedRef.current = 0;
  }, [getCrankAngle]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentAngle = getCrankAngle(e.clientX, e.clientY);
    let delta = currentAngle - lastAngleRef.current;

    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;

    accumulatedRef.current += delta;
    setCrankAngle(prev => prev + delta);
    lastAngleRef.current = currentAngle;

    onRotate(delta);
  }, [isDragging, getCrankAngle, onRotate]);

  const handlePointerUp = useCallback(() => {
    if (isDragging && Math.abs(accumulatedRef.current) > 0.01) {
      onRotateEnd(accumulatedRef.current);
    }
    setIsDragging(false);
    accumulatedRef.current = 0;
  }, [isDragging, onRotateEnd]);

  const axisColors: Record<string, { bg: string; ring: string; text: string }> = {
    x: { bg: "bg-red-500/10 dark:bg-red-500/15", ring: "ring-red-400/30", text: "text-red-500 dark:text-red-400" },
    y: { bg: "bg-green-500/10 dark:bg-green-500/15", ring: "ring-green-400/30", text: "text-green-500 dark:text-green-400" },
    z: { bg: "bg-blue-500/10 dark:bg-blue-500/15", ring: "ring-blue-400/30", text: "text-blue-500 dark:text-blue-400" },
  };

  const colors = axisColors[axis];

  return (
    <div className="flex flex-col items-center gap-2">
      <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`} data-testid={`text-crank-label-${axis}`}>
        R{axis} {label}
      </span>
      <div
        ref={crankRef}
        className={`relative w-20 h-20 rounded-full ${colors.bg} ring-2 ${colors.ring} cursor-grab select-none touch-none ${isDragging ? "cursor-grabbing" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        data-testid={`crank-${axis}`}
      >

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2.5 rounded-b-sm" style={{ backgroundColor: color, opacity: 0.5 }} />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, opacity: 0.3 }} />
        </div>

        <div
          className="absolute inset-0"
          style={{ transform: `rotate(${crankAngle}rad)` }}
        >
          <div
            className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-md flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          </div>
        </div>

        {isDragging && (
          <div className="absolute -inset-1 rounded-full ring-2 animate-pulse" style={{ borderColor: color, opacity: 0.4 }} />
        )}
      </div>
      <div className="flex items-center gap-1 text-muted-foreground">
        <RotateCw className="w-3 h-3" />
        <span className="text-[10px]">drag to rotate</span>
      </div>
    </div>
  );
}
