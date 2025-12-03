import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-doctolib-blue" />
            <span className="text-2xl font-bold text-gray-900">ASAP</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              to="/comment-ca-marche"
              className="text-gray-600 hover:text-doctolib-blue font-medium transition-colors text-sm"
            >
              Comment ça marche ?
            </Link>
            <Link
              to="/a-propos"
              className="text-gray-600 hover:text-doctolib-blue font-medium transition-colors text-sm"
            >
              À propos
            </Link>
            <Link
              to="/artisan-login"
              className="text-doctolib-blue hover:text-doctolib-blue-dark font-medium transition-colors text-sm border-l border-gray-300 pl-6"
            >
              Espace Artisan
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
