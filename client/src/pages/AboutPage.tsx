import { useEffect } from "react";
import { Info } from "lucide-react";

export default function AboutPage() {
  useEffect(() => { document.title = "About | Quantum Computing Practice Tools"; }, []);
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight" data-testid="text-about-title">About</h1>
        </div>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Quantum Computing Practice Tools is a collection of interactive educational tools
            designed to build hands-on intuition for quantum computing concepts.
          </p>
          <p>
            Whether you're a student, educator, or curious learner, these tools let you
            experiment with qubits, gates, and quantum states in a visual, approachable way.
          </p>
          <p className="text-xs italic">More details coming soon.</p>
        </div>
      </div>
    </div>
  );
}
