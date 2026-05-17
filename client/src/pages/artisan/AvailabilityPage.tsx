import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import ArtisanLayout from '@/components/layout/ArtisanLayout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { api } from '@/services/api';
import { AvailabilitySlot } from '@/types';
import { Plus, Trash2, X, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AvailabilityPage() {
  const { token } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formDate, setFormDate] = useState('');
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('12:00');
  const [formLoading, setFormLoading] = useState(false);

  const fetchAvailability = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const from = format(new Date(), "yyyy-MM-dd'T'00:00:00'Z'");
      const to = format(addDays(new Date(), 14), "yyyy-MM-dd'T'23:59:59'Z'");
      const response = await api.listArtisanAvailability(token, from, to);
      setSlots(response.data ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des disponibilités';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setFormLoading(true);
    setError(null);

    try {
      const startTs = new Date(`${formDate}T${formStartTime}:00`).toISOString();
      const endTs = new Date(`${formDate}T${formEndTime}:00`).toISOString();

      await api.createAvailability(token, { startTs, endTs });
      setSuccessMessage('Créneau créé avec succès');
      await fetchAvailability();

      setShowForm(false);
      setFormDate('');
      setFormStartTime('09:00');
      setFormEndTime('12:00');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du créneau');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) return;

    try {
      await api.deleteAvailability(token, id);
      setSuccessMessage('Créneau supprimé avec succès');
      await fetchAvailability();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const date = format(new Date(slot.startTs), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  const dates = Object.keys(slotsByDate).sort();

  if (loading) {
    return (
      <ArtisanLayout>
        <Loader message="Chargement de vos disponibilités..." />
      </ArtisanLayout>
    );
  }

  return (
    <ArtisanLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes disponibilités</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un créneau
          </Button>
        </div>

        {error && (
          <div className="mb-4">
            <Alert
              type="error"
              message={error}
              dismissible
              onDismiss={() => setError(null)}
            />
          </div>
        )}

        {successMessage && (
          <div className="mb-4">
            <Alert
              type="success"
              message={successMessage}
              dismissible
              onDismiss={() => setSuccessMessage('')}
            />
          </div>
        )}

        {/* Info banner */}
        <Card className="mb-6 bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-900">
            Les créneaux réservés ne peuvent pas être supprimés. Pour annuler un rendez-vous,
            rendez-vous dans la section <span className="font-semibold">"Mes rendez-vous"</span>.
          </p>
        </Card>

        {/* Availability List */}
        {dates.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Calendar className="h-12 w-12 text-gray-400" />}
              title="Aucune disponibilité configurée"
              description="Créez vos premiers créneaux de disponibilité pour être visible et réservable sur ASAP."
              action={
                <Button onClick={() => setShowForm(true)}>
                  Créer mes premiers créneaux
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-6">
            {dates.map((date) => (
              <Card key={date}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
                </h3>
                <div className="space-y-2">
                  {slotsByDate[date]
                    .sort((a, b) => new Date(a.startTs).getTime() - new Date(b.startTs).getTime())
                    .map((slot) => (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          slot.isBooked
                            ? 'bg-gray-100'
                            : 'bg-green-50 border border-green-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">
                            {format(new Date(slot.startTs), 'HH:mm')} - {format(new Date(slot.endTs), 'HH:mm')}
                          </span>
                          {slot.isBooked && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                              Réservé
                            </span>
                          )}
                        </div>
                        {!slot.isBooked && (
                          <button
                            onClick={() => handleDelete(slot.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Supprimer ce créneau"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Nouveau créneau</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heure de début *
                    </label>
                    <input
                      type="time"
                      value={formStartTime}
                      onChange={(e) => setFormStartTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heure de fin *
                    </label>
                    <input
                      type="time"
                      value={formEndTime}
                      onChange={(e) => setFormEndTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    fullWidth
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={formLoading} fullWidth>
                    {formLoading ? 'Création...' : 'Créer'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </ArtisanLayout>
  );
}
