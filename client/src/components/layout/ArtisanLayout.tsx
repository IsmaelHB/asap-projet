import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ArtisanLayoutProps {
  children: ReactNode;
}

export default function ArtisanLayout({ children }: ArtisanLayoutProps) {
  const { artisan, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/artisan/dashboard', label: 'Tableau de bord' },
    { to: '/artisan/profile', label: 'Profil' },
    { to: '/artisan/services', label: 'Services' },
    { to: '/artisan/availability', label: 'Disponibilités' },
    { to: '/artisan/appointments', label: 'Rendez-vous' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/artisan/dashboard" className="text-lg font-bold text-gray-900">
            Espace artisan
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {artisan && (
              <span className="text-gray-600">Connecté en tant que {artisan.name}</span>
            )}
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>
        <nav className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto text-sm">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    'py-3 border-b-2 -mb-px whitespace-nowrap ' +
                    (active
                      ? 'border-doctolib-blue text-doctolib-blue font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300')
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
