import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SearchBar from '@/components/search/SearchBar';
import { Wrench, Clock, Shield, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-doctolib-blue-light to-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trouvez un artisan près de chez vous
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Réservez en ligne votre intervention avec un professionnel qualifié
            </p>

            <SearchBar />
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Comment ça marche ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-doctolib-blue-light mb-4">
                  <Wrench className="h-8 w-8 text-doctolib-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Recherchez</h3>
                <p className="text-gray-600">
                  Trouvez un artisan qualifié dans votre ville
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-doctolib-blue-light mb-4">
                  <Clock className="h-8 w-8 text-doctolib-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Consultez</h3>
                <p className="text-gray-600">
                  Comparez les disponibilités et tarifs
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-doctolib-blue-light mb-4">
                  <Star className="h-8 w-8 text-doctolib-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Réservez</h3>
                <p className="text-gray-600">
                  Prenez rendez-vous en quelques clics
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-doctolib-blue-light mb-4">
                  <Shield className="h-8 w-8 text-doctolib-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2">4. Profitez</h3>
                <p className="text-gray-600">
                  L'artisan intervient chez vous
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-doctolib-blue">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Vous êtes artisan ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez ASAP et développez votre activité
            </p>
            <a
              href="/artisan-login"
              className="inline-block bg-white text-doctolib-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Créer mon espace professionnel
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}