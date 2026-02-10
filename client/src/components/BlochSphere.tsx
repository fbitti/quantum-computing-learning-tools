import { useRef, useMemo, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import type { BlochCoords } from "@/lib/quantum";

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function Sphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 48, 48]} />
      <meshPhysicalMaterial
        color="#4488cc"
        transparent
        opacity={0.08}
        depthWrite={false}
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

function WireframeSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.001, 32, 32]} />
      <meshBasicMaterial
        color="#6699cc"
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

function GreatCircles() {
  const xyPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    return pts;
  }, []);

  const xzPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
    }
    return pts;
  }, []);

  const yzPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(0, Math.sin(a), Math.cos(a)));
    }
    return pts;
  }, []);

  return (
    <>
      <Line points={xyPoints} color="#5588aa" lineWidth={1} transparent opacity={0.3} />
      <Line points={xzPoints} color="#aa5588" lineWidth={1} transparent opacity={0.3} />
      <Line points={yzPoints} color="#55aa88" lineWidth={1} transparent opacity={0.3} />
    </>
  );
}

function AxisLabel({ position, text, color }: { position: [number, number, number]; text: string; color: string }) {
  const ref = useRef<THREE.Sprite>(null);
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 64;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, 256, 64);
    ctx.font = "bold 32px 'Open Sans', sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 32);
    return c;
  }, [text, color]);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [canvas]);

  return (
    <sprite ref={ref} position={position} scale={[0.6, 0.15, 1]}>
      <spriteMaterial map={texture} transparent />
    </sprite>
  );
}

function AxisEndpoint({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.04, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
}

function DashedAxis({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const ref = useRef<THREE.LineSegments>(null);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ]);
    return g;
  }, [start, end]);

  const mat = useMemo(() => {
    return new THREE.LineDashedMaterial({
      color,
      dashSize: 0.06,
      gapSize: 0.04,
      transparent: true,
      opacity: 0.8,
    });
  }, [color]);

  useFrame(() => {
    if (ref.current && !ref.current.userData.computed) {
      ref.current.computeLineDistances();
      ref.current.userData.computed = true;
    }
  });

  return <lineSegments ref={ref} geometry={geom} material={mat} />;
}

function Axes() {
  const axisLength = 1.35;
  const axisColorX = "#ef4444";
  const axisColorY = "#22c55e";
  const axisColorZ = "#3b82f6";
  const labelOffset = 1.55;

  return (
    <>
      <DashedAxis start={[-axisLength, 0, 0]} end={[axisLength, 0, 0]} color={axisColorX} />
      <DashedAxis start={[0, 0, -axisLength]} end={[0, 0, axisLength]} color={axisColorY} />
      <DashedAxis start={[0, -axisLength, 0]} end={[0, axisLength, 0]} color={axisColorZ} />

      <AxisEndpoint position={[axisLength, 0, 0]} color={axisColorX} />
      <AxisEndpoint position={[-axisLength, 0, 0]} color={axisColorX} />
      <AxisEndpoint position={[0, 0, axisLength]} color={axisColorY} />
      <AxisEndpoint position={[0, 0, -axisLength]} color={axisColorY} />
      <AxisEndpoint position={[0, axisLength, 0]} color={axisColorZ} />
      <AxisEndpoint position={[0, -axisLength, 0]} color={axisColorZ} />

      <AxisLabel position={[labelOffset, 0, 0]} text="X  |+>" color={axisColorX} />
      <AxisLabel position={[-labelOffset, 0, 0]} text="-X  |->" color={axisColorX} />
      <AxisLabel position={[0, 0, labelOffset]} text="Y  |i>" color={axisColorY} />
      <AxisLabel position={[0, 0, -labelOffset]} text="-Y  |-i>" color={axisColorY} />
      <AxisLabel position={[0, labelOffset, 0]} text="Z  |0>" color={axisColorZ} />
      <AxisLabel position={[0, -labelOffset, 0]} text="-Z  |1>" color={axisColorZ} />
    </>
  );
}

