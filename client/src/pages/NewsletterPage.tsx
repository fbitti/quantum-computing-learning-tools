import { useEffect } from "react";
import { Mail } from "lucide-react";

export default function NewsletterPage() {
  useEffect(() => { document.title = "Newsletter | Quantum Computing Practice Tools"; }, []);
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight" data-testid="text-newsletter-title">Newsletter</h1>
        </div>
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            Sign up to get notified when new tools are added and receive tips on
            quantum computing concepts.
          </p>
          <p className="text-xs italic">Subscription form coming soon.</p>
        </div>
      </div>
    </div>
  );
}
