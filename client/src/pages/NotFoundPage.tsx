import { Link } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Page introuvable
            </h2>

            <p className="text-gray-600 mb-8">
              La page que vous cherchez n&apos;existe pas ou a été déplacée.
            </p>

            <Link to="/">
              <Button fullWidth size="lg">
                Retour à l&apos;accueil
              </Button>
            </Link>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
