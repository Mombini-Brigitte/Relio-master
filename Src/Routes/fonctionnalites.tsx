import { createFileRoute } from "@tanstack/react-router";
import { RelioSmartFeatures } from "@/components/relio-smart-features";

const title = "Fonctionnalités intelligentes — Relio";
const description =
  "QR Code caisse, SMS vente flash, inspirations saisonnières et bilan mensuel du chiffre d'affaires généré.";

export const Route = createFileRoute("/fonctionnalites")({
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
  component: FonctionnalitesPage,
});

function FonctionnalitesPage() {
  return <RelioSmartFeatures />;
}
