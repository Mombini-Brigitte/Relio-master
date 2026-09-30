import type { ReactNode } from "react";

type LegalSection = {
  title: string;
  content: ReactNode;
};

type RelioLegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  notice?: ReactNode;
};

export function RelioLegalPage({ eyebrow, title, intro, sections, notice }: RelioLegalPageProps) {
  return (
    <main className="bg-background">
      <header className="border-b border-border bg-hero px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold text-primary">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{intro}</p>
          <p className="mt-5 text-sm font-semibold text-foreground">Dernière mise à jour : 30 septembre 2026</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
        {notice ? (
          <aside className="mb-10 border-l-4 border-transition bg-transition-soft px-5 py-4 text-sm leading-6 text-foreground">
            {notice}
          </aside>
        ) : null}

        <div className="divide-y divide-border border-y border-border">
          {sections.map((section, index) => (
            <section key={section.title} className="grid gap-4 py-9 md:grid-cols-[3rem_1fr] md:gap-6">
              <span className="font-display text-sm font-bold text-transition" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">{section.title}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {section.content}
                </div>
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm leading-7 text-muted-foreground">
          Une question sur ce document ? Écrivez-nous à{" "}
          <a href="mailto:goldenchloepro@gmail.com" className="font-semibold text-primary hover:underline">
            goldenchloepro@gmail.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
