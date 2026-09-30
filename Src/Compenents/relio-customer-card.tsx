import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { addClientAndSend } from "@/lib/clients.functions";
import {
  Check,
  ChevronDown,
  Gift,
  Plus,
  Sparkles,
  UserRoundPlus,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const habits = ["Coupe habituelle", "Préférence produit", "Client VIP"];

export function RelioCustomerCard() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [autopilot, setAutopilot] = useState(true);
  const [selectedHabits, setSelectedHabits] = useState<string[]>(["Client VIP"]);
  const [stamps, setStamps] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
  ]);
  const [errors, setErrors] = useState<{ firstName?: string; phone?: string }>({});
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [channel, setChannel] = useState<"sms" | "whatsapp">("sms");
  const [dialCode, setDialCode] = useState("+33");
  const submitClient = useServerFn(addClientAndSend);

  const stampCount = stamps.filter(Boolean).length;

  function toggleHabit(habit: string) {
    setSelectedHabits((current) =>
      current.includes(habit) ? current.filter((item) => item !== habit) : [...current, habit],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const firstName = String(form.get("firstName") ?? "").trim();
    const national = String(form.get("phone") ?? "").replace(/[\s.-]/g, "").replace(/^0/, "");
    const phone = `${dialCode}${national}`;
    const nextErrors: { firstName?: string; phone?: string } = {};

    if (!firstName || firstName.length > 60) nextErrors.firstName = "Indiquez un prénom valide.";
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) nextErrors.phone = "Numéro invalide.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await submitClient({ data: { firstName, phone, autopilot, channel, commerce: "votre commerce" } });
      if (res.sent) toast.success(`${firstName} ajouté — message ${channel === "sms" ? "SMS" : "WhatsApp"} envoyé.`);
      else if (res.error) toast.warning(`${firstName} ajouté, mais le message n'est pas parti : ${res.error}`);
      else toast.success(`${firstName} ajouté.`);
      formEl.reset();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Impossible d'enregistrer ce client.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-canvas px-4 py-8 sm:grid sm:place-items-center sm:px-8 sm:py-12">
      <section className="mx-auto w-full max-w-xl overflow-hidden rounded-[var(--radius-panel)] border border-border bg-card shadow-panel">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-5 py-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <UserRoundPlus aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-primary">Ajout flash</p>
              <h1 className="truncate font-display text-xl font-semibold text-foreground">Nouveau client</h1>
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Fermer la fiche">
            <X aria-hidden="true" />
          </Button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 px-5 py-6 sm:px-7">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                Prénom
              </label>
              <Input
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                maxLength={60}
                placeholder="Ex. Chloé"
                aria-invalid={Boolean(errors.firstName)}
                className="h-12 bg-background px-4 text-base shadow-none"
              />
              {errors.firstName ? <p className="text-xs text-destructive">{errors.firstName}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Numéro de téléphone
              </label>
              <div className="flex h-12 overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                <select
                  aria-label="Indicatif pays"
                  value={dialCode}
                  onChange={(e) => setDialCode(e.target.value)}
                  className="shrink-0 border-r border-border bg-muted px-3 text-sm font-semibold text-foreground outline-none"
                >
                  <option value="+33">+33</option>
                  <option value="+32">+32</option>
                  <option value="+41">+41</option>
                  <option value="+352">+352</option>
                  <option value="+262">+262</option>
                  <option value="+590">+590</option>
                  <option value="+596">+596</option>
                </select>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={16}
                  placeholder="6 12 34 56 78"
                  aria-invalid={Boolean(errors.phone)}
                  className="h-full border-0 px-4 text-base shadow-none focus-visible:ring-0"
                />
              </div>
              {errors.phone ? <p className="text-xs text-destructive">{errors.phone}</p> : null}
            </div>

            <label className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-md border border-autopilot-border bg-autopilot p-4">
              <Checkbox
                checked={autopilot}
                onCheckedChange={(checked) => setAutopilot(checked === true)}
                className="mt-0.5"
                aria-label="Activer les relances automatiques Autopilot"
              />
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Sparkles aria-hidden="true" className="h-4 w-4 text-primary" />
                  Activer les relances automatiques Autopilot
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Un message de bienvenue part dès la validation.
                </span>
              </span>
            </label>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground">Canal d'envoi</legend>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: "sms", label: "SMS", Icon: MessageSquareText },
                  { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
                ] as const).map(({ id, label, Icon }) => (
                  <Button
                    key={id}
                    type="button"
                    variant={channel === id ? "default" : "outline"}
                    aria-pressed={channel === id}
                    onClick={() => setChannel(id)}
                    className="h-11"
                  >
                    <Icon aria-hidden="true" /> {label}
                  </Button>
                ))}
              </div>
            </fieldset>
          </div>

          <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-auto w-full justify-between rounded-none border-y border-border px-5 py-4 text-left sm:px-7"
              >
                <span>
                  <span className="block text-sm font-semibold">Fidélité & préférences</span>
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">Facultatif</span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn("transition-transform", detailsOpen && "rotate-180")}
                />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2">
              <div className="space-y-6 border-b border-border bg-subtle px-5 py-6 sm:px-7">
                <Button type="button" variant="outline" className="w-full border-dashed bg-background">
                  <Plus aria-hidden="true" />
                  Ajouter des notes de personnalisation
                </Button>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-foreground">Habitudes du client</legend>
                  <div className="flex flex-wrap gap-2">
                    {habits.map((habit) => {
                      const selected = selectedHabits.includes(habit);
                      return (
                        <Button
                          key={habit}
                          type="button"
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          aria-pressed={selected}
                          onClick={() => toggleHabit(habit)}
                          className="rounded-full"
                        >
                          {selected ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                          {habit}
                        </Button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium text-foreground">
                    Habitudes & Notes du commerce
                  </label>
                  <Textarea
                    id="notes"
                    name="notes"
                    maxLength={1000}
                    placeholder="Ex. Préfère un rendez-vous le samedi matin…"
                    className="min-h-24 resize-none bg-background p-4 shadow-none"
                  />
                </div>

                <section className="rounded-lg border border-border bg-background p-4 shadow-card sm:p-5" aria-labelledby="loyalty-title">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground" id="loyalty-title">
                        <Gift aria-hidden="true" className="h-4 w-4 text-primary" />
                        Carte de fidélité virtuelle
                      </p>
                      <p className="text-xs leading-5 text-muted-foreground">
                        À 10 passages, un code promo est envoyé par SMS.
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-primary">{stampCount}/10</span>
                  </div>

                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {stamps.map((checked, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Passage ${index + 1}${checked ? " validé" : " à valider"}`}
                        aria-pressed={checked}
                        onClick={() =>
                          setStamps((current) => current.map((value, itemIndex) => (itemIndex === index ? !value : value)))
                        }
                        className={cn(
                          "grid aspect-square min-w-0 place-items-center rounded-md border text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-dashed border-input bg-muted text-muted-foreground hover:border-primary",
                        )}
                      >
                        {checked ? <Check aria-hidden="true" className="h-4 w-4" /> : index + 1}
                      </button>
                    ))}
                  </div>

                  {stampCount === 10 ? (
                    <p className="mt-3 rounded-md bg-success-soft px-3 py-2 text-xs font-medium text-success">
                      Carte complétée — le SMS avec le code promo est prêt à partir.
                    </p>
                  ) : null}
                </section>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <footer className="bg-card px-5 py-5 sm:px-7">
            <Button type="submit" size="lg" disabled={submitting} className="h-12 w-full text-base shadow-action">
              {saved ? (
                <>
                  <Check aria-hidden="true" /> Client ajouté
                </>
              ) : (
                "Valider en 1 clic"
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Aucun e-mail nécessaire</p>
          </footer>
        </form>
      </section>
    </main>
  );
}
