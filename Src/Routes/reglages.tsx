import { createFileRoute } from "@tanstack/react-router";
import { RelioGoogleReviews } from "@/components/relio-google-reviews";
import { RelioMonthlyPerformance } from "@/components/relio-monthly-performance";

const title = "Réglages — Relio";
const description =
  "Suivez les performances du mois et activez l'envoi automatique d'une demande d'avis Google après chaque passage en caisse.";

export const Route = createFileRoute("/reglages")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReglagesPage,
});

function ReglagesPage() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Réglages
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Gérez les automatisations de votre commerce.
        </p>
        <div className="mt-8 space-y-6">
          <RelioMonthlyPerformance />
          <RelioGoogleReviews />
        </div>
      </div>
    </main>
  );
}
