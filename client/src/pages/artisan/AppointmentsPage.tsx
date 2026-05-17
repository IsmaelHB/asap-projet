import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import ArtisanLayout from '@/components/layout/ArtisanLayout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Loader from '@/components/common/Loader';
import Alert from '@/components/common/Alert';
import EmptyState from '@/components/common/EmptyState';
import { api } from '@/services/api';
import { Appointment, AppointmentStatus } from '@/types';
import { CheckCircle, XCircle, UserX, Calendar } from 'lucide-react';
import { format, isToday, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AppointmentsPage() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAppointments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await api.listAppointments(token, filterStatus || undefined);
      setAppointments(response.data?.appointments ?? []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [token, filterStatus]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    if (!token) return;

    const statusLabels: Record<AppointmentStatus, string> = {
      PENDING: 'en attente',
      CONFIRMED: 'confirmé',
      CANCELLED: 'annulé',
      NO_SHOW: 'absent',
    };

    if (!confirm(`Confirmer le passage du rendez-vous en "${statusLabels[status]}" ?`)) return;

    try {
      await api.updateAppointmentStatus(token, id, status);
      setSuccessMessage(`Rendez-vous ${statusLabels[status]} avec succès`);
      await fetchAppointments();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
      alert(msg);
    }
  };

  const handleMarkNoShow = async (id: string) => {
    if (!token) return;
    if (!confirm('Marquer ce client comme absent ? Des frais de 20€ seront appliqués.')) return;

    try {
      await api.markNoShow(token, id);
      setSuccessMessage('Client marqué comme absent');
      await fetchAppointments();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
      alert(msg);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.slotStart);
    if (filterPeriod === 'today') return isToday(aptDate);
    if (filterPeriod === 'week') {
      const weekLater = addDays(new Date(), 7);
      return aptDate >= new Date() && aptDate <= weekLater;
    }
    return true;
  });

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">En attente</Badge>;
      case 'CONFIRMED':
        return <Badge variant="success">Confirmé</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Annulé</Badge>;
      case 'NO_SHOW':
        return <Badge variant="default">Absent</Badge>;
    }
  };

  if (loading) {
    return (
      <ArtisanLayout>
        <Loader message="Chargement des rendez-vous..." />
      </ArtisanLayout>
    );
  }

  return (
    <ArtisanLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes rendez-vous</h1>

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

        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmé</option>
                <option value="CANCELLED">Annulé</option>
                <option value="NO_SHOW">Absent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctolib-blue focus:border-transparent"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd&apos;hui</option>
                <option value="week">7 prochains jours</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50 border border-blue-200">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{filteredAppointments.length}</p>
          </Card>
          <Card className="bg-orange-50 border border-orange-200">
            <p className="text-sm text-gray-600">En attente</p>
            <p className="text-2xl font-bold text-orange-600">
              {filteredAppointments.filter((a) => a.status === 'PENDING').length}
            </p>
          </Card>
          <Card className="bg-green-50 border border-green-200">
            <p className="text-sm text-gray-600">Confirmés</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredAppointments.filter((a) => a.status === 'CONFIRMED').length}
            </p>
          </Card>
          <Card className="bg-red-50 border border-red-200">
            <p className="text-sm text-gray-600">Annulés</p>
            <p className="text-2xl font-bold text-red-600">
              {filteredAppointments.filter((a) => a.status === 'CANCELLED').length}
            </p>
          </Card>
        </div>

        {filteredAppointments.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Calendar className="h-12 w-12 text-gray-400" />}
              title="Aucun rendez-vous trouvé"
              description="Modifiez vos filtres pour voir d'autres rendez-vous"
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments
              .sort(
                (a, b) =>
                  new Date(a.slotStart).getTime() - new Date(b.slotStart).getTime()
              )
              .map((appointment) => (
                <Card key={appointment.id}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.customerName}
                        </h3>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium text-gray-700">Date :</span>{' '}
                          {format(new Date(appointment.slotStart), 'EEEE d MMMM yyyy', { locale: fr })}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Heure :</span>{' '}
                          {format(new Date(appointment.slotStart), "HH'h'mm", { locale: fr })}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Service :</span>{' '}
                          {appointment.service?.name}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Téléphone :</span>{' '}
                          {appointment.customerPhone}
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-700">Email :</span>{' '}
                          {appointment.customerEmail}
                        </div>
                        {appointment.customerNotes && (
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-700">Notes :</span>{' '}
                            {appointment.customerNotes}
                          </div>
                        )}
                        {appointment.cancellationFeeCents > 0 && (
                          <div className="md:col-span-2">
                            <Badge variant="warning">
                              Frais d&apos;annulation :{' '}
                              {appointment.cancellationFeeCents / 100}€
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2 lg:w-48">
                      {appointment.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(appointment.id, 'CONFIRMED' as AppointmentStatus)}
                            fullWidth
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmer
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleUpdateStatus(appointment.id, 'CANCELLED' as AppointmentStatus)}
                            fullWidth
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Annuler
                          </Button>
                        </>
                      )}
                      {appointment.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMarkNoShow(appointment.id)}
                          fullWidth
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Marquer absent
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </ArtisanLayout>
  );
}
