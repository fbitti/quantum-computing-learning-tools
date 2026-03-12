import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { loadGA } from "@/lib/analytics";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

type ConsentStatus = "pending" | "accepted" | "declined";

interface ConsentContextValue {
  consent: ConsentStatus;
  accept: () => void;
  decline: () => void;
}

const STORAGE_KEY = "cookie_consent";

const ConsentContext = createContext<ConsentContextValue>({
  consent: "pending",
  accept: () => {},
  decline: () => {},
});

export function useConsent() {
  return useContext(ConsentContext);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentStatus>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "declined") return stored;
    return "pending";
  });

  // When consent is accepted, load GA immediately
  useEffect(() => {
    if (consent === "accepted") {
      loadGA();
    }
  }, [consent]);

  const accept = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("accepted");
  }, []);

  const decline = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setConsent("declined");
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, accept, decline }}>
      {children}
    </ConsentContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Banner                                                             */
/* ------------------------------------------------------------------ */

export default function CookieConsentBanner() {
  const { consent, accept, decline } = useConsent();

  if (consent !== "pending") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4">
      <div className="max-w-lg mx-auto bg-[#111827] border border-[#1D2755]/50 rounded-lg shadow-lg p-4 flex flex-col gap-3">
        <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
          We use cookies and analytics (Google Analytics, Vercel Analytics) to understand how the site is used and improve your experience.
          No personal data is collected. See our{" "}
          <Link href="/policies" className="text-[#22D3EE] underline underline-offset-2">
            Cookie Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" className="text-xs border-[#334155] text-[#F8FAFC] hover:bg-[#1D2755]/50 font-sans" onClick={decline}>
            Decline
          </Button>
          <Button size="sm" className="text-xs bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-[#F8FAFC] font-sans" onClick={accept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
