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
import { Artisan, Service } from '@/types';
import { MapPin, Clock, ChevronLeft, ChevronRight, CheckCircle, Camera } from 'lucide-react';
import { isEmail, isPhoneFr, isRequired } from '@/utils/validation';

interface AvailabilityDay {
  date: string;
  slots: string[];
}

export default function ArtisanProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calendarStartIndex, setCalendarStartIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Formulaire
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  // AJOUT : Description et Photos
  const [customerNotes, setCustomerNotes] = useState(''); 
  const [photos, setPhotos] = useState<File[]>([]); 
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      try {
        const resProfile: any = await api.getArtisanBySlug(slug);
        setArtisan(resProfile.data.artisan);
        setServices(resProfile.data.services);

        if (resProfile.data.artisan?.id) {
          const from = format(new Date(), "yyyy-MM-dd'T'00:00:00'Z'");
          const to = format(addDays(new Date(), 14), "yyyy-MM-dd'T'23:59:59'Z'");
          const resAvail: any = await api.getArtisanAvailability(resProfile.data.artisan.id, from, to);
          setAvailability(resAvail.data.availability);
        }
      } catch (err: any) {
        setError("Impossible de charger l'artisan.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = [...photos, ...newFiles].slice(0, 2); // Max 2 photos
      setPhotos(totalFiles);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!isRequired(customerName)) errors.customerName = 'Nom obligatoire';
    if (!isRequired(customerEmail)) errors.customerEmail = 'Email obligatoire';
    else if (!isEmail(customerEmail)) errors.customerEmail = 'Email invalide';
    if (!isRequired(customerPhone)) errors.customerPhone = 'Téléphone obligatoire';
    else if (!isPhoneFr(customerPhone)) errors.customerPhone = 'Numéro invalide';
    
    // Validation Description (Option 4)
    if (!isRequired(customerNotes)) errors.customerNotes = 'Veuillez décrire le problème pour aider l\'artisan.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBooking = async () => {
    if (!artisan || !selectedService || !selectedDateStr || !selectedTime) return;
    if (!validateForm()) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      const start = new Date(`${selectedDateStr}T${selectedTime}:00`);
      const end = new Date(start.getTime() + (selectedService.estimatedDurationMin || 30) * 60000);

      // On utilise FormData pour envoyer texte + fichiers
      const formData = new FormData();
      formData.append('artisanId', artisan.id);
      formData.append('serviceId', selectedService.id);
      formData.append('slotStart', start.toISOString());
      formData.append('slotEnd', end.toISOString());
      formData.append('customerName', customerName);
      formData.append('customerEmail', customerEmail);
      formData.append('customerPhone', customerPhone);
      formData.append('customerNotes', customerNotes); // Description obligatoire
      
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      // Appel API avec FormData (le navigateur gère le Content-Type multipart)
      const res: any = await api.createAppointment(formData);
      navigate(`/booking/confirm/${res.id}`);
    } catch (e: any) {
        console.error(e);
        const msg = e.response?.data?.message || "Erreur lors de la réservation";
        setBookingError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loader message="Chargement..." />;
  if (error || !artisan) return <div className="p-10 flex justify-center"><Alert type="error" title="Erreur" message={error || "Introuvable"} /></div>;

  const visibleDays = availability.slice(calendarStartIndex, calendarStartIndex + 4);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow py-8 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* GAUCHE */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <h1 className="text-2xl font-bold">{artisan.name}</h1>
              <p className="text-gray-600 capitalize mb-2">{artisan.category}</p>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" /> {artisan.city} ({artisan.zipcode})
              </div>
            </Card>

            <div>
              <h2 className="text-lg font-bold mb-3">1. Choisissez un motif</h2>
              <div className="space-y-2">
                {services.map(s => (
                  <div 
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedService?.id === s.id ? 'border-doctolib-blue bg-doctolib-blue-light ring-1 ring-doctolib-blue' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between font-medium">
                      <span>{s.name}</span><span>{s.priceMinCents/100}€</span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1"/> {s.estimatedDurationMin} min
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DROITE */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-lg font-bold mb-4">2. Choisissez un créneau</h2>
              
              {!selectedService ? (
                <div className="text-center py-8 bg-gray-50 rounded border border-dashed text-gray-500">Sélectionnez un motif à gauche.</div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <button onClick={() => setCalendarStartIndex(i => Math.max(0, i - 4))} disabled={calendarStartIndex === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ChevronLeft/></button>
                      <span className="font-semibold text-sm">Disponibilités</span>
                      <button onClick={() => setCalendarStartIndex(i => i + 4)} className="p-1 hover:bg-gray-100 rounded"><ChevronRight/></button>
                    </div>
                    <div className="grid grid-cols-4 gap-0 border-t border-l">
                      {visibleDays.map(day => (
                        <div key={day.date} className="border-r border-b min-h-[200px]">
                          <div className="text-center py-2 bg-gray-50 border-b font-medium text-sm">
                            {format(new Date(day.date), 'EEE d MMM', { locale: fr })}
                          </div>
                          <div className="p-2 flex flex-col gap-2 overflow-y-auto max-h-[300px] custom-scrollbar">
                            {day.slots.length === 0 ? <div className="text-center text-gray-300">-</div> : day.slots.map(slot => (
                                <button key={slot} onClick={() => { setSelectedDateStr(day.date); setSelectedTime(slot); }} className={`py-1.5 px-1 text-sm font-bold rounded transition-colors ${selectedDateStr === day.date && selectedTime === slot ? 'bg-doctolib-blue text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}>{slot}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDateStr && selectedTime && (
                    <div className="bg-gray-50 p-6 rounded border border-gray-200 animate-fade-in">
                      <h3 className="font-bold flex items-center mb-4 text-gray-900"><CheckCircle className="h-5 w-5 text-green-600 mr-2"/> Finaliser le rendez-vous</h3>
                      <p className="mb-4 text-sm text-gray-600">{selectedService.name} le <strong>{format(new Date(selectedDateStr), 'd MMMM', { locale: fr })} à {selectedTime}</strong></p>
                      
                      {bookingError && <Alert type="error" message={bookingError} className="mb-4" />}

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nom complet</label>
                                <input className={`w-full p-2 border rounded text-sm ${formErrors.customerName ? 'border-red-500' : ''}`} value={customerName} onChange={e => setCustomerName(e.target.value)} />
                                {formErrors.customerName && <p className="text-xs text-red-500">{formErrors.customerName}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Téléphone</label>
                                <input className={`w-full p-2 border rounded text-sm ${formErrors.customerPhone ? 'border-red-500' : ''}`} value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                                {formErrors.customerPhone && <p className="text-xs text-red-500">{formErrors.customerPhone}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                            <input className={`w-full p-2 border rounded text-sm ${formErrors.customerEmail ? 'border-red-500' : ''}`} value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                            {formErrors.customerEmail && <p className="text-xs text-red-500">{formErrors.customerEmail}</p>}
                        </div>

                        {/* DESCRIPTION OBLIGATOIRE */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description du problème <span className="text-red-500">*</span></label>
                            <textarea className={`w-full p-2 border rounded text-sm ${formErrors.customerNotes ? 'border-red-500' : ''}`} rows={3} placeholder="Détaillez votre problème..." value={customerNotes} onChange={e => setCustomerNotes(e.target.value)} />
                            {formErrors.customerNotes && <p className="text-xs text-red-500">{formErrors.customerNotes}</p>}
                        </div>
                        
                        {/* PHOTOS */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Photos (Optionnel, max 2)</label>
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                    <Camera className="h-4 w-4" /> Ajouter une photo
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                                </label>
                                <span className="text-xs text-gray-500">{photos.length} photo(s)</span>
                            </div>
                            {photos.length > 0 && <div className="mt-2 flex gap-2">{photos.map((p, i) => <div key={i} className="text-xs bg-gray-200 px-2 py-1 rounded truncate max-w-[150px]">{p.name}</div>)}</div>}
                        </div>

                        <Button fullWidth onClick={handleBooking} disabled={bookingLoading} size="lg">{bookingLoading ? 'Envoi...' : 'Confirmer le rendez-vous'}</Button>
                        <p className="text-xs text-center text-gray-500 mt-2">Un assistant IA vous contactera peut-être pour valider les détails.</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}