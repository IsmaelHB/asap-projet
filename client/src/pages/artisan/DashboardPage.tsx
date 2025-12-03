import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold">Dashboard artisan (placeholder)</h1>
      </main>
      <Footer />
    </div>
  );
}
