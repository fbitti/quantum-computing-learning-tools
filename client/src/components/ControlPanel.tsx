import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Play, Trash2, Zap, ChevronRight } from "lucide-react";
import CrankControl from "./CrankControl";
import {
  type RotationOp,
  type BlochCoords,
  PRESET_ANGLES,
  KNOWN_EQUIVALENCES,
  formatComplex,
  formatAngle,
  blochToKet,
} from "@/lib/quantum";

interface ControlPanelProps {
  coords: BlochCoords;
  history: RotationOp[];
  onRotate: (axis: "x" | "y" | "z", angle: number) => void;
  onRotateEnd: (axis: "x" | "y" | "z", totalAngle: number) => void;
  onPresetRotate: (axis: "x" | "y" | "z", angle: number, label: string) => void;
  onReset: () => void;
  onClearHistory: () => void;
  onApplySequence: (ops: RotationOp[]) => void;
  resetKey?: number;
}

function StateDisplay({ coords }: { coords: BlochCoords }) {
  const ket = blochToKet(coords);
  const alphaStr = formatComplex(ket.alpha[0], ket.alpha[1]);
  const betaStr = formatComplex(ket.beta[0], ket.beta[1]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-semibold">Quantum State</h3>
      </div>

      <div className="bg-muted/50 rounded-md p-3 font-mono text-sm space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-muted-foreground">|&psi;&rang; =</span>
          <span className="text-amber-600 dark:text-amber-400">{alphaStr}</span>
          <span className="text-muted-foreground">|0&rang; +</span>
          <span className="text-amber-600 dark:text-amber-400">{betaStr}</span>
          <span className="text-muted-foreground">|1&rang;</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-red-500/10 dark:bg-red-500/15 rounded-md p-2 text-center">
          <span className="text-muted-foreground block">X</span>
          <span className="font-mono text-red-600 dark:text-red-400" data-testid="text-coord-x">{coords.x.toFixed(3)}</span>
        </div>
        <div className="bg-green-500/10 dark:bg-green-500/15 rounded-md p-2 text-center">
          <span className="text-muted-foreground block">Y</span>
          <span className="font-mono text-green-600 dark:text-green-400" data-testid="text-coord-y">{coords.y.toFixed(3)}</span>
        </div>
        <div className="bg-blue-500/10 dark:bg-blue-500/15 rounded-md p-2 text-center">
          <span className="text-muted-foreground block">Z</span>
          <span className="font-mono text-blue-600 dark:text-blue-400" data-testid="text-coord-z">{coords.z.toFixed(3)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted/50 rounded-md p-2 text-center">
          <span className="text-muted-foreground block">&theta;</span>
          <span className="font-mono" data-testid="text-theta">{formatAngle(coords.theta)}</span>
        </div>
        <div className="bg-muted/50 rounded-md p-2 text-center">
          <span className="text-muted-foreground block">&phi;</span>
          <span className="font-mono" data-testid="text-phi">{formatAngle(coords.phi)}</span>
        </div>
      </div>
    </div>
  );
}

function PresetAngles({ onPresetRotate }: { onPresetRotate: (axis: "x" | "y" | "z", angle: number, label: string) => void }) {
  const axes: Array<{ axis: "x" | "y" | "z"; color: string; label: string }> = [
    { axis: "x", color: "text-red-500 dark:text-red-400", label: "Rx" },
    { axis: "y", color: "text-green-500 dark:text-green-400", label: "Ry" },
    { axis: "z", color: "text-blue-500 dark:text-blue-400", label: "Rz" },
  ];

  return (
    <div className="space-y-3">
      {axes.map(({ axis, color, label }) => (
        <div key={axis} className="space-y-1.5">
          <span className={`text-xs font-semibold uppercase tracking-wider ${color}`}>{label}</span>
          <div className="flex flex-wrap gap-1">
            {PRESET_ANGLES.map((preset) => (
              <Button
                key={`${axis}-${preset.label}`}
                variant="outline"
                size="sm"
                className="text-xs font-mono"
                onClick={() => onPresetRotate(axis, preset.value, `${label}(${preset.label})`)}
                data-testid={`button-preset-${axis}-${preset.label}`}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function OperationHistory({ history, onClearHistory }: { history: RotationOp[]; onClearHistory: () => void }) {
  if (history.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-sm">
        No operations applied yet.
        <br />
        <span className="text-xs">Use the cranks or presets to rotate.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{history.length} operation{history.length !== 1 ? "s" : ""}</span>
        <Button variant="ghost" size="sm" onClick={onClearHistory} className="text-xs" data-testid="button-clear-history">
          <Trash2 className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
      <ScrollArea className="h-32">
        <div className="space-y-1 pr-3">
          {history.map((op, i) => {
            const axisColors: Record<string, string> = {
              x: "bg-red-500/15 text-red-600 dark:text-red-400",
              y: "bg-green-500/15 text-green-600 dark:text-green-400",
              z: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
            };
            return (
              <div key={i} className="flex items-center gap-1.5 text-xs" data-testid={`history-item-${i}`}>
                <span className="text-muted-foreground w-4 text-right font-mono">{i + 1}.</span>
                <Badge variant="secondary" className={`font-mono text-[10px] ${axisColors[op.axis]}`}>
                  {op.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="bg-muted/50 rounded-md p-2">
        <span className="text-[10px] text-muted-foreground block mb-1">Sequence:</span>
        <div className="flex flex-wrap items-center gap-0.5">
          {history.map((op, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="font-mono text-[10px]">{op.label}</span>
              {i < history.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-muted-foreground mx-0.5" />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function KnownSequences({ onApplySequence }: { onApplySequence: (ops: RotationOp[]) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Apply known gate decompositions to the current state. Click twice to verify H&middot;H = I.
      </p>
      <div className="space-y-1.5">
        {KNOWN_EQUIVALENCES.map((seq) => (
          <Button
            key={seq.name}
            variant="ghost"
            className="w-full flex items-center justify-between gap-2 text-left"
            onClick={() => onApplySequence(seq.ops)}
            data-testid={`button-sequence-${seq.name}`}
          >
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium block">{seq.name}</span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                {seq.ops.map(o => o.label).join(" \u2192 ")}
              </span>
            </div>
            <Play className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function ControlPanel({
  coords,
  history,
  onRotate,
  onRotateEnd,
  onPresetRotate,
  onReset,
  onClearHistory,
  onApplySequence,
  resetKey = 0,
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold tracking-tight">Bloch Sphere</h2>
        <Button variant="outline" size="sm" onClick={onReset} data-testid="button-reset">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset |0&rang;
        </Button>
      </div>

      <StateDisplay coords={coords} />

      <Separator />

      <div>
        <h3 className="text-sm font-semibold mb-3">Rotation Cranks</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Drag to rotate the state vector around each axis. Each crank turns the Bloch sphere like a physical rotation gate.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <CrankControl axis="x" color="#ef4444" onRotate={(a) => onRotate("x", a)} onRotateEnd={(a) => onRotateEnd("x", a)} label="(X-axis)" resetKey={resetKey} />
          <CrankControl axis="y" color="#22c55e" onRotate={(a) => onRotate("y", a)} onRotateEnd={(a) => onRotateEnd("y", a)} label="(Y-axis)" resetKey={resetKey} />
          <CrankControl axis="z" color="#3b82f6" onRotate={(a) => onRotate("z", a)} onRotateEnd={(a) => onRotateEnd("z", a)} label="(Z-axis)" resetKey={resetKey} />
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="presets" data-testid="tab-presets">Presets</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">History</TabsTrigger>
          <TabsTrigger value="sequences" data-testid="tab-sequences">Gates</TabsTrigger>
        </TabsList>
        <TabsContent value="presets" className="mt-3">
          <PresetAngles onPresetRotate={onPresetRotate} />
        </TabsContent>
        <TabsContent value="history" className="mt-3">
          <OperationHistory history={history} onClearHistory={onClearHistory} />
        </TabsContent>
        <TabsContent value="sequences" className="mt-3">
          <KnownSequences onApplySequence={onApplySequence} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
