import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';

export default function LegalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Conditions Générales d&apos;Utilisation
          </h1>

          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Objet du service
            </h2>
            <p className="text-gray-700 mb-4">
              ASAP est une plateforme de mise en relation entre des particuliers
              et des artisans qualifiés. Le service permet de rechercher un
              artisan par ville et métier, de consulter ses disponibilités en
              temps réel et de réserver un rendez-vous en ligne.
            </p>
            <p className="text-gray-700">
              La plateforme ne se substitue pas aux artisans et n&apos;effectue
              aucune prestation elle-même. ASAP agit uniquement en tant
              qu&apos;intermédiaire technologique.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Inscription et compte artisan
            </h2>
            <p className="text-gray-700 mb-4">
              Les artisans souhaitant rejoindre la plateforme doivent créer un
              compte professionnel. Ils s&apos;engagent à fournir des
              informations exactes et à jour concernant leur activité, leurs
              qualifications et leurs disponibilités.
            </p>
            <p className="text-gray-700">
              Les artisans sont responsables de la gestion de leur planning et
              de la mise à jour de leurs créneaux de disponibilité.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Réservation et annulation
            </h2>
            <p className="text-gray-700 mb-4">
              Les particuliers peuvent réserver un rendez-vous en ligne sans
              créer de compte. Une confirmation leur est envoyée par email.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Politique d&apos;annulation :</strong>
            </p>
            <ul className="text-gray-700 space-y-2 ml-6 list-disc">
              <li>Annulation dans les 5 minutes suivant la réservation : gratuit</li>
              <li>Annulation plus de 24h avant le rendez-vous : gratuit</li>
              <li>Annulation moins de 24h avant le rendez-vous : frais de 20€</li>
              <li>Absence non signalée (no-show) : frais de 20€</li>
            </ul>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Responsabilités
            </h2>
            <p className="text-gray-700 mb-4">
              <strong>Responsabilité de la plateforme :</strong> ASAP met à
              disposition un outil de prise de rendez-vous mais ne garantit pas
              la qualité des prestations réalisées par les artisans. La
              plateforme ne peut être tenue responsable des litiges entre
              particuliers et artisans.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Responsabilité des artisans :</strong> Les artisans sont
              seuls responsables de leurs prestations, de leur assurance
              professionnelle et du respect de leurs engagements vis-à-vis des
              clients.
            </p>
            <p className="text-gray-700">
              <strong>Responsabilité des utilisateurs :</strong> Les
              particuliers s&apos;engagent à fournir des informations exactes
              lors de la réservation et à respecter les créneaux réservés.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Protection des données personnelles
            </h2>
            <p className="text-gray-700 mb-4">
              ASAP collecte et traite les données personnelles des utilisateurs
              (nom, email, téléphone) dans le cadre de la fourniture du
              service. Ces données sont utilisées uniquement pour faciliter la
              mise en relation et ne sont pas partagées avec des tiers à des
              fins commerciales.
            </p>
            <p className="text-gray-700 mb-4">
              Conformément au RGPD, les utilisateurs disposent d&apos;un droit
              d&apos;accès, de rectification et de suppression de leurs données
              personnelles.
            </p>
            <p className="text-gray-700 text-sm italic">
              Note : Ce document constitue un modèle simplifié à des fins de
              démonstration. En production, il devrait être rédigé par un
              professionnel du droit et adapté à la législation applicable.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Modification des CGU
            </h2>
            <p className="text-gray-700">
              ASAP se réserve le droit de modifier les présentes conditions
              générales à tout moment. Les utilisateurs seront informés de
              toute modification significative.
            </p>
          </Card>

          <div className="text-sm text-gray-500 mt-8 text-center">
            Dernière mise à jour :{' '}
            {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
