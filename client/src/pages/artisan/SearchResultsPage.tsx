// src/pages/SearchResultsPage.tsx
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Card from "@/components/common/Card";
import Loader from "@/components/common/Loader";
import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import { api, SearchResponse } from "@/services/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export default function SearchResultsPage() {
  const query = useQuery();
  const city = query.get("city") ?? "";
  const search = query.get("q") ?? "";
  const categoryId = query.get("categoryId") ?? "";
  const page = Number(query.get("page") ?? 1);

  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.search({
          city,
          search,
          categoryId: categoryId || undefined,
          page,
        });

        // ICI on est sûr d’avoir toujours un objet avec .artisans
        setData(res);
      } catch (err: any) {
        console.error("❌ Erreur api.search:", err);
        setError(err?.message ?? "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, [city, search, categoryId, page]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader message="Recherche des artisans..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card>
            <Alert
              type="error"
              title="Erreur"
              message={error || "Impossible de charger les artisans."}
            />
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const { artisans, total } = data;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Artisans à {city || "proximité"}
            </h1>
            <span className="text-sm text-gray-500">
              {total} résultat{total > 1 ? "s" : ""}
            </span>
          </div>

          {artisans.length === 0 ? (
            <Card>
              <p className="text-gray-600">
                Aucun artisan trouvé pour cette recherche.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {artisans.map((artisan: any) => (
                // ... (intérieur du map)
<Card key={artisan.id}>
  <h2 className="text-lg font-semibold text-gray-900">
    {artisan.name}
  </h2>
  <p className="text-sm text-gray-600">
    {artisan.city} — {artisan.address}
  </p>
  <div className="mt-3">
    {/* 🔴 AVANT (Erreur) : On envoyait l'ID */}
    {/* <Link to={`/artisan/${artisan.slug}`}> */}

    {/* 🟢 APRÈS (Correction) : On envoie le SLUG */}
    <Link to={`/artisan/${artisan.slug}`}>
      <Button size="sm">Voir le profil</Button>
    </Link>
  </div>
</Card>
// ...
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}