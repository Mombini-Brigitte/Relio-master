import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageSquareText, Sparkles, Star, UsersRound, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

const benefits = [
  { icon: UsersRound, value: "142", label: "clients relancés", detail: "automatiquement ce mois-ci" },
  { icon: Star, value: "+18", label: "nouveaux avis 5★", detail: "sans y penser au quotidien" },
  { icon: MessageSquareText, value: "1 240 €", label: "de CA généré", detail: "estimé grâce aux campagnes" },
];

export function RelioLanding() {
  return (
    <main className="overflow-hidden bg-background">
      <section className="relative border-b border-border">
        <div className="absolute inset-0 bg-hero" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-transition/25 bg-transition-soft px-3 py-1.5 text-xs font-bold text-transition">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              La fidélité client, simplement
            </p>
            <h1 className="font-display text-5xl font-bold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
              Turn every customer<br className="hidden sm:block" /> into a <span className="text-gradient">regular.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Relio aide les commerces de proximité à faire revenir leurs clients avec des messages utiles, envoyés au bon moment — sans complexité.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-6 shadow-action">
                <Link to="/ajouter"><Zap aria-hidden="true" />Ajouter un client<ArrowRight aria-hidden="true" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6">
                <Link to="/fonctionnalites">Découvrir les fonctionnalités</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {['Prêt en 10 secondes', 'SMS & WhatsApp', 'Conforme RGPD'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2"><Check aria-hidden="true" className="h-4 w-4 text-primary" />{item}</span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2rem] bg-transition/10 blur-2xl" aria-hidden="true" />
            <section className="relative overflow-hidden rounded-[var(--radius-panel)] border border-border bg-card shadow-panel" aria-label="Aperçu des performances Relio">
              <div className="flex items-center justify-between border-b border-border bg-transition-soft px-6 py-5">
                <div>
                  <p className="text-xs font-bold text-transition">PERFORMANCES DU MOIS</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-foreground">Votre commerce progresse</h2>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles aria-hidden="true" /></span>
              </div>
              <div className="grid gap-px bg-border sm:grid-cols-3">
                {benefits.map(({ icon: Icon, value, label, detail }) => (
                  <article key={label} className="bg-card p-5">
                    <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                    <p className="mt-5 font-display text-2xl font-bold text-foreground">{value}</p>
                    <p className="mt-1 text-sm font-bold text-foreground">{label}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
                  </article>
                ))}
              </div>
              <div className="flex items-center gap-3 border-t border-border bg-card px-6 py-5">
                <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" /><span className="relative inline-flex h-3 w-3 rounded-full bg-primary" /></span>
                <p className="text-sm font-semibold text-foreground">Autopilot est actif et travaille pour vous</p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="bg-canvas px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-primary">UN OUTIL, TROIS GESTES</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">Simple pour vous. Personnel pour vos clients.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Ajoutez', 'Enregistrez un prénom et un numéro en moins de 10 secondes.'],
              ['02', 'Relancez', 'Relio choisit le bon moment pour envoyer un message utile.'],
              ['03', 'Fidélisez', 'Suivez les retours, les avis et le chiffre d’affaires généré.'],
            ].map(([number, title, copy]) => (
              <article key={number} className="border-t-2 border-primary bg-card p-6 shadow-card">
                <span className="text-sm font-bold text-transition">{number}</span>
                <h3 className="mt-8 font-display text-2xl font-bold text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
