import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import ArtisanLayout from '@/components/layout/ArtisanLayout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import Badge from '@/components/common/Badge';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { api } from '@/services/api';
import { Service, Complexity } from '@/types';
import { Plus, Edit, Trash2, X, Wrench } from 'lucide-react';

export default function ServicesPage() {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceMinCents: '',
    priceMaxCents: '',
    estimatedDurationMin: '',
    complexity: 'MEDIUM' as Complexity,
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchServices = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await api.listArtisanServices(token);
      setServices(response.data ?? []);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleOpenForm = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description || '',
        priceMinCents: (service.priceMinCents / 100).toString(),
        priceMaxCents: (service.priceMaxCents / 100).toString(),
        estimatedDurationMin: service.estimatedDurationMin.toString(),
        complexity: service.complexity,
        isActive: service.isActive,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        priceMinCents: '',
        priceMaxCents: '',
        estimatedDurationMin: '',
        complexity: 'MEDIUM' as Complexity,
        isActive: true,
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const priceMin = parseFloat(formData.priceMinCents) * 100;
    const priceMax = parseFloat(formData.priceMaxCents) * 100;

    if (priceMin > priceMax) {
      alert('Le prix minimum ne peut pas être supérieur au prix maximum');
      return;
    }

    setFormLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        priceMinCents: priceMin,
        priceMaxCents: priceMax,
        estimatedDurationMin: parseInt(formData.estimatedDurationMin),
        complexity: formData.complexity,
        isActive: formData.isActive,
      };

      if (editingService) {
        await api.updateService(token, editingService.id, payload);
        setSuccessMessage('Service modifié avec succès');
      } else {
        await api.createService(token, payload);
        setSuccessMessage('Service créé avec succès');
      }

      await fetchServices();
      handleCloseForm();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la sauvegarde');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

    try {
      await api.deleteService(token, id);
      setSuccessMessage('Service supprimé avec succès');
      await fetchServices();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression');
    }
  };

  const getComplexityLabel = (complexity: Complexity) => {
    switch (complexity) {
      case 'SIMPLE':
        return 'Simple';
      case 'MEDIUM':
        return 'Moyen';
      case 'COMPLEX':
        return 'Complexe';
    }
  };

  const getComplexityBadge = (complexity: Complexity) => (
    <Badge>{getComplexityLabel(complexity)}</Badge>
  );

  const filteredServices = services.filter((service) => {
    if (filter === 'active') return service.isActive;
    if (filter === 'inactive') return !service.isActive;
    return true;
  });

  if (loading) {
    return (
      <ArtisanLayout>
        <Loader message="Chargement des services..." />
      </ArtisanLayout>
    );
  }

  return (
    <ArtisanLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes services</h1>
          <Button onClick={() => handleOpenForm()}>
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un service
          </Button>
        </div>

        {successMessage && (
          <div className="mb-6">
            <Alert
              type="success"
              message={successMessage}
              dismissible
              onDismiss={() => setSuccessMessage('')}
            />
          </div>
        )}

        {/* Filtres */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-doctolib-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Tous ({services.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'active'
                  ? 'bg-doctolib-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Actifs ({services.filter((s) => s.isActive).length})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'inactive'
                  ? 'bg-doctolib-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Inactifs ({services.filter((s) => !s.isActive).length})
            </button>
          </div>
        </div>

        {/* Liste services */}
        {filteredServices.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Wrench className="h-12 w-12 text-gray-400" />}
              title={
                filter === 'all'
                  ? 'Aucun service créé'
                  : `Aucun service ${
                      filter === 'active' ? 'actif' : 'inactif'
                    }`
              }
              description={
                filter === 'all'
                  ? 'Créez votre premier service pour commencer'
                  : undefined
              }
              action={
                filter === 'all' ? (
                  <Button onClick={() => handleOpenForm()}>
                    Créer mon premier service
                  </Button>
                ) : undefined
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      {service.isActive ? (
                        <Badge variant="success">Actif</Badge>
                      ) : (
                        <Badge variant="default">Inactif</Badge>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-gray-600 text-sm mt-1 mb-3">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleOpenForm(service)}
                      className="p-2 text-doctolib-blue hover:bg-doctolib-blue-light rounded transition-colors"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-200 pt-3">
                  <div>
                    <span className="text-gray-600">Prix :</span>
                    <p className="font-semibold text-doctolib-blue mt-1">
                      {service.priceMinCents / 100} € -{' '}
                      {service.priceMaxCents / 100} €
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Durée :</span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {service.estimatedDurationMin} min
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Complexité :</span>
                    <div className="mt-1">
                      {getComplexityBadge(service.complexity)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal formulaire */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingService ? 'Modifier le service' : 'Nouveau service'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du service *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix minimum (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.priceMinCents}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priceMinCents: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix maximum (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.priceMaxCents}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priceMaxCents: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée estimée (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedDurationMin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedDurationMin: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complexité *
                  </label>
                  <select
                    value={formData.complexity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        complexity: e.target.value as Complexity,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
                  >
                    <option value="SIMPLE">Simple</option>
                    <option value="MEDIUM">Moyen</option>
                    <option value="COMPLEX">Complexe</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 text-doctolib-blue focus:ring-doctolib-blue border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Service actif
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseForm}
                    fullWidth
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={formLoading} fullWidth>
                    {formLoading ? 'Enregistrement...' : 'Enregistrer'}
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
