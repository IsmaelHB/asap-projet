import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import Alert from '@/components/common/Alert';
import Badge from '@/components/common/Badge';
import { api } from '@/services/api';
import { Appointment, AppointmentStatus } from '@/types';
import { CheckCircle, Calendar, Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function BookingConfirmationPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) return;
      try {
        const data = await api.getAppointment(appointmentId);
        setAppointment(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  const handleCancel = async () => {
    if (!appointmentId) return;
    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;

    setCancelling(true);
    try {
      await api.cancelAppointment(appointmentId);
      setCancelSuccess(true);
      const data = await api.getAppointment(appointmentId);
      setAppointment(data);
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'annulation");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'PENDING': return <Badge variant="warning">En attente</Badge>;
      case 'CONFIRMED': return <Badge variant="success">Confirmé</Badge>;
      case 'CANCELLED': return <Badge variant="danger">Annulé</Badge>;
      case 'NO_SHOW': return <Badge variant="default">Absent</Badge>;
    }
  };

  if (loading) return <div className="min-h-screen flex flex-col bg-gray-50"><Header /><main className="flex-grow flex items-center justify-center"><Loader message="Chargement..." /></main><Footer /></div>;

  if (error || !appointment) return <div className="min-h-screen flex flex-col bg-gray-50"><Header /><main className="flex-grow flex items-center justify-center p-4"><Card><Alert type="error" title="Introuvable" message={error || "RDV introuvable"} /></Card></main><Footer /></div>;

  const isCancelled = appointment.status === 'CANCELLED';
  const isActive = !isCancelled && appointment.status !== 'NO_SHOW';

  // Calcul durée avec les nouveaux champs slotStart/slotEnd
  let durationMinutes: number | null = null;
  if (appointment.slotEnd && appointment.slotStart) {
    const start = new Date(appointment.slotStart).getTime();
    const end = new Date(appointment.slotEnd).getTime();
    durationMinutes = Math.max(1, Math.round((end - start) / 60000));
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {cancelSuccess && <div className="mb-6"><Alert type="success" title="Annulé" message="Rendez-vous annulé avec succès" dismissible onDismiss={() => setCancelSuccess(false)} /></div>}

          {isActive && (
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Réservation confirmée !</h1>
              <p className="text-gray-600">Un e-mail de confirmation vous a été envoyé.</p>
            </div>
          )}

          {isCancelled && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4"><Calendar className="h-8 w-8 text-orange-600" /></div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rendez-vous annulé</h1>
            </div>
          )}

          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Détails</h2>
              {getStatusBadge(appointment.status)}
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-doctolib-blue mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Date et heure</p>
                  <p className="text-gray-600">
                    {/* Utilisation de slotStart */}
                    {format(new Date(appointment.slotStart), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
                  </p>
                </div>
              </div>

              {durationMinutes !== null && (
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-doctolib-blue mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Durée estimée</p>
                    <p className="text-gray-600">{durationMinutes} min</p>
                  </div>
                </div>
              )}

              {appointment.service && (
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-doctolib-blue mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Prestation</p>
                    <p className="text-gray-600">{appointment.service.name}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.service.priceMinCents / 100}€ - {appointment.service.priceMaxCents / 100}€
                    </p>
                  </div>
                </div>
              )}

              {appointment.artisan && (
                <>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-doctolib-blue mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Artisan</p>
                      <p className="text-gray-600">{appointment.artisan.name}</p>
                      <p className="text-sm text-gray-500">{appointment.artisan.address}, {appointment.artisan.city}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-doctolib-blue mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Contact</p>
                      <p className="text-gray-600">{appointment.artisan.phone}</p>
                    </div>
                  </div>
                </>
              )}

              {appointment.customerNotes && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-900 mb-1">Vos notes</p>
                  <p className="text-gray-600">{appointment.customerNotes}</p>
                </div>
              )}
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/" className="flex-1"><Button variant="outline" fullWidth>Retour à l'accueil</Button></Link>
            {isActive && <Button variant="danger" onClick={handleCancel} disabled={cancelling} className="flex-1">{cancelling ? 'Annulation...' : 'Annuler le RDV'}</Button>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}