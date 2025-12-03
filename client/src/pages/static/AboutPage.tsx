import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import { Wrench, Users, Star, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              À propos d&apos;ASAP
            </h1>
            <p className="text-xl text-gray-600">
              La plateforme qui simplifie la prise de rendez-vous avec des
              artisans qualifiés
            </p>
          </div>

          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Notre mission
            </h2>
            <p className="text-gray-700 mb-4">
              ASAP est né d&apos;un constat simple : trouver un artisan
              disponible rapidement et prendre rendez-vous est souvent compliqué.
              Les particuliers passent des heures au téléphone, et les artisans
              perdent du temps à gérer leurs appels et leurs plannings.
            </p>
            <p className="text-gray-700">
              Notre mission est de simplifier cette rencontre en offrant une
              plateforme moderne, inspirée de Doctolib, qui permet de réserver
              un rendez-vous avec un artisan en quelques clics.
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <div className="flex items-start">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-doctolib-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Pour les particuliers
                  </h3>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Recherche rapide par ville et métier</li>
                    <li>• Disponibilités en temps réel</li>
                    <li>• Artisans notés et vérifiés</li>
                    <li>• Réservation en ligne 24/7</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <Wrench className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Pour les artisans
                  </h3>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Visibilité auprès des clients</li>
                    <li>• Gestion simplifiée du planning</li>
                    <li>• Réduction des appels manqués</li>
                    <li>• Optimisation du temps de travail</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-doctolib-blue text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Star className="h-8 w-8 mx-auto mb-2" />
                <p className="text-3xl font-bold">4.8/5</p>
                <p className="text-sm opacity-90">Note moyenne</p>
              </div>
              <div>
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm opacity-90">Artisans inscrits</p>
              </div>
              <div>
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm opacity-90">Rendez-vous réservés</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
