import { createFileRoute } from "@tanstack/react-router";

import { RelioLegalPage } from "@/components/relio-legal-page";

const description = "Consultez les conditions générales d’utilisation de l’application professionnelle Relio.";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: "Conditions générales d’utilisation — Relio" },
      { name: "description", content: description },
      { property: "og:title", content: "Conditions générales d’utilisation — Relio" },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CguPage,
});

function CguPage() {
  return (
    <RelioLegalPage
      eyebrow="CONDITIONS D’UTILISATION"
      title="Conditions générales d’utilisation"
      intro="Ces conditions encadrent l’accès à Relio et l’utilisation de ses services par les clients professionnels."
      notice={<p>Relio est un service destiné aux professionnels. Toute utilisation de l’application implique l’acceptation des présentes conditions.</p>}
      sections={[
        {
          title: "Objet et champ d’application",
          content: <p>Les présentes conditions régissent l’accès et l’utilisation de l’application et des services B2B fournis par <strong className="text-foreground">Brigitte Mombini EI</strong>, ci-après « le Prestataire », aux clients professionnels, ci-après « le Client ».</p>,
        },
        {
          title: "Responsabilité du Client",
          content: (
            <>
              <p>Le Client est seul responsable de l’utilisation qu’il fait de l’application et des messages qu’il envoie. Le démarchage abusif, trompeur ou illégal est strictement interdit.</p>
              <p>Le Client est propriétaire et responsable des bases de contacts qu’il importe. Il garantit disposer du consentement ou de toute autre base légale nécessaire et s’engage à respecter la réglementation applicable aux communications électroniques et au RGPD.</p>
            </>
          ),
        },
        {
          title: "Disponibilité et maintenance",
          content: <p>Le Prestataire s’efforce d’assurer un accès au service 24 h/24 et 7 j/7. L’accès peut être temporairement interrompu pour maintenance, mise à jour, incident technique ou panne réseau, sans donner droit à indemnisation.</p>,
        },
        {
          title: "Propriété intellectuelle",
          content: <p>Le Prestataire conserve la propriété exclusive de la plateforme, de son code, de ses graphismes, de ses contenus et de ses méthodes. Le Client bénéficie d’un droit d’utilisation personnel, professionnel, non exclusif et non transférable pendant la durée de son accès au service.</p>,
        },
        {
          title: "Garantie et indemnisation",
          content: <p>Le Client garantit le Prestataire contre toute plainte ou demande d’un tiers résultant d’une utilisation de l’application contraire aux présentes conditions, à la loi ou aux droits des personnes contactées.</p>,
        },
        {
          title: "Droit applicable",
          content: <p>Les présentes conditions sont soumises au droit français. Tout litige sera porté devant le tribunal de commerce compétent du siège du Prestataire, sous réserve des règles impératives applicables.</p>,
        },
      ]}
    />
  );
}
