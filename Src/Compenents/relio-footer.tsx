import { Link } from "@tanstack/react-router";

import { RelioLogo } from "@/components/relio-logo";

const legalLinks = [
  { to: "/mentions-legales" as const, label: "Mentions légales" },
  { to: "/politique-de-confidentialite" as const, label: "Confidentialité" },
  { to: "/cgu" as const, label: "Conditions d’utilisation" },
  { to: "/cgv" as const, label: "Conditions de vente" },
];

export function RelioFooter() {
  return (
    <footer className="border-t border-border bg-canvas">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link to="/" aria-label="Accueil Relio" className="inline-flex">
            <RelioLogo />
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            La fidélité client, simplement pensée pour les commerces de proximité.
          </p>
          <a
            href="mailto:goldenchloepro@gmail.com"
            className="mt-3 inline-block text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            goldenchloepro@gmail.com
          </a>
        </div>

        <div className="lg:text-right">
          <nav aria-label="Informations juridiques" className="flex max-w-2xl flex-wrap gap-x-5 gap-y-3 lg:justify-end">
            {legalLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="mt-5 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Relio — Brigitte Mombini EI. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
