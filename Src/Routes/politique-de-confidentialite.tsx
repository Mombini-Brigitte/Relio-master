import { createFileRoute } from "@tanstack/react-router";

import { RelioLegalPage } from "@/components/relio-legal-page";

const description = "Découvrez comment Relio collecte, protège et conserve les données personnelles conformément au RGPD.";

export const Route = createFileRoute("/politique-de-confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Relio" },
      { name: "description", content: description },
      { property: "og:title", content: "Politique de confidentialité — Relio" },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <RelioLegalPage
      eyebrow="PROTECTION DES DONNÉES"
      title="Politique de confidentialité"
      intro="Relio protège les données personnelles des commerçants et de leurs clients conformément au Règlement général sur la protection des données."
      sections={[
        {
          title: "Responsable du traitement",
          content: <p>Les données sont traitées par <strong className="text-foreground">Brigitte Mombini EI</strong>. Pour toute question : goldenchloepro@gmail.com.</p>,
        },
        {
          title: "Données collectées et finalités",
          content: <p>Dans le cadre de la gestion de votre compte et de l’exécution des services, nous pouvons collecter : nom, prénom, nom de l’entreprise, adresse e-mail, téléphone, adresse postale et journaux techniques. La base légale du traitement est l’exécution du contrat.</p>,
        },
        {
          title: "Sécurité des paiements",
          content: <p>Les transactions par carte bancaire sont confiées à la plateforme sécurisée <strong className="text-foreground">Stripe</strong>. Le Prestataire ne conserve aucune donnée bancaire confidentielle sur ses serveurs.</p>,
        },
        {
          title: "Numéros de téléphone et SMS",
          content: (
            <>
              <p>Le Client est seul responsable du traitement des bases de contacts qu’il importe dans l’application. Il lui appartient de s’assurer qu’il dispose d’une base légale adaptée pour contacter chaque personne.</p>
              <p>L’application prévoit une mention de désabonnement « STOP SMS » dans les messages concernés, ainsi que des fonctions permettant de supprimer les fiches clients à leur demande ou au terme des délais de conservation.</p>
            </>
          ),
        },
        {
          title: "Destinataires et sous-traitants",
          content: (
            <>
              <p>Les données sont strictement confidentielles et peuvent être traitées par les prestataires techniques nécessaires au fonctionnement de Relio :</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong className="text-foreground">Stripe</strong> pour les paiements en ligne ;</li>
                <li><strong className="text-foreground">Twilio</strong> pour l’envoi des SMS et messages WhatsApp ;</li>
                <li><strong className="text-foreground">Supabase</strong> pour l’hébergement de la base de données dans l’Union européenne ;</li>
                <li><strong className="text-foreground">Vercel, Sentry et GitHub</strong> pour l’hébergement, le suivi des incidents techniques et la gestion du code.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Durée de conservation",
          content: <p>Les données comptables sont conservées pendant 10 ans, conformément aux obligations légales. Les données de compte sont conservées pendant la relation contractuelle, puis supprimées ou anonymisées 3 ans après le dernier contact.</p>,
        },
        {
          title: "Vos droits",
          content: <p>Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation et de portabilité de vos données. Pour exercer ces droits, contactez goldenchloepro@gmail.com. Vous pouvez également adresser une réclamation à la CNIL sur <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">cnil.fr</a>.</p>,
        },
      ]}
    />
  );
}
