import { useEffect } from "react";
import { Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PoliciesPage() {
  useEffect(() => {
    document.title = "Policies | One Million Qubits";
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-[#0B1020]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-[#7C3AED]" />
          <h1
            className="text-xl font-heading font-bold tracking-tight text-[#F8FAFC]"
            data-testid="text-policies-title"
          >
            Policies
          </h1>
        </div>

        <section className="mb-8" data-testid="section-privacy">
          <h2 className="text-base font-heading font-semibold mb-3 text-[#F8FAFC]">
            Privacy Policy
          </h2>
          <div className="text-sm text-[#94A3B8] space-y-2 leading-relaxed font-sans">
            <p>
              One Million Qubits is an educational website with interactive tools that
              run mainly in your browser. We aim to collect as little personal data as
              possible and to be clear about when we do collect it.
            </p>

            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Information We Collect</h3>
            <p>
              Most of the learning-tool interactions on this site (for example,
              rotations, quiz answers, preferences, and scores) happen locally in your
              browser and are not sent to our servers.
            </p>
            <p>
              If you choose to subscribe to our newsletter, we collect the personal data
              you provide in the signup form, typically your email address and any other
              optional details you submit. We may also store related subscription
              metadata such as the signup date, confirmation status, source form, and
              email-delivery events needed to operate the newsletter.
            </p>

            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">How We Use Newsletter Data</h3>
            <p>
              We use newsletter subscription data to send updates, free tools, visual
              explainers, early-access invites, and other content related to One Million
              Qubits. We may also use it to manage subscriber preferences, maintain list
              hygiene, and understand basic newsletter performance such as deliveries,
              opens, clicks, bounces, and unsubscribes.
            </p>

            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Legal Basis</h3>
            <p>
              Where required by applicable law, we process newsletter subscription data
              on the basis of your consent. You can withdraw that consent at any time by
              clicking the unsubscribe link in any newsletter email or by contacting us
              at{" "}
              <a
                href="mailto:fernando@onemillionqubits.com"
                className="text-[#22D3EE] underline underline-offset-2"
              >
                fernando@onemillionqubits.com
              </a>
              .
            </p>

            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Analytics</h3>
            <p>
              With your consent, we use Google Analytics and Vercel Analytics to
              understand general usage patterns, such as which tools are most popular and
              how visitors navigate the site. Google Analytics uses cookies. Vercel
              Analytics is cookie-free. Neither service is loaded until you accept
              analytics cookies via the consent banner.
            </p>

            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Data Retention</h3>
            <p>
              We keep newsletter subscriber data until you unsubscribe, ask us to delete
              it, or we stop operating the newsletter. We may retain limited suppression
              information when needed to make sure we honor unsubscribe requests and
              comply with applicable law.
            </p>

            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Third-Party Services</h3>
            <p>
              This website is hosted on Vercel. Please refer to{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#22D3EE] underline underline-offset-2"
              >
                Vercel&apos;s Privacy Policy
              </a>{" "}
              for information about the hosting platform&apos;s data practices.
            </p>
            <p>
              Newsletter signup forms and newsletter delivery are currently handled by{" "}
              <a
                href="https://www.mailerlite.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#22D3EE] underline underline-offset-2"
              >
                MailerLite
              </a>
              , our email service provider. If you subscribe, your email address and
              related subscription data will be processed by MailerLite on our behalf.
            </p>

            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Your Rights</h3>
            <p>
              Depending on where you live, you may have rights to access, correct,
              delete, or restrict the processing of your personal data, or to object to
              certain processing. To make a request, contact us at{" "}
              <a
                href="mailto:fernando@onemillionqubits.com"
                className="text-[#22D3EE] underline underline-offset-2"
              >
                fernando@onemillionqubits.com
              </a>
              .
            </p>

            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">What We Don&apos;t Do</h3>
            <p>
              We do not sell your personal data, and we do not use your newsletter
              subscription for third-party advertising or profiling.
            </p>
          </div>
        </section>

        <Separator className="mb-8" />

        <section className="mb-8" data-testid="section-terms">
          <h2 className="text-base font-heading font-semibold mb-3 text-[#F8FAFC]">
            Terms of Service
          </h2>
          <div className="text-sm text-[#94A3B8] space-y-2 leading-relaxed font-sans">
            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Acceptance of Terms</h3>
            <p>
              By accessing and using One Million Qubits, you agree to these terms. If
              you do not agree, please do not use the application.
            </p>
            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Use of the Application</h3>
            <p>
              This application is provided for educational purposes only. The tools are
              designed to help users build intuition for quantum computing concepts and
              should not be relied upon for production quantum computing work or academic
              assessment.
            </p>
            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Intellectual Property</h3>
            <p>
              All content, code, and visual design of this application are the property
              of the creators. You may use the tools freely for personal learning and
              education. Redistribution or commercial use of the application without
              permission is not permitted.
            </p>
            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Disclaimer</h3>
            <p>
              This application is provided "as is" without warranties of any kind. We
              make no guarantees about the accuracy, completeness, or reliability of the
              educational content. Use at your own discretion.
            </p>
            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Changes to Terms</h3>
            <p>
              We may update these terms from time to time. Continued use of the
              application after changes constitutes acceptance of the updated terms.
            </p>
          </div>
        </section>

        <Separator className="mb-8" />

        <section className="mb-8" data-testid="section-cookies">
          <h2 className="text-base font-heading font-semibold mb-3 text-[#F8FAFC]">
            Cookie Policy
          </h2>
          <div className="text-sm text-[#94A3B8] space-y-2 leading-relaxed font-sans">
            <p>
              This website uses minimal cookies and local storage. Analytics cookies are
              only set after you give consent via the banner shown on your first visit.
            </p>
            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Essential (always active)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium text-[#F8FAFC]">Local storage:</span>{" "}
                Your preferences (for example, cookie consent choice, tool settings, and
                quiz progress) are saved in your browser. This data does not leave your
                device unless you separately choose to submit it.
              </li>
            </ul>
            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Analytics (consent required)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium text-[#F8FAFC]">Google Analytics cookies</span>{" "}
                (<code className="text-xs">_ga</code>, <code className="text-xs">_ga_*</code>):
                used to distinguish visitors and understand site usage. Set only after
                you accept.
              </li>
              <li>
                <span className="font-medium text-[#F8FAFC]">Vercel Analytics &amp; Speed Insights:</span>{" "}
                cookie-free, privacy-respecting analytics. Loaded only after consent.
              </li>
            </ul>
            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">What We Don&apos;t Use</h3>
            <p>
              We do not use advertising cookies or third-party tracking cookies for
              behavioral advertising or profiling.
            </p>
            <h3 className="text-sm font-medium text-[#F8FAFC] pt-1">Changing Your Choice</h3>
            <p>
              You can change your cookie preference at any time by clearing your
              browser&apos;s local storage for this site, which will show the consent banner
              again on your next visit. You can also manage or delete cookies through
              your browser settings.
            </p>
          </div>
        </section>

        <Separator className="mb-6" />

        <p className="text-xs text-[#94A3B8]/60 italic font-sans">
          Last updated: March 2026. If you have questions about these policies, please
          contact{" "}
          <a
            href="mailto:fernando@onemillionqubits.com"
            className="text-[#22D3EE] underline underline-offset-2"
          >
            fernando@onemillionqubits.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
