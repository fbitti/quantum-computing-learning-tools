import { useEffect } from "react";
import { Link } from "wouter";
import { Atom, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools = [
  {
    id: "bloch-sphere",
    title: "Bloch Sphere Explorer",
    description: "Visualize qubit states on a 3D Bloch sphere. Apply Rx, Ry, and Rz rotation gates using interactive drag-to-rotate cranks and preset quantum angle buttons.",
    icon: Atom,
    href: "/bloch-sphere",
    available: true,
  },
  {
    id: "more-tools",
    title: "More Tools Coming Soon",
    description: "Additional quantum computing practice tools are in development. Stay tuned for circuit builders, gate decomposition exercises, and more.",
    icon: Wrench,
    href: "#",
    available: false,
  },
];

export default function HomePage() {
  useEffect(() => { document.title = "Quantum Computing Practice Tools"; }, []);
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight mb-2" data-testid="text-home-title">
            Quantum Computing Practice Tools
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto" data-testid="text-home-subtitle">
            Interactive tools to help you build intuition for quantum computing concepts.
            Explore, experiment, and learn by doing.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.id}
                className={tool.available ? "hover-elevate cursor-pointer" : "opacity-60"}
                data-testid={`card-tool-${tool.id}`}
              >
                <CardContent className="pt-5 pb-4 px-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <h2 className="text-sm font-semibold">{tool.title}</h2>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                  {tool.available ? (
                    <Link href={tool.href}>
                      <Button size="sm" className="w-full mt-1" data-testid={`button-launch-${tool.id}`}>
                        Launch Tool
                      </Button>
                    </Link>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="w-full mt-1" data-testid={`button-launch-${tool.id}`}>
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
