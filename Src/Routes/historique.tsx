import { createFileRoute } from "@tanstack/react-router";
import { RelioSmsHistory } from "@/components/relio-sms-history";

const title = "Historique des envois — Relio";
const description =
  "Journal en temps réel des SMS envoyés : prénom du client, type de message Autopilot ou manuel et statut d'envoi.";

export const Route = createFileRoute("/historique")({
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
  component: () => <RelioSmsHistory />,
});
