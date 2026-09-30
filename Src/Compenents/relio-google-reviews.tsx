import { useState } from "react";
import { Star } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const delays = ["2 heures", "24 heures", "48 heures"];

export function RelioGoogleReviews() {
  const [enabled, setEnabled] = useState(true);
  const [delay, setDelay] = useState("24 heures");
  const [link, setLink] = useState("https://g.page/r/mon-commerce/review");

  return (
    <section
      className={cn(
        "rounded-[var(--radius-panel)] border bg-card p-5 shadow-card transition-colors sm:p-6",
        enabled ? "border-autopilot-border bg-autopilot" : "border-border",
      )}
      aria-labelledby="avis-google-title"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Star aria-hidden="true" className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2
              id="avis-google-title"
              className="font-display text-base font-bold text-foreground"
            >
              Avis Google automatiques
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Après chaque passage en caisse, Relio envoie un SMS invitant le client à laisser un
              avis Google.
            </p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label="Activer l'envoi automatique de demandes d'avis Google"
        />
      </div>

      <div className={cn("mt-5 space-y-4", !enabled && "pointer-events-none opacity-50")}>
        <div className="space-y-2">
          <Label htmlFor="avis-link">Lien vers votre fiche Google</Label>
          <Input
            id="avis-link"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://g.page/..."
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">Envoi après le passage</legend>
          <div className="flex flex-wrap gap-2">
            {delays.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDelay(option)}
                aria-pressed={delay === option}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  delay === option
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-accent",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="rounded-lg bg-subtle p-3 text-sm leading-6 text-foreground">
          « Merci pour votre visite {"{prenom}"} ! Un avis sur Google nous aide beaucoup :{" "}
          {link || "votre lien"} »
        </p>
      </div>
    </section>
  );
}
