import { createFileRoute } from "@tanstack/react-router";

import { RelioLegalPage } from "@/components/relio-legal-page";

const description = "Consultez les mentions légales de Relio, édité par Brigitte Mombini EI.";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Relio" },
      { name: "description", content: description },
      { property: "og:title", content: "Mentions légales — Relio" },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MentionsLegalesPage,
});

function MentionsLegalesPage() {
  return (
    <RelioLegalPage
      eyebrow="INFORMATIONS JURIDIQUES"
      title="Mentions légales"
      intro="Les informations relatives à l’édition, à l’hébergement et à l’accès au site et à l’application Relio."
      notice={
        <p>
          <strong>Informations à compléter avant publication :</strong> adresse postale, téléphone, numéro SIRET et, si applicable, numéro de TVA intracommunautaire.
        </p>
      }
      sections={[
        {
          title: "Éditeur du site et de l’application",
          content: (
            <>
              <p>L’édition et la direction de la publication du site internet et de l’application Relio sont assurées par <strong className="text-foreground">Brigitte Mombini EI</strong>, exerçant sous le statut d’Entrepreneur Individuel (micro-entrepreneur).</p>
              <ul className="space-y-2">
                <li><strong className="text-foreground">Adresse postale :</strong> à compléter</li>
                <li><strong className="text-foreground">Téléphone :</strong> à compléter</li>
                <li><strong className="text-foreground">E-mail :</strong> goldenchloepro@gmail.com</li>
                <li><strong className="text-foreground">SIRET :</strong> à compléter</li>
                <li><strong className="text-foreground">TVA intracommunautaire :</strong> à compléter, si applicable</li>
              </ul>
            </>
          ),
        },
        {
          title: "Hébergement du code source",
          content: <p>Le code source et les fichiers de l’application sont hébergés et stockés de manière sécurisée par la société <strong className="text-foreground">GitHub Inc.</strong>, dont le siège social est situé à San Francisco, États-Unis.</p>,
        },
        {
          title: "Hébergement des données applicatives",
          content: <p>La base de données et les informations traitées par l’application sont hébergées de manière sécurisée par <strong className="text-foreground">Supabase Inc.</strong> Les serveurs utilisés pour le stockage des données sont situés au sein de l’Union européenne, à Francfort.</p>,
        },
        {
          title: "Accessibilité",
          content: <p>Le site et l’application sont accessibles 24 h/24 et 7 j/7, sauf cas de force majeure ou interruption volontaire pour des raisons de maintenance technique nécessaire au bon fonctionnement du service.</p>,
        },
      ]}
    />
  );
}
