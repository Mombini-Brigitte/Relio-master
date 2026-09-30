import { useState } from "react";
import { Cake, Check, HandHeart, MessageSquareText, Timer, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const templates = [
  {
    id: "bienvenue",
    name: "Bienvenue",
    icon: HandHeart,
    goal: "Envoyé juste après l'ajout d'un nouveau client en caisse.",
    message:
      "Bonjour {prenom}, bienvenue chez {commerce} ! Merci pour votre visite, on a hâte de vous revoir.",
  },
  {
    id: "inactivite",
    name: "Relance Inactivité",
    icon: Timer,
    goal: "Envoyé automatiquement après 60 jours sans visite.",
    message:
      "{prenom}, cela fait un moment ! Toute l'équipe de {commerce} serait ravie de vous revoir cette semaine.",
  },
  {
    id: "anniversaire",
    name: "Anniversaire",
    icon: Cake,
    goal: "Envoyé le matin du jour d'anniversaire du client.",
    message:
      "Joyeux anniversaire {prenom} ! {commerce} vous offre -15% sur votre prochaine visite.",
  },
  {
    id: "vente-flash",
    name: "Vente Flash",
    icon: Zap,
    goal: "À déclencher pour un week-end ou une opération spéciale.",
    message:
      "{prenom}, vente flash chez {commerce} ce week-end : -20% sur tout. À très vite !",
  },
];

const variables = ["{prenom}", "{commerce}"];

export function RelioSmsTemplates() {
  const [active, setActive] = useState<string[]>(["bienvenue"]);

  function toggle(id: string) {
    setActive((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-4xl">
        <header className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <MessageSquareText aria-hidden="true" className="h-3.5 w-3.5" />
            Bibliothèque de messages
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Modèles de SMS prêts à l'emploi
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Activez un modèle en un clic. Les variables sont remplacées automatiquement à l'envoi :{" "}
            {variables.map((variable) => (
              <code
                key={variable}
                className="mx-0.5 rounded bg-subtle px-1.5 py-0.5 font-mono text-xs text-foreground"
              >
                {variable}
              </code>
            ))}
            .
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {templates.map((template) => {
            const Icon = template.icon;
            const isActive = active.includes(template.id);

            return (
              <article
                key={template.id}
                className={cn(
                  "flex flex-col rounded-[var(--radius-panel)] border bg-card p-5 shadow-card transition-colors",
                  isActive ? "border-autopilot-border bg-autopilot" : "border-border",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Icon aria-hidden="true" className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h2 className="font-display text-base font-bold text-foreground">
                      {template.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">{template.goal}</p>
                  </div>
                </div>

                <p className="mt-4 flex-1 rounded-lg bg-subtle p-3 text-sm leading-6 text-foreground">
                  {template.message}
                </p>

                <Button
                  type="button"
                  variant={isActive ? "secondary" : "default"}
                  className="mt-4 w-full"
                  onClick={() => toggle(template.id)}
                  aria-pressed={isActive}
                >
                  {isActive ? (
                    <>
                      <Check aria-hidden="true" className="h-4 w-4" /> Activé
                    </>
                  ) : (
                    "Activer"
                  )}
                </Button>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
