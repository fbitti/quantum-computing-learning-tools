import { useEffect } from "react";
import { Link } from "wouter";
import { Atom, BookOpen, Wrench, Target } from "lucide-react";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About | One Million Qubits";
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Atom className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight" data-testid="text-about-title">
            About One Million Qubits
          </h1>
        </div>

        <div className="text-sm text-muted-foreground space-y-5 leading-relaxed">
          <p>
            <span className="font-semibold text-foreground">One Million Qubits</span> is a
            quantum computing learning platform built for students, professionals pivoting into
            quantum, and anyone curious about this transformative technology.
          </p>

          <p>
            Our mission is simple: make quantum computing concepts accessible, interactive, and
            practical. We believe the best way to learn quantum is by doing — not just reading
            about it.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 py-4">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Wrench className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Interactive Tools</p>
                <p className="text-xs">
                  Hands-on tools like the Bloch Sphere Explorer and Pauli Trainer, with more
                  on the way.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Study Guides</p>
                <p className="text-xs">
                  In-depth content including a Qiskit Certification study eBook to help you go
                  from fundamentals to certification.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Career-Focused</p>
                <p className="text-xs">
                  Built by someone making the pivot into quantum computing — the content is
                  designed with real career goals in mind.
                </p>
              </div>
            </div>
          </div>

          <p>
            This platform is actively being built and expanded. New tools, study materials, and
            features are added regularly. Sign up on our{" "}
            <Link href="/" className="text-primary underline underline-offset-2">
              home page
            </Link>{" "}
            to get notified as we grow.
          </p>
        </div>
      </div>
    </div>
  );
}
