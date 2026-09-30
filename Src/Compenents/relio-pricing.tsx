import {
  BadgeCheck,
  Check,
  CreditCard,
  Mail,
  MessageCircle,
  MessageSquare,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "39,90 €",
    sms: "100 SMS inclus par mois",
    tagline: "Pour démarrer facilement.",
    features: [
      "Bouton « Ajout Flash » client",
      "CRM simplifié avec filtres auto-détectés",
      "Pilote Automatique de base",
      "Programme de fidélité automatique",
    ],
    icon: Rocket,
  },
  {
    name: "Pro",
    price: "59,90 €",
    sms: "500 SMS inclus par mois",
    tagline: "Pour automatiser tout votre marketing.",
    features: [
      "Accès illimité aux campagnes WhatsApp Business & Email",
      "Autopilot IA avancé (relances anniversaire, inactifs, avis Google)",
      "Studio de prévisualisation multi-canal",
      "Support prioritaire",
    ],
    popular: true,
    icon: Zap,
  },
  {
    name: "Elite",
    price: "79,90 €",
    sms: "800 SMS inclus par mois",
    tagline: "Pour piloter plusieurs points de vente.",
    features: [
      "Gestion multi-comptes / multi-caisses pour points de vente",
      "Tableau de bord Analytics avancé (calcul du CA généré)",
      "Support dédié 7j/7",
    ],
    icon: Sparkles,
  },
];

const packs = [
  {
    name: "Pack Micro",
    price: "19,90 €",
    explanation: "Idéal pour une vente flash ou un coup de boost le week-end.",
    badge: "~0,13 € / SMS",
    icon: CreditCard,
    composition: [
      { icon: MessageSquare, label: "150 SMS" },
      { icon: MessageCircle, label: "50 WhatsApp Business" },
      { icon: Mail, label: "1 Emailing" },
    ],
  },
  {
    name: "Pack Boost",
    price: "69,90 €",
    explanation: "Parfait pour réussir une grosse période comme les Soldes ou la Fête des Mères.",
    badge: "~0,10 € / SMS",
    badgeDetail: "Économisez 20%",
    recommended: true,
    icon: Zap,
    composition: [
      { icon: MessageSquare, label: "700 SMS" },
      { icon: MessageCircle, label: "300 WhatsApp Business" },
      { icon: Mail, label: "2 Emailings" },
    ],
  },
  {
    name: "Pack Pro",
    price: "169,90 €",
    explanation: "Le grand format pour préparer les Fêtes de fin d'année avec le tarif le plus bas.",
    badge: "~0,08 € / SMS",
    badgeDetail: "Meilleur tarif",
    icon: BadgeCheck,
    composition: [
      { icon: MessageSquare, label: "2 000 SMS" },
      { icon: MessageCircle, label: "600 WhatsApp Business" },
      { icon: Mail, label: "4 Emailings" },
    ],
  },
];

function PlanFeature({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-6 text-foreground">
      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" />
      <span>{label}</span>
    </li>
  );
}

function SmsBadge({ children, variant }: { children: React.ReactNode; variant: "solid" | "soft" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variant === "solid" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function RelioPricing() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Des tarifs simples, transparents et adaptés à votre commerce.
          </h1>
        </header>

        <section aria-labelledby="abonnements-title" className="mt-10 sm:mt-14">
          <h2 id="abonnements-title" className="font-display text-xl font-semibold text-foreground">
            Abonnements Mensuels <span className="font-normal text-muted-foreground">(Tout-en-un)</span>
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <article
                  key={plan.name}
                  className={cn(
                    "relative flex flex-col overflow-hidden rounded-[var(--radius-panel)] border bg-card p-6 shadow-card",
                    plan.popular ? "border-primary shadow-panel" : "border-border",
                  )}
                >
                  {plan.popular ? (
                    <p className="absolute inset-x-0 top-0 bg-primary py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                      Le plus populaire
                    </p>
                  ) : null}

                  <div className={cn("flex items-center gap-2.5", plan.popular && "mt-6")}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                      <Icon aria-hidden="true" className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
                  </div>

                  <p className="mt-4 flex items-baseline gap-1.5">
                    <span className="font-display text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">TTC / mois</span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary">{plan.sms}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{plan.tagline}</p>

                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-border pt-5">
                    {plan.features.map((feature) => (
                      <PlanFeature key={feature} label={feature} />
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                    className={cn("mt-6 h-12 w-full text-base", plan.popular && "shadow-action")}
                  >
                    Choisir {plan.name}
                  </Button>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="recharges-title" className="mt-12 sm:mt-16">
          <h2 id="recharges-title" className="font-display text-xl font-semibold text-foreground">
            Recharges SMS ponctuelles{" "}
            <span className="font-normal text-muted-foreground">(Sans engagement)</span>
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Épuisé votre quota ? Ajoutez des SMS valables à vie en 1 clic.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {packs.map((pack) => {
              const Icon = pack.icon;
              return (
                <article
                  key={pack.name}
                  className={cn(
                    "relative flex flex-col overflow-hidden rounded-[var(--radius-panel)] border bg-card p-6 shadow-card",
                    pack.recommended ? "border-primary shadow-panel" : "border-border",
                  )}
                >
                  {pack.recommended ? (
                    <p className="absolute inset-x-0 top-0 bg-primary py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                      Recommandé
                    </p>
                  ) : null}

                  <div className={cn("flex items-center justify-between gap-3", pack.recommended && "mt-6")}>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-autopilot text-primary">
                        <Icon aria-hidden="true" className="h-4.5 w-4.5" />
                      </span>
                      <h3 className="truncate font-display text-lg font-semibold text-foreground">{pack.name}</h3>
                    </div>
                    <SmsBadge variant={pack.recommended ? "solid" : "soft"}>{pack.badge}</SmsBadge>
                  </div>

                  <p className="mt-4 font-display text-3xl font-bold text-foreground">{pack.price}</p>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{pack.explanation}</p>

                  <ul className="mt-4 space-y-2 border-t border-border pt-4">
                    {pack.composition.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <li key={item.label} className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                          <ItemIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                          <span>{item.label}</span>
                        </li>
                      );
                    })}
                  </ul>

                  {pack.badgeDetail ? (
                    <p className="mt-3 rounded-md bg-success-soft px-3 py-2 text-xs font-semibold text-success">
                      {pack.badgeDetail}
                    </p>
                  ) : null}

                  <Button
                    size="lg"
                    variant={pack.recommended ? "default" : "outline"}
                    className={cn("mt-5 h-12 w-full text-base", pack.recommended && "shadow-action")}
                  >
                    Ajouter en 1 clic
                  </Button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
