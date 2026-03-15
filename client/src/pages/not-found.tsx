import { useEffect } from "react";
import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 | One Million Qubits";
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-[#0B1020]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2.5 mb-10">
          <img src="/logo.png" alt="1MQ" className="h-6 w-auto" />
          <h1 className="text-xl font-heading font-bold tracking-tight text-[#F8FAFC]">
            One Million Qubits
          </h1>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center space-y-5">
          <p className="text-7xl font-heading font-bold text-[#7C3AED]">404</p>

          <h2 className="text-xl font-heading font-semibold text-[#F8FAFC]">
            This page is in superposition
          </h2>

          <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
            It exists and doesn't exist at the same time — but the moment you
            tried to observe it, it collapsed into <em>nothing</em>. Even
            Schrödinger couldn't find this URL.
          </p>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] hover:bg-[#7C3AED]/80 transition-colors px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Home className="w-4 h-4" />
              Back to the main page
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-[#94A3B8]/50 mt-6">
          Error code: <span className="text-[#22D3EE]">|404⟩</span>
        </p>
      </div>
    </div>
  );
}