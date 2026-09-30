import { createFileRoute } from "@tanstack/react-router";
import { RelioCustomerCard } from "@/components/relio-customer-card";

const title = "Ajouter un client — Relio";
const description = "Ajoutez un client en quelques secondes et envoyez immédiatement son message de bienvenue.";

export const Route = createFileRoute("/ajouter")({
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
  component: AjouterPage,
});

function AjouterPage() {
  return <RelioCustomerCard />;
}
