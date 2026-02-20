import { Link, useLocation } from "wouter";
import { Atom, Home, Info, Mail, Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bloch-sphere", label: "Bloch Sphere", icon: Atom },
  { href: "/about", label: "About", icon: Info },
  { href: "/newsletter", label: "Newsletter", icon: Mail },
  { href: "/policies", label: "Policies", icon: Shield },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background overflow-hidden">
      <header className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-card/50 flex-shrink-0 z-50">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="link-home">
          <Atom className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold tracking-tight hidden sm:inline">Quantum Computing Practice Tools</span>
          <span className="text-sm font-bold tracking-tight sm:hidden">Quantum Tools</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}>
              <Button
                variant={location === href ? "secondary" : "ghost"}
                size="sm"
                className="text-xs"
                data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {label}
              </Button>
            </Link>
          ))}
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
        <div className="md:hidden border-b border-border bg-card/80 px-4 py-2 flex flex-col gap-1 flex-shrink-0 z-40" data-testid="nav-mobile">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={location === href ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start text-xs gap-2"
                data-testid={`nav-mobile-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Button>
            </Link>
          ))}
        </div>
      )}

      <main className="flex-1 overflow-hidden min-h-0">
        {children}
      </main>
    </div>
  );
}
