import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">ASAP</h3>
            <p className="text-sm text-gray-600">
              La plateforme de prise de rendez-vous avec des artisans qualifiés
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">En savoir plus</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/a-propos"
                  className="text-sm text-gray-600 hover:text-doctolib-blue"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  to="/comment-ca-marche"
                  className="text-sm text-gray-600 hover:text-doctolib-blue"
                >
                  Comment ça marche ?
                </Link>
              </li>
              <li>
                <Link
                  to="/cgu"
                  className="text-sm text-gray-600 hover:text-doctolib-blue"
                >
                  CGU &amp; Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Professionnels</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/artisan-login"
                  className="text-sm text-gray-600 hover:text-doctolib-blue"
                >
                  Espace artisan
                </Link>
              </li>
              <li>
                <Link
                  to="/comment-ca-marche#artisans"
                  className="text-sm text-gray-600 hover:text-doctolib-blue"
                >
                  Devenir partenaire
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} ASAP - Tous droits réservés
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Plateforme de mise en relation avec des artisans qualifiés
          </p>
        </div>
      </div>
    </footer>
  );
}
