import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Moon, Plus, Sun, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RelioLogo } from "@/components/relio-logo";

const navItems = [
  { to: "/clients" as const, label: "Clients" },
  { to: "/fonctionnalites" as const, label: "Fonctionnalités" },
  { to: "/historique" as const, label: "Historique" },
  { to: "/tarifs" as const, label: "Tarifs" },
  { to: "/reglages" as const, label: "Réglages" },
];

export function RelioHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("relio-theme");
    const nextDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", nextDark);
    setDark(nextDark);
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    window.localStorage.setItem("relio-theme", nextDark ? "dark" : "light");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link to="/" aria-label="Accueil Relio" onClick={() => setMenuOpen(false)}>
          <RelioLogo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={dark ? "Activer le mode clair" : "Activer le mode sombre"}>
            {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/ajouter"><Plus aria-hidden="true" />Ajouter un client</Link>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {menuOpen ? (
        <nav aria-label="Navigation mobile" className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold text-muted-foreground" activeProps={{ className: "bg-accent text-foreground" }}>
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-2 sm:hidden">
              <Link to="/ajouter" onClick={() => setMenuOpen(false)}><Plus aria-hidden="true" />Ajouter un client</Link>
            </Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
