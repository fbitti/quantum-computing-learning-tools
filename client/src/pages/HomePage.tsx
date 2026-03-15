import { useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { BookOpen, Newspaper, Wrench, ArrowRight, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { trackScrollDepth } from "@/lib/analytics";

const tools = [
  {
    id: "bloch-sphere",
    title: "Bloch Sphere Explorer",
    description:
      "Visualize qubit states on a 3D Bloch sphere. Apply Rx, Ry, and Rz rotation gates using interactive drag-to-rotate cranks and preset quantum angle buttons.",
    href: "/bloch-sphere",
  },
  {
    id: "pauli-trainer",
    title: "Pauli Trainer",
    description:
      "Practice identifying two-qubit Pauli operators from their 4x4 matrix representation. Toggle global phases for an extra challenge.",
    href: "/pauli-trainer",
  },
];

const comingSoon = [
  {
    id: "books",
    title: "Training",
    description:
      "In-depth guides including a Qiskit Certification study eBook. Master quantum computing from fundamentals to certification.",
    icon: BookOpen,
  },
  {
    id: "news",
    title: "News & Insights",
    description:
      "Stay up to date with the latest breakthroughs, industry trends, and educational content in the quantum computing space.",
    icon: Newspaper,
  },
  {
    id: "more-tools",
    title: "More Tools",
    description:
      "Stay tuned for more interactive learning tools.",
    icon: Wrench,
  },
];

/* Subtle floating node for the hero background */
function FloatingNode({
  delay,
  size,
  x,
  y,
  duration,
}: {
  delay: number;
  size: number;
  x: string;
  y: string;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background:
          "radial-gradient(circle, rgba(124,58,237,0.25) 0%, rgba(34,211,238,0.08) 60%, transparent 100%)",
      }}
      animate={{
        opacity: [0, 0.5, 0.2, 0.5, 0],
        scale: [0.8, 1.1, 1, 1.05, 0.8],
        y: [0, -15, 8, -8, 0],
        x: [0, 8, -4, 6, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export default function HomePage() {
  useEffect(() => {
    document.title = "One Million Qubits";
  }, []);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[data-mailerlite-universal="true"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if ((window as any).ml) {
        (window as any).ml('account', '2187339');
      }
      return;
    }

    (function (
      w: any,
      d: Document,
      e: string,
      u: string,
      f: string,
      l?: HTMLScriptElement,
      n?: Element | null
    ) {
      w[f] =
        w[f] ||
        function () {
          (w[f].q = w[f].q || []).push(arguments);
        };

      l = d.createElement(e) as HTMLScriptElement;
      l.async = true;
      l.src = u;
      l.setAttribute('data-mailerlite-universal', 'true');

      n = d.getElementsByTagName(e)[0];
      n?.parentNode?.insertBefore(l, n);
    })(window as any, document, 'script', 'https://assets.mailerlite.com/js/universal.js', 'ml');

    (window as any).ml('account', '2187339');
  }, []);

  const signupRef = useRef<HTMLDivElement>(null);

  // Scroll depth tracking
  const scrollMilestones = useRef(new Set<number>());
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    for (const milestone of [25, 50, 75, 100]) {
      if (pct >= milestone && !scrollMilestones.current.has(milestone)) {
        scrollMilestones.current.add(milestone);
        trackScrollDepth(milestone);
      }
    }
  }, []);

  const scrollToSignup = () => {
    signupRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-full overflow-y-auto" onScroll={handleScroll}>
      {/* ===== Hero Section ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B1020] via-[#111827] to-[#0B1020]">
        {/* Subtle node field */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingNode delay={0} size={5} x="15%" y="25%" duration={7} />
          <FloatingNode delay={1.2} size={3} x="75%" y="15%" duration={8} />
          <FloatingNode delay={0.5} size={6} x="60%" y="65%" duration={6.5} />
          <FloatingNode delay={2} size={4} x="25%" y="70%" duration={9} />
          <FloatingNode delay={0.8} size={3} x="85%" y="45%" duration={7.5} />
          <FloatingNode delay={1.5} size={5} x="40%" y="30%" duration={8.5} />
          <FloatingNode delay={3} size={3} x="10%" y="50%" duration={7} />
          <FloatingNode delay={2.5} size={4} x="90%" y="75%" duration={6} />

          {/* Soft controlled glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(34,211,238,0.06) 50%, transparent 70%)",
            }}
          />

          {/* Subtle lattice lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F8FAFC" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src="/logo.png" alt="1MQ" className="h-24 sm:h-28 w-auto" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight text-[#F8FAFC] mb-4 leading-tight">
              One Million{" "}
              <span className="text-[#7C3AED]">
                Qubits
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#94A3B8] mb-3 max-w-xl mx-auto leading-relaxed font-sans">
              Your quantum computing learning hub.
            </p>
            <p className="text-sm sm:text-base text-[#94A3B8]/80 mb-8 max-w-lg mx-auto font-sans">
              Interactive tools, study guides, and expert insights to take you from curious
              learner to quantum-ready professional.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                size="lg"
                className="bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-[#F8FAFC] border-[#7C3AED] px-8 font-sans"
                onClick={scrollToSignup}
              >
                <Mail className="w-4 h-4 mr-2" />
                Get Early Access
              </Button>
              <Link href="/bloch-sphere">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#334155] text-[#F8FAFC] hover:bg-[#1D2755]/50 px-8 font-sans"
                >
                  Try a Tool
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade into page background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B1020] to-transparent" />
      </section>

      {/* ===== Live Tools Section ===== */}
      <section className="py-16 px-4 bg-[#0B1020]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#22D3EE] mb-2 font-sans">
              Available Now
            </p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight mb-3 text-[#F8FAFC]">
              Try Our Interactive Tools
            </h2>
            <p className="text-sm text-[#94A3B8] max-w-md mx-auto font-sans">
              Start building your quantum intuition today with these hands-on learning tools.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {tools.map((tool, index) => {
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <Card
                    className="hover-elevate cursor-pointer h-full bg-[#111827] border-[#1D2755]/50"
                    data-testid={`card-tool-${tool.id}`}
                  >
                    <CardContent className="pt-6 pb-5 px-6 flex flex-col gap-3 h-full">
                      <h3 className="text-base font-heading font-semibold text-[#F8FAFC]">{tool.title}</h3>
                      <p className="text-sm text-[#94A3B8] leading-relaxed flex-1 font-sans">
                        {tool.description}
                      </p>
                      <Link href={tool.href}>
                        <Button className="w-full mt-2 bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-[#F8FAFC] font-sans" data-testid={`button-launch-${tool.id}`}>
                          Launch Tool
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Coming Soon Section ===== */}
      <section className="py-16 px-4 bg-[#111827]/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7C3AED] mb-2 font-sans">
              Coming Soon
            </p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight mb-3 text-[#F8FAFC]">
              More on the Way
            </h2>
            <p className="text-sm text-[#94A3B8] max-w-md mx-auto font-sans">
              We're building a comprehensive quantum computing learning platform. Here's what's next.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-3">
            {comingSoon.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                >
                  <Card
                    className="h-full opacity-80 border-dashed border-[#334155] bg-[#111827]/60"
                    data-testid={`card-coming-${item.id}`}
                  >
                    <CardContent className="pt-6 pb-5 px-6 flex flex-col gap-3 h-full">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-[#7C3AED]" />
                        </div>
                        <h3 className="text-base font-heading font-semibold text-[#F8FAFC]">{item.title}</h3>
                      </div>
                      <p className="text-sm text-[#94A3B8] leading-relaxed flex-1 font-sans">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Newsletter Signup Section ===== */}
      <section ref={signupRef} id="signup" className="py-20 px-4 bg-[#0B1020]">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <Mail className="w-8 h-8 text-[#22D3EE] mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight mb-3 text-[#F8FAFC]">
              Get quantum tools, visual explainers, and early access to new demos
            </h2>
            <p className="text-sm text-[#94A3B8] mb-8 max-w-md mx-auto font-sans">
              Join the newsletter&mdash;no spam, unsubscribe anytime.
            </p>

            <div className="ml-embedded max-w-md mx-auto" data-form="cVWsn1"></div>
          </motion.div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-[#1D2755]/50 py-8 px-4 bg-[#0B1020]">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="1MQ" className="h-6 w-auto" />
            <span className="font-heading font-semibold text-[#F8FAFC]">One Million Qubits™</span>
          </div>

          {/* Social media links */}
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/fbitti" target="_blank" rel="noopener noreferrer" className="hover:text-[#F8FAFC] transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://x.com/1Mqubits" target="_blank" rel="noopener noreferrer" className="hover:text-[#F8FAFC] transition-colors" aria-label="X (Twitter)">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@1mqubits" target="_blank" rel="noopener noreferrer" className="hover:text-[#F8FAFC] transition-colors" aria-label="TikTok">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
            <a href="https://www.instagram.com/1mqubits/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F8FAFC] transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z"/></svg>
            </a>
            <a href="https://www.youtube.com/@OneMillionQubits" target="_blank" rel="noopener noreferrer" className="hover:text-[#F8FAFC] transition-colors" aria-label="YouTube">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>

          <div className="flex gap-4 font-sans">
            <Link href="/about" className="hover:text-[#F8FAFC] transition-colors">
              About
            </Link>
            <Link href="/policies" className="hover:text-[#F8FAFC] transition-colors">
              Policies
            </Link>
          </div>

          <p className="font-sans">&copy; {new Date().getFullYear()} One Million Qubits™. All rights reserved.</p>
          <p className="text-xs text-[#94A3B8] font-sans">
            IBM, Qiskit, and other third-party names are trademarks of their respective owners.
            References on this site are for identification and educational purposes only and do not
            imply affiliation, endorsement, sponsorship, or official connection.
          </p>
          <p className="text-xs text-[#94A3B8] font-sans">
            <a href="mailto:fernando@onemillionqubits.com" className="hover:text-[#F8FAFC] transition-colors">fernando@onemillionqubits.com</a>
          </p>
          <p className="text-[10px] text-[#94A3B8]/60 font-sans">v0.1.6</p>
        </div>
      </footer>
    </div>
  );
}
