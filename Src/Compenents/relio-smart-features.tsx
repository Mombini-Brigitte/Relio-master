import { useMemo, useState } from "react";
import {
  BadgeEuro,
  Check,
  Download,
  Gift,
  Lightbulb,
  Printer,
  QrCode,
  Send,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const QR_SIZE = 21;

/** Grille décorative type QR (déterministe, sans dépendance), rendue en SVG. */
function QrVisual({ value }: { value: string }) {
  const cells = useMemo(() => {
    const out: boolean[] = [];
    let seed = 0;
    for (let i = 0; i < value.length; i += 1) seed = (seed * 31 + value.charCodeAt(i)) % 100000;
    for (let i = 0; i < QR_SIZE * QR_SIZE; i += 1) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      out.push(seed % 100 > 48);
    }
    return out;
  }, [value]);

  const rects: { x: number; y: number }[] = [];
  cells.forEach((on, index) => {
    const r = Math.floor(index / QR_SIZE);
    const c = index % QR_SIZE;
    const finder = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
    const inFinderRing = finder && (r % 6 === 0 || c % 6 === 0);
    const inFinderCore =
      (r > 1 && r < 5 && c > 1 && c < 5) ||
      (r > 1 && r < 5 && c > 15 && c < 19) ||
      (r > 15 && r < 19 && c > 1 && c < 5);
    if (finder ? inFinderRing || inFinderCore : on) rects.push({ x: c, y: r });
  });

  return (
    <svg
      viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
      className="h-40 w-40 rounded-lg bg-card p-2 shadow-card"
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR Code d'inscription client"
    >
      {rects.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={1}
          height={1}
          className="fill-foreground"
        />
      ))}
    </svg>
  );
}

const inspirations = [
  {
    id: "rentree",
    season: "Rentrée",
    icon: Sparkles,
    message:
      "{prenom}, c'est la rentrée chez {commerce} ! -10% sur tout jusqu'à dimanche pour bien repartir.",
  },
  {
    id: "fetes",
    season: "Fêtes de fin d'année",
    icon: Gift,
    message:
      "{prenom}, {commerce} prépare vos fêtes : nos coffrets cadeaux sont arrivés. Réservez le vôtre !",
  },
  {
    id: "flash",
    season: "Vente Flash",
    icon: Zap,
    message: "{prenom}, 3 heures seulement : -20% chez {commerce} aujourd'hui. À tout de suite !",
  },
];

