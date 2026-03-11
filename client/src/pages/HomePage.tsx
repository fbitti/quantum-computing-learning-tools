import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { Atom, Grid3X3, BookOpen, Newspaper, Wrench, ArrowRight, Mail, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const tools = [
  {
    id: "bloch-sphere",
    title: "Bloch Sphere Explorer",
    description:
      "Visualize qubit states on a 3D Bloch sphere. Apply Rx, Ry, and Rz rotation gates using interactive drag-to-rotate cranks and preset quantum angle buttons.",
    icon: Atom,
    href: "/bloch-sphere",
  },
  {
    id: "pauli-trainer",
    title: "Pauli Trainer",
    description:
      "Practice identifying two-qubit Pauli operators from their 4x4 matrix representation. Toggle global phases for an extra challenge.",
    icon: Grid3X3,
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

/* Floating particle for the hero background */
function QuantumParticle({
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
          "radial-gradient(circle, hsl(221 83% 53% / 0.4) 0%, hsl(280 70% 45% / 0.1) 70%, transparent 100%)",
      }}
      animate={{
        opacity: [0, 0.6, 0.3, 0.7, 0],
        scale: [0.8, 1.2, 1, 1.1, 0.8],
        y: [0, -20, 10, -10, 0],
        x: [0, 10, -5, 8, 0],
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

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const signupRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  const scrollToSignup = () => {
    signupRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* ===== Hero Section ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[hsl(220,20%,6%)] via-[hsl(220,25%,8%)] to-[hsl(220,20%,10%)]">
        {/* Animated quantum particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <QuantumParticle delay={0} size={6} x="15%" y="25%" duration={6} />
          <QuantumParticle delay={1.2} size={4} x="75%" y="15%" duration={7} />
          <QuantumParticle delay={0.5} size={8} x="60%" y="65%" duration={5.5} />
          <QuantumParticle delay={2} size={5} x="25%" y="70%" duration={8} />
          <QuantumParticle delay={0.8} size={3} x="85%" y="45%" duration={6.5} />
          <QuantumParticle delay={1.5} size={7} x="40%" y="30%" duration={7.5} />
          <QuantumParticle delay={3} size={4} x="10%" y="50%" duration={6} />
          <QuantumParticle delay={2.5} size={5} x="90%" y="75%" duration={5} />
          <QuantumParticle delay={1} size={6} x="50%" y="85%" duration={8} />
          <QuantumParticle delay={0.3} size={3} x="35%" y="10%" duration={7} />

          {/* Radial glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, hsl(221 83% 53% / 0.3) 0%, hsl(280 70% 45% / 0.1) 40%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="relative">
                <Atom className="w-10 h-10 text-blue-400" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-10 h-10 text-purple-400/30" />
                </motion.div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
              One Million{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                Qubits
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-3 max-w-xl mx-auto leading-relaxed">
              Your quantum computing learning hub.
            </p>
            <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-lg mx-auto">
              Interactive tools, study guides, and expert insights to take you from curious
              learner to quantum-ready professional.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-500 text-white border-blue-500 px-8"
                onClick={scrollToSignup}
              >
                <Mail className="w-4 h-4 mr-2" />
                Get Early Access
              </Button>
              <Link href="/bloch-sphere">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-200 hover:bg-slate-800 px-8"
                >
                  Try a Tool
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade into page background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ===== Live Tools Section ===== */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              Available Now
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Try Our Interactive Tools
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Start building your quantum intuition today with these hands-on learning tools.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <Card
                    className="hover-elevate cursor-pointer h-full"
                    data-testid={`card-tool-${tool.id}`}
                  >
                    <CardContent className="pt-6 pb-5 px-6 flex flex-col gap-3 h-full">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-base font-semibold">{tool.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {tool.description}
                      </p>
                      <Link href={tool.href}>
                        <Button className="w-full mt-2" data-testid={`button-launch-${tool.id}`}>
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
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-2">
              Coming Soon
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              More on the Way
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
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
                    className="h-full opacity-80 border-dashed"
                    data-testid={`card-coming-${item.id}`}
                  >
                    <CardContent className="pt-6 pb-5 px-6 flex flex-col gap-3 h-full">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-purple-500" />
                        </div>
                        <h3 className="text-base font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
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
      <section ref={signupRef} id="signup" className="py-20 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Get notified of updates, free tools & early access
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
              Join the newsletter&mdash;no spam, unsubscribe anytime.
            </p>

            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                  data-testid="input-email"
                />
                <Button type="submit" className="px-6" data-testid="button-subscribe">
                  Subscribe
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-4 max-w-md mx-auto"
              >
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Thanks for signing up!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll reach out when there's something exciting to share.
                </p>
              </motion.div>
            )}

            <p className="text-[11px] text-muted-foreground mt-4">
              We'll never share your email.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">One Million Qubits</span>
          </div>

          {/* Social media links */}
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/fbitti" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://x.com/1Mqubits" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="X (Twitter)">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@1mqubits" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="TikTok">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
            <a href="https://www.instagram.com/1mqubits/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z"/></svg>
            </a>
          </div>

          <div className="flex gap-4">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/policies" className="hover:text-foreground transition-colors">
              Policies
            </Link>
          </div>

          <p>&copy; {new Date().getFullYear()} One Million Qubits. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
