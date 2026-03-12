import { useEffect } from "react";
import { Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PoliciesPage() {
  useEffect(() => { document.title = "Policies | One Million Qubits"; }, []);
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight" data-testid="text-policies-title">Policies</h1>
        </div>

        <section className="mb-8" data-testid="section-privacy">
          <h2 className="text-base font-semibold mb-3">Privacy Policy</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>
              One Million Qubits is an educational application that runs entirely in your browser.
              We are committed to protecting your privacy and being transparent about our data practices.
            </p>
            <h3 className="text-sm font-medium text-foreground pt-1">Information We Collect</h3>
            <p>
              This application does not collect, store, or transmit any personal information.
              All interactions with the tools (rotations, quiz answers, scores) happen locally in your browser
              and are not sent to any server or third party.
            </p>
            <h3 className="text-sm font-medium text-foreground pt-1">Analytics</h3>
            <p>
              With your consent, we use Google Analytics and Vercel Analytics to understand general usage patterns
              (such as which tools are most popular and how visitors navigate the site). Google Analytics uses cookies;
              Vercel Analytics is cookie-free. Neither service is loaded until you accept analytics cookies
              via the consent banner. No personally identifiable information is collected.
            </p>
            <h3 className="text-sm font-medium text-foreground pt-1">Third-Party Services</h3>
            <p>
                            This application is hosted on Vercel. Please refer to{" "}
                            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                              Vercel's Privacy Policy
                            </a>{" "}
                            for information about the hosting platform's data practices.
            </p>
          </div>
        </section>

        <Separator className="mb-8" />

        <section className="mb-8" data-testid="section-terms">
          <h2 className="text-base font-semibold mb-3">Terms of Service</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <h3 className="text-sm font-medium text-foreground pt-1">Acceptance of Terms</h3>
            <p>
              By accessing and using One Million Qubits, you agree to these terms.
              If you do not agree, please do not use the application.
            </p>
            <h3 className="text-sm font-medium text-foreground pt-1">Use of the Application</h3>
            <p>
              This application is provided for educational purposes only. The tools are designed to help
              users build intuition for quantum computing concepts and should not be relied upon for
              production quantum computing work or academic assessment.
            </p>
            <h3 className="text-sm font-medium text-foreground pt-1">Intellectual Property</h3>
            <p>
              All content, code, and visual design of this application are the property of the creators.
              You may use the tools freely for personal learning and education. Redistribution or
              commercial use of the application without permission is not permitted.
            </p>
            <h3 className="text-sm font-medium text-foreground pt-1">Disclaimer</h3>
            <p>
              This application is provided "as is" without warranties of any kind. We make no guarantees
              about the accuracy, completeness, or reliability of the educational content. Use at your own discretion.
            </p>
            <h3 className="text-sm font-medium text-foreground pt-1">Changes to Terms</h3>
            <p>
              We may update these terms from time to time. Continued use of the application after changes
              constitutes acceptance of the updated terms.
            </p>
          </div>
        </section>

        <Separator className="mb-8" />

        <section className="mb-8" data-testid="section-cookies">
          <h2 className="text-base font-semibold mb-3">Cookie Policy</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>
              This application uses minimal cookies and local storage. Analytics cookies are only set
              after you give consent via the banner shown on your first visit.
            </p>
            <h3 className="text-sm font-medium text-foreground pt-1">Essential (always active)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium text-foreground">Local storage:</span>{" "}
                Your preferences (e.g. cookie consent choice, tool settings like crank positions
                and quiz progress) are saved in your browser. This data never leaves your device.
              </li>
            </ul>
            <h3 className="text-sm font-medium text-foreground pt-1">Analytics (consent required)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium text-foreground">Google Analytics cookies</span>{" "}
                (<code className="text-xs">_ga</code>, <code className="text-xs">_ga_*</code>):{" "}
                Used to distinguish visitors and understand site usage. Set only after you accept.
                Expires after 2 years.
              </li>
              <li>
                <span className="font-medium text-foreground">Vercel Analytics &amp; Speed Insights:</span>{" "}
                Cookie-free, privacy-respecting analytics. Loaded only after consent.
              </li>
            </ul>
            <h3 className="text-sm font-medium text-foreground pt-1">What We Don't Use</h3>
            <p>
              We do not use advertising cookies, tracking cookies, or any third-party cookies
              for marketing or profiling purposes.
            </p>
            <h3 className="text-sm font-medium text-foreground pt-1">Changing Your Choice</h3>
            <p>
              You can change your cookie preference at any time by clearing your browser's local storage
              for this site, which will show the consent banner again on your next visit.
              You can also manage or delete cookies through your browser settings.
            </p>
          </div>
        </section>

        <Separator className="mb-6" />

        <p className="text-xs text-muted-foreground italic">
          Last updated: February 2026. If you have questions about these policies, please reach out via the contact information on the About page.
        </p>
      </div>
    </div>
  );
}
