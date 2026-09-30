import { createFileRoute } from "@tanstack/react-router";
import { RelioLanding } from "@/components/relio-landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Relio — Turn every customer into a regular" },
      {
        name: "description",
        content: "Relio aide les commerces de proximité à fidéliser leurs clients avec des messages simples et automatiques.",
      },
      { property: "og:title", content: "Relio — Turn every customer into a regular" },
      {
        property: "og:description",
        content: "Relio aide les commerces de proximité à fidéliser leurs clients avec des messages simples et automatiques.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <RelioLanding />;
}
