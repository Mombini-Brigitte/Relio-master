import { useEffect, useState } from "react";
import { CheckCircle2, Radio } from "lucide-react";

import { cn } from "@/lib/utils";

type Entry = {
  id: number;
  name: string;
  type: "Autopilot" | "Manuel";
  template: string;
  time: string;
};

const initial: Entry[] = [
  { id: 1, name: "Camille", type: "Autopilot", template: "Bienvenue", time: "08:42" },
  { id: 2, name: "Yanis", type: "Manuel", template: "Vente Flash", time: "08:35" },
  { id: 3, name: "Sofia", type: "Autopilot", template: "Anniversaire", time: "08:12" },
  { id: 4, name: "Marc", type: "Autopilot", template: "Relance Inactivité", time: "07:58" },
  { id: 5, name: "Léa", type: "Manuel", template: "Vente Flash", time: "07:41" },
];

const upcoming: Omit<Entry, "id" | "time">[] = [
  { name: "Noah", type: "Autopilot", template: "Bienvenue" },
  { name: "Inès", type: "Autopilot", template: "Avis Google" },
  { name: "Thomas", type: "Manuel", template: "Vente Flash" },
];

export function RelioSmsHistory() {
  const [entries, setEntries] = useState<Entry[]>(initial);

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      const next = upcoming[index % upcoming.length]!;
      index += 1;
      setEntries((current) => [
        {
          ...next,
          id: Date.now(),
          time: new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...current,
      ]);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-canvas px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-3xl">
        <header className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Radio aria-hidden="true" className="h-3.5 w-3.5" />
            Temps réel
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Historique des envois
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Chaque SMS parti de votre commerce, avec le client concerné et son statut.
          </p>
        </header>

        <ul className="mt-8 space-y-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-4 rounded-[var(--radius-panel)] border border-border bg-card p-4 shadow-card"
            >
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-foreground">{entry.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {entry.template} · {entry.time}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    entry.type === "Autopilot"
                      ? "bg-autopilot text-secondary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {entry.type}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                  <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                  Envoyé
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
