import { createFileRoute } from "@tanstack/react-router";
import { RelioPricing } from "@/components/relio-pricing";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs & abonnements — Relio" },
      {
        name: "description",
        content:
          "Abonnements mensuels tout-en-un et recharges SMS sans engagement, adaptés à votre commerce.",
      },
      { property: "og:title", content: "Tarifs & abonnements — Relio" },
      {
        property: "og:description",
        content:
          "Abonnements mensuels tout-en-un et recharges SMS sans engagement, adaptés à votre commerce.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TarifsPage,
});

function TarifsPage() {
  return <RelioPricing />;
}
