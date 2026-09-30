import { createFileRoute } from "@tanstack/react-router";

import { RelioLegalPage } from "@/components/relio-legal-page";

const description = "Consultez les conditions générales de vente des abonnements et services professionnels Relio.";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions générales de vente — Relio" },
      { name: "description", content: description },
      { property: "og:title", content: "Conditions générales de vente — Relio" },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CgvPage,
});

function CgvPage() {
  return (
    <RelioLegalPage
      eyebrow="CONDITIONS DE VENTE"
      title="Conditions générales de vente"
      intro="Ces conditions encadrent la souscription, le paiement et la résiliation des abonnements et services Relio destinés aux professionnels."
      notice={
        <p>
          <strong>Informations à compléter avant publication :</strong> adresse postale et numéro SIRET de Brigitte Mombini EI.
        </p>
      }
      sections={[
        {
          title: "Identification du Prestataire",
          content: (
            <ul className="space-y-2">
              <li><strong className="text-foreground">Éditeur :</strong> Brigitte Mombini EI</li>
              <li><strong className="text-foreground">Statut :</strong> Entrepreneur Individuel (micro-entrepreneur)</li>
              <li><strong className="text-foreground">SIRET :</strong> à compléter</li>
              <li><strong className="text-foreground">Adresse :</strong> à compléter</li>
              <li><strong className="text-foreground">E-mail :</strong> goldenchloepro@gmail.com</li>
            </ul>
          ),
        },
        {
          title: "Commandes et souscription",
          content: <p>La vente de services ou la souscription à l’application devient définitive après validation de la commande en ligne ou signature d’un devis portant la mention « Bon pour accord ».</p>,
        },
        {
          title: "Tarifs et TVA",
          content: <p>Les prix sont indiqués en euros nets de taxe, conformément à l’article 293 B du Code général des impôts : TVA non applicable.</p>,
        },
        {
          title: "Règlement et facturation",
          content: (
            <>
              <p>Le paiement s’effectue en ligne par carte bancaire ou prélèvement bancaire via la plateforme sécurisée <strong className="text-foreground">Stripe</strong>. Les factures sont émises par voie électronique et payables immédiatement à réception.</p>
              <p>Les données bancaires sont chiffrées et traitées directement par Stripe ; le Prestataire n’y a pas accès. En cas d’impayé ou de rejet, l’accès à l’application peut être suspendu immédiatement, sans préjudice des pénalités applicables.</p>
            </>
          ),
        },
        {
          title: "Packs de services",
          content: <p>Les packs d’heures ou de services sont payables en totalité à la commande. Les prestations doivent être consommées dans un délai maximal de deux mois à compter de l’achat. Passé ce délai, le pack expire et les prestations non utilisées sont perdues sans remboursement.</p>,
        },
        {
          title: "Retards de paiement",
          content: <p>Tout retard entraîne de plein droit des pénalités calculées au taux annuel de 10 %. Une indemnité forfaitaire de 40 € pour frais de recouvrement est également due dès le premier jour de retard, conformément à l’article L. 441-10 du Code de commerce.</p>,
        },
        {
          title: "Durée et résiliation",
          content: (
            <>
              <p>L’abonnement comporte une période d’engagement ferme de 12 mois. Il se renouvelle par tacite reconduction pour des périodes successives de même durée, sauf dénonciation écrite au moins un mois avant l’échéance.</p>
              <p>En cas de résiliation anticipée par le Client, l’intégralité des mensualités restant jusqu’au terme de l’engagement devient immédiatement exigible à titre de clause pénale.</p>
            </>
          ),
        },
        {
          title: "Responsabilité",
          content: <p>La responsabilité globale du Prestataire est limitée au montant hors taxes payé par le Client pour le service ou l’abonnement concerné au cours des 12 derniers mois. Les dommages indirects sont exclus.</p>,
        },
        {
          title: "Propriété intellectuelle et référence commerciale",
          content: <p>Le Prestataire conserve la propriété exclusive de la plateforme, des codes, graphismes et méthodes. Le transfert des droits d’utilisation des livrables intervient après paiement intégral. Sauf refus écrit du Client, le Prestataire peut citer son nom à titre de référence commerciale.</p>,
        },
        {
          title: "Droit applicable et tribunal compétent",
          content: <p>Les présentes conditions sont soumises au droit français. Tout litige sera porté devant le tribunal de commerce compétent du siège du Prestataire.</p>,
        },
      ]}
    />
  );
}
