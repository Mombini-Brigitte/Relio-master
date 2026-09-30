import { createFileRoute } from "@tanstack/react-router";
import { RelioCrm } from "@/components/relio-crm";
import { RelioClientRecords } from "@/components/relio-client-records";

const title = "Clients — Relio";
const description =
  "Filtrez vos clients en un clic, créez vos propres filtres et importez vos fichiers CSV ou Excel.";

export const Route = createFileRoute("/clients")({
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
  component: ClientsPage,
});

function ClientsPage() {
  return (
    <>
      <RelioCrm />
      <RelioClientRecords />
    </>
  );
}
