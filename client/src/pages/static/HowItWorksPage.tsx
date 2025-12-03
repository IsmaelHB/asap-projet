import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import { Search, Calendar, CheckCircle, Wrench } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h1>
            <p className="text-xl text-gray-600">
              Réserver un artisan n&apos;a jamais été aussi simple
            </p>
          </div>

          <div className="space-y-8 mb-12">
            <Card>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-doctolib-blue text-white font-bold text-xl">
                    1
                  </div>
                </div>
                <div className="ml-6">
                  <div className="flex items-center mb-2">
                    <Search className="h-6 w-6 text-doctolib-blue mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Recherchez un artisan
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    Indiquez votre ville et le type d&apos;artisan dont vous
                    avez besoin (plombier, électricien, peintre...). Consultez
                    les profils, les avis et les tarifs.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-doctolib-blue text-white font-bold text-xl">
                    2
                  </div>
                </div>
                <div className="ml-6">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-6 w-6 text-doctolib-blue mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Choisissez votre créneau
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    Visualisez les disponibilités en temps réel. Sélectionnez le
                    service souhaité et le créneau qui vous convient (matin ou
                    après-midi).
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-doctolib-blue text-white font-bold text-xl">
                    3
                  </div>
                </div>
                <div className="ml-6">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-6 w-6 text-doctolib-blue mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Réservez en ligne
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    Renseignez vos coordonnées et une brève description de votre
                    besoin. Recevez une confirmation immédiate par email.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-doctolib-blue text-white font-bold text-xl">
                    4
                  </div>
                </div>
                <div className="ml-6">
                  <div className="flex items-center mb-2">
                    <Wrench className="h-6 w-6 text-doctolib-blue mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">
                      L&apos;artisan intervient
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    L&apos;artisan vous contacte si nécessaire pour confirmer.
                    Il intervient chez vous au créneau réservé. En cas
                    d&apos;empêchement, vous pouvez annuler en ligne.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-green-50 border border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Vous êtes artisan ?
            </h3>
            <p className="text-gray-700 mb-4">
              Rejoignez ASAP pour développer votre activité et simplifier la
              gestion de vos rendez-vous :
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>• Profil personnalisé avec vos services et tarifs</li>
              <li>• Gestion de votre planning en temps réel</li>
              <li>• Notifications pour chaque nouvelle réservation</li>
              <li>• Réduction des appels et SMS</li>
            </ul>
            <a
              href="/artisan-login"
              className="inline-block bg-doctolib-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-doctolib-blue-dark transition-colors"
            >
              Créer mon espace professionnel
            </a>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