export function RelioSmartFeatures() {
  const [shopName, setShopName] = useState("Chez Camille");
  const [flashMessage, setFlashMessage] = useState(
    "{prenom}, vente flash chez {commerce} : -20% jusqu'à 18h. Passez vite !",
  );
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const audience = 128;

  function sendFlash() {
    setSent(true);
    window.setTimeout(() => setSent(false), 2500);
  }

  function useInspiration(id: string, message: string) {
    setFlashMessage(message);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <header className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Lightbulb aria-hidden="true" className="h-3.5 w-3.5" />
            Fonctionnalités intelligentes
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Remplissez vos heures creuses, sans effort
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Quatre outils prêts à l'emploi pour faire revenir vos clients et suivre ce que Relio
            rapporte réellement à votre commerce.
          </p>
        </header>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {/* QR Code caisse */}
          <section className="rounded-[var(--radius-panel)] border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <QrCode aria-hidden="true" className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-foreground">
                  Générateur de QR Code caisse
                </h2>
                <p className="text-xs text-muted-foreground">
                  Vos clients s'inscrivent seuls, en 10 secondes.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <Label htmlFor="shop-name">Nom affiché sur le flyer</Label>
              <Input
                id="shop-name"
                value={shopName}
                maxLength={40}
                onChange={(event) => setShopName(event.target.value)}
              />
            </div>

            <div className="mt-5 rounded-[var(--radius-panel)] border border-dashed border-autopilot-border bg-autopilot p-5 text-center">
              <p className="font-display text-lg font-bold text-foreground">{shopName}</p>
              <p className="mt-1 text-sm text-foreground">
                Scannez pour recevoir nos offres et cumuler votre fidélité
              </p>
              <div className="mt-4 flex justify-center">
                <QrVisual value={shopName} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Aucune application à installer · Désinscription à tout moment
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" onClick={() => window.print()}>
                <Printer aria-hidden="true" className="h-4 w-4" /> Imprimer le flyer
              </Button>
              <Button type="button" variant="secondary">
                <Download aria-hidden="true" className="h-4 w-4" /> Télécharger
              </Button>
            </div>
          </section>

          {/* SMS vente flash */}
          <section className="rounded-[var(--radius-panel)] border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Zap aria-hidden="true" className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-foreground">
                  SMS Vente Flash
                </h2>
                <p className="text-xs text-muted-foreground">
                  Une promo express à vos clients fidèles, en 1 clic.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <Label htmlFor="flash-message">Message envoyé</Label>
              <Textarea
                id="flash-message"
                value={flashMessage}
                maxLength={300}
                rows={4}
                onChange={(event) => setFlashMessage(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {flashMessage.length}/300 caractères · variables {"{prenom}"} et {"{commerce}"}
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-subtle p-3 text-sm text-foreground">
              Destinataires : <strong>{audience} clients fidèles</strong> (au moins 3 passages,
              inscrits aux offres).
            </div>

            <Button
              type="button"
              className="mt-4 w-full shadow-action"
              onClick={sendFlash}
              disabled={sent}
            >
              {sent ? (
                <>
                  <Check aria-hidden="true" className="h-4 w-4" /> Envoyé à {audience} clients
                </>
              ) : (
                <>
                  <Send aria-hidden="true" className="h-4 w-4" /> Envoyer la vente flash
                </>
              )}
            </Button>
          </section>

          {/* Assistant d'inspiration */}
          <section className="rounded-[var(--radius-panel)] border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Lightbulb aria-hidden="true" className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-foreground">
                  Assistant d'inspiration
                </h2>
                <p className="text-xs text-muted-foreground">
                  Des messages saisonniers prêts à envoyer.
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {inspirations.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.id}
                    className="rounded-[var(--radius-panel)] border border-border bg-subtle p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                      {item.season}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-foreground">{item.message}</p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      onClick={() => useInspiration(item.id, item.message)}
                    >
                      {copied === item.id ? (
                        <>
                          <Check aria-hidden="true" className="h-4 w-4" /> Prêt à envoyer
                        </>
                      ) : (
                        "Utiliser ce message"
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Bilan mensuel */}
          <section className="rounded-[var(--radius-panel)] border border-autopilot-border bg-autopilot p-6 shadow-panel">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-primary">
                <TrendingUp aria-hidden="true" className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-foreground">
                  Bilan du mois
                </h2>
                <p className="text-xs text-muted-foreground">Septembre · mis à jour aujourd'hui</p>
              </div>
            </div>

            <div className="mt-5 rounded-[var(--radius-panel)] bg-card p-5 text-center shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Chiffre d'affaires estimé généré par Relio
              </p>
              <p className="mt-2 flex items-center justify-center gap-2 font-display text-4xl font-bold text-success">
                <BadgeEuro aria-hidden="true" className="h-7 w-7" />
                2 480 €
              </p>
              <p className="mt-2 inline-flex rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
                +18 % par rapport au mois dernier
              </p>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { label: "SMS envoyés", value: "412" },
                { label: "Clients revenus", value: "63" },
                { label: "Panier moyen", value: "39 €" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-card p-3 shadow-card">
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd className="mt-1 font-display text-lg font-bold text-foreground">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Estimation basée sur les clients revenus dans les 14 jours suivant un message Relio,
              multipliés par votre panier moyen.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