function StateVector({ coords }: { coords: BlochCoords }) {
  const groupRef = useRef<THREE.Group>(null);
  const currentRef = useRef({ x: 0, y: 0, z: 1 });
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const lerp = 1 - Math.pow(0.001, delta);
    currentRef.current.x += (coords.x - currentRef.current.x) * lerp;
    currentRef.current.y += (coords.y - currentRef.current.y) * lerp;
    currentRef.current.z += (coords.z - currentRef.current.z) * lerp;

    if (!groupRef.current) return;

    const { x, y, z } = currentRef.current;
    const dir = new THREE.Vector3(x, z, y).normalize();
    const up = new THREE.Vector3(0, 1, 0);

    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(up, dir);
    groupRef.current.quaternion.copy(quaternion);

    if (glowRef.current) {
      const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.43, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.86, 8]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.4} />
      </mesh>

      <mesh position={[0, 0.93, 0]}>
        <coneGeometry args={[0.05, 0.14, 12]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>

      <mesh ref={glowRef} position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} transparent opacity={0.5} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function RotationRing({ axis, angle, visible }: { axis: "x" | "y" | "z"; angle: number; visible: boolean }) {
  const { points, arrowPos, arrowDir } = useMemo(() => {
    if (!visible || Math.abs(angle) < 0.01) return { points: [], arrowPos: null, arrowDir: null };
    const steps = Math.max(16, Math.round(Math.abs(angle) / (Math.PI / 32)));
    const pts: THREE.Vector3[] = [];
    const r = 1.15;
    const getPoint = (a: number): [number, number, number] => {
      if (axis === "z") return [r * Math.cos(a), 0, r * Math.sin(a)];
      if (axis === "x") return [0, r * Math.sin(a), r * Math.cos(a)];
      return [r * Math.cos(a), -r * Math.sin(a), 0];
    };
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * angle;
      const [tx, ty, tz] = getPoint(a);
      pts.push(new THREE.Vector3(tx, ty, tz));
    }
    const endPt = pts[pts.length - 1];
    const eps = 0.001 * Math.sign(angle);
    const [nx, ny, nz] = getPoint(angle + eps);
    const tangent = new THREE.Vector3(nx - endPt.x, ny - endPt.y, nz - endPt.z).normalize();
    return { points: pts, arrowPos: endPt, arrowDir: tangent };
  }, [axis, angle, visible]);

  if (!visible || points.length < 2 || !arrowPos || !arrowDir) return null;

  const colors: Record<string, string> = { x: "#ef4444", y: "#22c55e", z: "#3b82f6" };
  const color = colors[axis];

  const arrowQuat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrowDir);
    return q;
  }, [arrowDir]);

  return (
    <>
      <Line points={points} color={color} lineWidth={3} transparent opacity={0.7} />
      <mesh position={arrowPos} quaternion={arrowQuat}>
        <coneGeometry args={[0.05, 0.15, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.8} />
      </mesh>
    </>
  );
}

interface BlochSphereProps {
  coords: BlochCoords;
  activeRotation?: { axis: "x" | "y" | "z"; angle: number } | null;
}

function Scene({ coords, activeRotation }: BlochSphereProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, -3, 2]} intensity={0.3} />

      <Sphere />
      <WireframeSphere />
      <GreatCircles />
      <Axes />
      <StateVector coords={coords} />

      {activeRotation && (
        <RotationRing
          axis={activeRotation.axis}
          angle={activeRotation.angle}
          visible={true}
        />
      )}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={6}
        makeDefault
      />
    </>
  );
}

function Fallback2D({ coords }: { coords: BlochCoords }) {
  const cx = 150, cy = 150, r = 120;
  const px = cx + coords.x * r;
  const py = cy - coords.y * r;
  const tipSize = 6;

  return (
    <div className="w-full h-full flex items-center justify-center" data-testid="bloch-sphere-canvas">
      <div className="text-center space-y-2">
        <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
          <line x1={cx - r - 15} y1={cy} x2={cx + r + 15} y2={cy} stroke="#ef4444" strokeWidth="1" opacity="0.5" />
          <line x1={cx} y1={cy + r + 15} x2={cx} y2={cy - r - 15} stroke="#22c55e" strokeWidth="1" opacity="0.5" />
          <text x={cx + r + 20} y={cy + 4} fill="#ef4444" fontSize="11" fontFamily="monospace">X</text>
          <text x={cx + 4} y={cy - r - 18} fill="#22c55e" fontSize="11" fontFamily="monospace">Y</text>
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="#f59e0b" strokeWidth="2.5" />
          <polygon
            points={`${px},${py - tipSize} ${px - tipSize * 0.6},${py + tipSize * 0.4} ${px + tipSize * 0.6},${py + tipSize * 0.4}`}
            fill="#f59e0b"
            transform={`rotate(${-Math.atan2(coords.y, coords.x) * 180 / Math.PI + 90}, ${px}, ${py})`}
          />
          <circle cx={px} cy={py} r="4" fill="#fbbf24" />
        </svg>
        <p className="text-xs text-muted-foreground">2D projection (XY plane) — WebGL not available</p>
      </div>
    </div>
  );
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return !!gl;
  } catch {
    return false;
  }
}

export default function BlochSphereCanvas({ coords, activeRotation }: BlochSphereProps) {
  const webglAvailable = useMemo(() => isWebGLAvailable(), []);

  if (!webglAvailable) {
    return <Fallback2D coords={coords} />;
  }

  return (
    <WebGLErrorBoundary fallback={<Fallback2D coords={coords} />}>
      <div className="w-full h-full" data-testid="bloch-sphere-canvas">
        <Canvas
          camera={{ position: [2.5, 1.8, 2.5], fov: 42 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene coords={coords} activeRotation={activeRotation} />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
