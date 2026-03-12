import { Link, useLocation } from "wouter";
import { Atom, Grid3X3, Home, Menu, X, ChevronDown, Wrench } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tools = [
  { href: "/bloch-sphere", label: "Bloch Sphere Explorer", icon: Atom },
  { href: "/pauli-trainer", label: "Pauli Trainer", icon: Grid3X3 },
];

const navLinks = [
  { href: "/", label: "Home", icon: Home },
];


function isToolRoute(location: string) {
  return tools.some((t) => t.href === location);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background overflow-hidden">
      <header className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-card/50 flex-shrink-0 z-50">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="link-home">
          <Atom className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold tracking-tight hidden sm:inline">One Million Qubits</span>
          <span className="text-sm font-bold tracking-tight sm:hidden">1MQ</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
          <Link href="/">
            <Button
              variant={location === "/" ? "secondary" : "ghost"}
              size="sm"
              className="text-xs"
              data-testid="nav-home"
            >
              Home
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isToolRoute(location) ? "secondary" : "ghost"}
                size="sm"
                className="text-xs gap-1"
                data-testid="nav-tools"
              >
                <Wrench className="w-3 h-3" />
                Tools
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" data-testid="nav-tools-dropdown">
              {tools.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <DropdownMenuItem
                    className={`cursor-pointer gap-2 text-xs ${location === href ? "bg-secondary" : ""}`}
                    data-testid={`nav-tool-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(o => !o)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[calc(2.5rem+1.25rem+1px)] left-0 right-0 border-b border-border bg-background px-4 py-2 flex flex-col gap-1 z-40 shadow-lg" data-testid="nav-mobile">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <Button
              variant={location === "/" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start text-xs gap-2"
              data-testid="nav-mobile-home"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Button>
          </Link>

          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pt-2 pb-0.5">Tools</p>
          {tools.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={location === href ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start text-xs gap-2 pl-6"
                data-testid={`nav-mobile-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Button>
            </Link>
          ))}

        </div>
      )}

      <main className="flex-1 overflow-hidden min-h-0 relative">
        {children}
      </main>
    </div>
  );
}
