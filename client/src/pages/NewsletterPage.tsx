import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Newsletter page now redirects to the signup section on the home page.
 */
export default function NewsletterPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate("/");
    // Small delay to let the home page mount, then scroll to signup
    setTimeout(() => {
      const el = document.getElementById("signup");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [navigate]);

  return null;
}
