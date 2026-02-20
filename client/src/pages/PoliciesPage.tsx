import { useEffect } from "react";
import { Shield } from "lucide-react";

export default function PoliciesPage() {
  useEffect(() => { document.title = "Policies | Quantum Computing Practice Tools"; }, []);
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight" data-testid="text-policies-title">Policies</h1>
        </div>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Privacy policy, terms of use, and other legal information will be published here.
          </p>
          <p className="text-xs italic">Details coming soon.</p>
        </div>
      </div>
    </div>
  );
}
