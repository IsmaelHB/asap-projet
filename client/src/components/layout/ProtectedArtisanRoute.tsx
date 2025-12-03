import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedArtisanRouteProps {
  children: ReactElement;
}

export default function ProtectedArtisanRoute({
  children,
}: ProtectedArtisanRouteProps) {
  const { artisan, loading } = useAuth();

  if (loading) {
    return null; // tu peux mettre un Loader ici si tu veux
  }

  if (!artisan) {
    return <Navigate to="/artisan-login" replace />;
  }

  return children;
}
