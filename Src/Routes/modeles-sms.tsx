import { createFileRoute } from "@tanstack/react-router";
import { RelioSmsTemplates } from "@/components/relio-sms-templates";

const title = "Modèles de SMS — Relio";
const description =
  "Bibliothèque de SMS pré-rédigés : bienvenue, relance inactivité, anniversaire et vente flash, avec variables automatiques.";

export const Route = createFileRoute("/modeles-sms")({
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
  component: () => <RelioSmsTemplates />,
});
