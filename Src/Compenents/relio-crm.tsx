import { useMemo, useState } from "react";
import { Cake, Check, FileSpreadsheet, Filter, Plus, Sparkles, Upload, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Client = {
  id: number;
  name: string;
  phone: string;
  visits: number;
  lastVisit: string;
  daysSince: number;
  vip: boolean;
  birthdayMonth: number;
  habits: string[];
};

const currentMonth = new Date().getMonth() + 1;

const clients: Client[] = [
  { id: 1, name: "Camille", phone: "06 12 34 56 78", visits: 12, lastVisit: "il y a 4 jours", daysSince: 4, vip: true, birthdayMonth: currentMonth, habits: ["Coupe habituelle", "Client VIP"] },
  { id: 2, name: "Yanis", phone: "06 98 76 54 32", visits: 2, lastVisit: "il y a 74 jours", daysSince: 74, vip: false, birthdayMonth: 3, habits: ["Préférence produit"] },
  { id: 3, name: "Sofia", phone: "07 45 23 89 10", visits: 8, lastVisit: "il y a 12 jours", daysSince: 12, vip: true, birthdayMonth: currentMonth, habits: ["Client VIP", "Sans parfum"] },
  { id: 4, name: "Marc", phone: "06 33 21 44 55", visits: 5, lastVisit: "il y a 65 jours", daysSince: 65, vip: false, habits: ["Coupe habituelle"], birthdayMonth: 11 },
  { id: 5, name: "Léa", phone: "07 11 22 33 44", visits: 1, lastVisit: "il y a 9 jours", daysSince: 9, vip: false, birthdayMonth: 7, habits: ["Nouveau client"] },
  { id: 6, name: "Hugo", phone: "06 77 88 99 00", visits: 21, lastVisit: "il y a 2 jours", daysSince: 2, vip: true, birthdayMonth: 2, habits: ["Client VIP", "Préférence produit"] },
];

type CustomFilter = {
  id: string;
  name: string;
  field: "habits" | "visits";
  value: string;
  auto?: boolean;
};

const baseFilters = [
  { id: "tous", label: "Tous", icon: Users },
  { id: "relancer", label: "À relancer", icon: Sparkles },
  { id: "vip", label: "VIP", icon: Check },
  { id: "anniversaires", label: "Anniversaires du mois", icon: Cake },
] as const;

export function RelioCrm() {
  const [activeFilter, setActiveFilter] = useState<string>("tous");
  const [customFilters, setCustomFilters] = useState<CustomFilter[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importDone, setImportDone] = useState(false);

  const [draftName, setDraftName] = useState("");
  const [draftField, setDraftField] = useState<"habits" | "visits">("habits");
  const [draftValue, setDraftValue] = useState("");

  const visible = useMemo(() => {
    const custom = customFilters.find((item) => item.id === activeFilter);
    if (custom) {
      if (custom.field === "habits") {
        const needle = custom.value.toLowerCase();
        return clients.filter((client) =>
          client.habits.some((habit) => habit.toLowerCase().includes(needle)),
        );
      }
      const threshold = Number(custom.value) || 0;
      return clients.filter((client) => client.visits > threshold);
    }
    if (activeFilter === "relancer") return clients.filter((client) => client.daysSince >= 60);
    if (activeFilter === "vip") return clients.filter((client) => client.vip);
    if (activeFilter === "anniversaires")
      return clients.filter((client) => client.birthdayMonth === currentMonth);
    return clients;
  }, [activeFilter, customFilters]);

  function saveFilter() {
    const name = draftName.trim();
    const value = draftValue.trim();
    if (!name || !value) return;
    const id = `custom-${Date.now()}`;
    setCustomFilters((current) => [...current, { id, name, field: draftField, value }]);
    setActiveFilter(id);
    setDraftName("");
    setDraftValue("");
    setCreateOpen(false);
  }

  function removeFilter(id: string) {
    setCustomFilters((current) => current.filter((item) => item.id !== id));
    setActiveFilter((current) => (current === id ? "tous" : current));
  }

  function runImport() {
    const detected: CustomFilter[] = [
      { id: "auto-preferences", name: "Préférences : Sans parfum", field: "habits", value: "sans parfum", auto: true },
      { id: "auto-vip", name: "Catégories : Client VIP", field: "habits", value: "client vip", auto: true },
      { id: "auto-fideles", name: "Passages > 5", field: "visits", value: "5", auto: true },
    ];
    setCustomFilters((current) => [
      ...current.filter((item) => !item.auto),
      ...detected,
    ]);
    setImportDone(true);
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Users aria-hidden="true" className="h-3.5 w-3.5" />
              Base clients
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Vos clients, triés intelligemment
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Retrouvez en un clic les clients à relancer, vos habitués ou les anniversaires du
              mois — et créez vos propres filtres.
            </p>
          </div>

          <Dialog
            open={importOpen}
            onOpenChange={(open) => {
              setImportOpen(open);
              if (!open) setImportDone(false);
            }}
          >
            <DialogTrigger asChild>
              <Button type="button" variant="secondary">
                <Upload aria-hidden="true" className="h-4 w-4" /> Importer un fichier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Importer vos clients</DialogTitle>
                <DialogDescription>
                  Fichier CSV ou Excel exporté de votre caisse ou de votre agenda.
                </DialogDescription>
              </DialogHeader>

              {importDone ? (
                <div className="rounded-[var(--radius-panel)] border border-autopilot-border bg-autopilot p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Sparkles aria-hidden="true" className="h-4 w-4 text-primary" />
                    Relio a automatiquement détecté et créé 3 nouveaux filtres à partir de vos
                    colonnes (Préférences, Catégories, Passages).
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-foreground">
                    {customFilters
                      .filter((item) => item.auto)
                      .map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                          <Check aria-hidden="true" className="h-4 w-4 text-success" />
                          {item.name}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-panel)] border border-dashed border-input bg-subtle p-8 text-center">
                  <FileSpreadsheet aria-hidden="true" className="h-7 w-7 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Déposez votre fichier ici
                  </span>
                  <span className="text-xs text-muted-foreground">Formats .csv, .xlsx</span>
                  <input type="file" accept=".csv,.xlsx" className="sr-only" onChange={runImport} />
                </label>
              )}

              <DialogFooter>
                {importDone ? (
                  <Button type="button" onClick={() => setImportOpen(false)}>
                    Voir mes clients
                  </Button>
                ) : (
                  <Button type="button" onClick={runImport}>
                    Lancer l'import
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <div className="mt-8 flex flex-wrap gap-2">
          {baseFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <Button
                key={filter.id}
                type="button"
                size="sm"
                variant={isActive ? "default" : "secondary"}
                onClick={() => setActiveFilter(filter.id)}
                aria-pressed={isActive}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {filter.label}
              </Button>
            );
          })}

          {customFilters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <span
                key={filter.id}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm",
                  isActive
                    ? "border-autopilot-border bg-autopilot text-foreground"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 font-medium"
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <Filter aria-hidden="true" className="h-3.5 w-3.5" />
                  {filter.name}
                </button>
                <button
                  type="button"
                  aria-label={`Supprimer le filtre ${filter.name}`}
                  onClick={() => removeFilter(filter.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </span>
            );
          })}

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button type="button" size="sm" variant="outline">
                <Plus aria-hidden="true" className="h-4 w-4" /> Créer un filtre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Créer un filtre personnalisé</DialogTitle>
                <DialogDescription>
                  Choisissez une règle simple, donnez-lui un nom, et retrouvez-la en un clic.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Règle</Label>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={draftField}
                      onValueChange={(value) => setDraftField(value as "habits" | "visits")}
                    >
                      <SelectTrigger className="w-[190px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="habits">Habitudes contient</SelectItem>
                        <SelectItem value="visits">Nombre de passages &gt;</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      className="w-[170px]"
                      value={draftValue}
                      placeholder={draftField === "habits" ? "Ex : Coupe habituelle" : "Ex : 5"}
                      inputMode={draftField === "visits" ? "numeric" : "text"}
                      onChange={(event) => setDraftValue(event.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="filter-name">Nom du filtre</Label>
                  <Input
                    id="filter-name"
                    value={draftName}
                    maxLength={40}
                    placeholder="Ex : Mes habitués du samedi"
                    onChange={(event) => setDraftName(event.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" onClick={saveFilter} disabled={!draftName || !draftValue}>
                  Enregistrer le filtre
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {visible.length} client{visible.length > 1 ? "s" : ""} affiché
          {visible.length > 1 ? "s" : ""}
        </p>

        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {visible.map((client) => (
            <li
              key={client.id}
              className="rounded-[var(--radius-panel)] border border-border bg-card p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-bold text-foreground">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{client.phone}</p>
                </div>
                {client.vip ? (
                  <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">
                    VIP
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {client.visits} passages · dernière visite {client.lastVisit}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {client.habits.map((habit) => (
                  <span
                    key={habit}
                    className="rounded-full bg-subtle px-2 py-0.5 text-xs text-foreground"
                  >
                    {habit}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        {visible.length === 0 ? (
          <p className="mt-6 rounded-[var(--radius-panel)] border border-dashed border-input bg-subtle p-6 text-center text-sm text-muted-foreground">
            Aucun client ne correspond à ce filtre.
          </p>
        ) : null}
      </div>
    </main>
  );
}
