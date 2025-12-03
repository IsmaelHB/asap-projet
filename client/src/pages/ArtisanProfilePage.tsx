import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Loader from '@/components/common/Loader';
import Alert from '@/components/common/Alert';
import { api } from '@/services/api';
import { Artisan, Service, AvailabilityByDate } from '@/types';
import { MapPin, Phone, Star, Euro, Clock } from 'lucide-react';
import { isEmail, isPhoneFr, isRequired } from '@/utils/validation';

export default function ArtisanProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<AvailabilityByDate[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<AvailabilityByDate | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'morning' | 'afternoon' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtisanProfile = async () => {
      if (!slug) return;

      try {
        const response: any = await api.getArtisanBySlug(slug);
        setArtisan(response.data.artisan);
        setServices(response.data.services);

        if (response.data.artisan?.id) {
          const from = format(new Date(), "yyyy-MM-dd'T'00:00:00'Z'");
          const to = format(addDays(new Date(), 7), "yyyy-MM-dd'T'23:59:59'Z'");

          const availResponse: any = await api.getArtisanAvailability(
            response.data.artisan.id,
            from,
            to
          );
          setAvailability(availResponse.data.availability);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanProfile();
  }, [slug]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!isRequired(customerName)) errors.customerName = 'Nom obligatoire';
    if (!isRequired(customerEmail)) errors.customerEmail = 'Email obligatoire';
    else if (!isEmail(customerEmail)) errors.customerEmail = 'Email invalide';
    if (!isRequired(customerPhone)) errors.customerPhone = 'Téléphone obligatoire';
    else if (!isPhoneFr(customerPhone)) errors.customerPhone = 'Numéro invalide';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBooking = async () => {
    if (!artisan || !selectedService || !selectedDate || !selectedPeriod) return;

    if (!validateForm()) return;
    setBookingLoading(true);
    setBookingError(null);

    try {
      const date = new Date(selectedDate.date);
      const startHour = selectedPeriod === 'morning' ? 9 : 14;
      const endHour = selectedPeriod === 'morning' ? 12 : 18;

      date.setHours(startHour, 0, 0, 0);
      const startTs = date.toISOString();

      date.setHours(endHour, 0, 0, 0);
      const endTs = date.toISOString();

      const response: any = await api.createAppointment({
        artisan_id: artisan.id,
        service_id: selectedService.id,
        slot_start: startTs,
        slot_end: endTs,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_notes: customerNotes || undefined,
      });

      navigate(`/booking/confirm/${response.data.id}`);
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader message="Chargement du profil..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card>
            <Alert
              type="error"
              title="Artisan introuvable"
              message={error || "Cet artisan n'existe pas."}
            />
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const getPriceDisplay = (l: string) =>
    l === 'LOW' ? '€' : l === 'MEDIUM' ? '€€' : '€€€';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* INFO ARTISAN */}
          <Card className="mb-8">
            <div className="flex justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{artisan.name}</h1>
                <p className="capitalize text-gray-600 mb-4">{artisan.category}</p>

                <div className="flex flex-col gap-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {artisan.address}, {artisan.zipcode} {artisan.city}
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {artisan.phone}
                  </div>

                  <div className="flex items-center">
                    <Euro className="h-4 w-4 mr-1" />
                    {getPriceDisplay(artisan.priceLevel)}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-amber-500 ml-4">
                <Star className="h-6 w-6 fill-current" />
                <span className="ml-2 text-2xl font-semibold">{artisan.rating}</span>
                <span className="text-gray-500 ml-1">({artisan.reviewCount})</span>
              </div>
            </div>
          </Card>

          {/* SERVICES */}
          <h2 className="text-2xl font-bold mb-3">Prestations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {services.map((s) => (
              <Card
                key={s.id}
                hover
                className={`cursor-pointer ${
                  selectedService?.id === s.id
                    ? 'ring-2 ring-doctolib-blue bg-doctolib-blue-light'
                    : ''
                }`}
                onClick={() => setSelectedService(s)}
              >
                <h3 className="font-semibold">{s.name}</h3>
                {s.description && <p className="text-sm text-gray-600 mb-2">{s.description}</p>}
                <div className="flex justify-between text-sm">
                  <span className="text-doctolib-blue font-semibold">
                    {s.priceMinCents / 100}€ - {s.priceMaxCents / 100}€
                  </span>

                  <span className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    ~{s.estimatedDurationMin} min
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* RÉSERVATION */}
          {selectedService && (
  <Card>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Réserver un rendez-vous</h2>

    {bookingError && (
      <div className="mb-4">
        <Alert type="error" message={bookingError} />
      </div>
    )}

              {/* Dates */}
              <h3 className="font-semibold mb-2">Choisissez une date</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {availability
                  .filter((d) => d.morningAvailable || d.afternoonAvailable)
                  .map((d) => (
                    <button
                      key={d.date}
                      onClick={() => {
                        setSelectedDate(d);
                        setSelectedPeriod(null);
                      }}
                      className={`border rounded-lg p-3 text-center ${
                        selectedDate?.date === d.date
                          ? 'border-doctolib-blue bg-doctolib-blue-light'
                          : 'hover:border-doctolib-blue'
                      }`}
                    >
                      <p className="font-semibold">
                        {format(new Date(d.date), 'EEE dd MMM', { locale: fr })}
                      </p>
                    </button>
                  ))}
              </div>

              {/* Créneaux */}
              {selectedDate && (
                <>
                  <h3 className="font-semibold mb-2">Choisissez un créneau</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {selectedDate.morningAvailable && (
                      <button
                        onClick={() => setSelectedPeriod('morning')}
                        className={`border rounded-lg p-4 text-center ${
                          selectedPeriod === 'morning'
                            ? 'border-doctolib-blue bg-doctolib-blue-light'
                            : 'hover:border-doctolib-blue'
                        }`}
                      >
                        <p className="font-semibold">Matin</p>
                        <p className="text-gray-600 text-sm">9h - 12h</p>
                      </button>
                    )}

                    {selectedDate.afternoonAvailable && (
                      <button
                        onClick={() => setSelectedPeriod('afternoon')}
                        className={`border rounded-lg p-4 text-center ${
                          selectedPeriod === 'afternoon'
                            ? 'border-doctolib-blue bg-doctolib-blue-light'
                            : 'hover:border-doctolib-blue'
                        }`}
                      >
                        <p className="font-semibold">Après-midi</p>
                        <p className="text-gray-600 text-sm">14h - 18h</p>
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Formulaire */}
              {selectedPeriod && (
                <div className="space-y-4">

                  {/* Nom */}
                  <div>
                    <label className="text-sm font-medium">Nom complet *</label>
                    <input
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setFormErrors((s) => ({ ...s, customerName: '' }));
                      }}
                      className={`w-full border rounded-lg px-4 py-2 ${
                        formErrors.customerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.customerName && (
                      <p className="text-sm text-red-600">{formErrors.customerName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium">Email *</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        setFormErrors((s) => ({ ...s, customerEmail: '' }));
                      }}
                      className={`w-full border rounded-lg px-4 py-2 ${
                        formErrors.customerEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.customerEmail && (
                      <p className="text-sm text-red-600">{formErrors.customerEmail}</p>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="text-sm font-medium">Téléphone *</label>
                    <input
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        setFormErrors((s) => ({ ...s, customerPhone: '' }));
                      }}
                      placeholder="06 12 34 56 78"
                      className={`w-full border rounded-lg px-4 py-2 ${
                        formErrors.customerPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.customerPhone && (
                      <p className="text-sm text-red-600">{formErrors.customerPhone}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium">Notes (optionnel)</label>
                    <textarea
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>

                  {/* Bouton */}
                  <Button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    fullWidth
                  >
                    {bookingLoading ? 'Réservation...' : 'Confirmer'}
                  </Button>

                </div>
              )}
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
