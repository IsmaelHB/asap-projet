import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold">Profil artisan (placeholder)</h1>
      </main>
      <Footer />
    </div>
  );
}
