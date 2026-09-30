import { useState } from "react";
import { BarChart3, CheckCircle2, Euro, MessageSquare, Users } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const stats = [
  {
    id: "ca",
    icon: Euro,
    value: "1 240 €",
    label: "Chiffre d'affaires généré",
    hint: "Ce mois-ci, grâce à vos relances Relio",
  },
  {
    id: "avis",
    icon: MessageSquare,
    value: "+18 avis",
    label: "Nouveaux avis Google récoltés",
    hint: "dont 18 avis 5★ laissés par vos clients",
  },
  {
    id: "clients",
    icon: Users,
    value: "142 clients",
    label: "Clients relancés automatiquement",
    hint: "inactifs, anniversaires et visites à relancer",
  },
];

export function RelioMonthlyPerformance() {
  const [autoRelance, setAutoRelance] = useState(false);

  return (
    <section
      aria-labelledby="performances-title"
      className="rounded-[var(--radius-panel)] border bg-card p-5 shadow-card sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <BarChart3 aria-hidden="true" className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2
            id="performances-title"
            className="font-display text-base font-bold text-foreground"
          >
            Performances du mois
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Ce que Relio a généré pour votre commerce depuis le 1er du mois.
          </p>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {stats.map(({ id, icon: Icon, value, label, hint }) => (
          <div
            key={id}
            className="rounded-[var(--radius-panel)] border border-border bg-subtle p-4"
          >
            <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
              {label}
            </dt>
            <dd className="mt-2">
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                {value}
              </span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">{hint}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div
        className={cn(
          "mt-4 flex flex-col gap-3 rounded-[var(--radius-panel)] border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
          autoRelance ? "border-autopilot-border bg-autopilot" : "border-border bg-card",
        )}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            aria-hidden="true"
            className={cn("mt-0.5 h-5 w-5 shrink-0", autoRelance ? "text-primary" : "text-muted-foreground")}
          />
          <div>
            <p className="text-sm font-bold text-foreground">
              Relance automatique des clients inactifs
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {autoRelance
                ? "Activé : Relio renvoie un SMS doux aux clients qui n'ont pas donné de nouvelles depuis 30 jours."
                : "Relio peut envoyer un SMS doux aux clients qui n'ont pas donné de nouvelles depuis 30 jours."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-8 sm:pl-0">
          <span
            className={cn(
              "text-sm font-bold",
              autoRelance ? "text-primary" : "text-muted-foreground",
            )}
          >
            {autoRelance ? "ON" : "OFF"}
          </span>
          <Switch
            checked={autoRelance}
            onCheckedChange={setAutoRelance}
            aria-label="Activer la relance automatique des clients inactifs"
          />
        </div>
      </div>
    </section>
  );
}
