import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { mealOptions, specialServices, isBeforeCutoff, getFlightCutoffTime } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Plane, Clock, Users, UtensilsCrossed, HeartHandshake, ArrowLeft, Check, AlertTriangle, StickyNote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { bookings, mealSelections, serviceSelections, setMealSelection, setServiceSelection, removeServiceSelection } = useAppStore();
  const booking = bookings.find(b => b.id === id);
  const [activeTab, setActiveTab] = useState<'meals' | 'services'>('meals');
  const [activePassenger, setActivePassenger] = useState(0);
  const [serviceNotes, setServiceNotes] = useState<Record<string, string>>({});
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!booking) return;
    const update = () => {
      const cutoff = getFlightCutoffTime(booking.departureDate, booking.departureTime);
      const diff = cutoff.getTime() - Date.now();
      if (diff <= 0) { setCountdown('Selections closed'); return; }
      const days = Math.floor(diff / 86400000);
      const hrs = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      setCountdown(`${days}d ${hrs}h ${mins}m remaining`);
    };
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, [booking]);

  if (!booking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-foreground">Booking not found</h2>
          <button onClick={() => navigate('/lookup')} className="mt-4 airline-gold-text font-medium hover:underline">
            Search for a booking
          </button>
        </div>
      </div>
    );
  }

  const canEdit = isBeforeCutoff(booking.departureDate, booking.departureTime);
  const passenger = booking.passengers[activePassenger];
  const selectedMealId = mealSelections.find(m => m.passengerId === passenger.id && m.bookingId === booking.id)?.mealId;
  const selectedServiceIds = serviceSelections
    .filter(s => s.passengerId === passenger.id && s.bookingId === booking.id)
    .map(s => s.serviceId);

  const handleMealSelect = (mealId: string) => {
    if (!canEdit) return;
    setMealSelection({ passengerId: passenger.id, mealId, bookingId: booking.id });
    const meal = mealOptions.find(m => m.id === mealId);
    toast({ title: 'Meal selected', description: `${meal?.name} for ${passenger.name}` });
  };

  const handleServiceToggle = (serviceId: string) => {
    if (!canEdit) return;
    if (selectedServiceIds.includes(serviceId)) {
      removeServiceSelection(passenger.id, serviceId, booking.id);
    } else {
      setServiceSelection({
        passengerId: passenger.id,
        serviceId,
        bookingId: booking.id,
        notes: serviceNotes[serviceId] || '',
      });
      const svc = specialServices.find(s => s.id === serviceId);
      toast({ title: 'Service added', description: `${svc?.name} for ${passenger.name}` });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-12">
      {/* Flight Banner */}
      <div className="airline-gradient-bg py-8">
        <div className="container mx-auto px-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm airline-gold-text mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="airline-badge airline-badge-gold">{booking.class}</span>
                <span className="airline-badge airline-badge-sky">{booking.status}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold airline-gold-text">
                {booking.flightNumber}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold airline-gold-text">{booking.originCode}</div>
                  <div className="text-xs text-gold-light/60">{booking.origin}</div>
                  <div className="text-sm text-gold-light/80 font-mono">{booking.departureTime}</div>
                </div>
                <div className="flex-1 flex items-center gap-2 px-4">
                  <div className="h-px flex-1 bg-gold/30" />
                  <Plane className="w-5 h-5 airline-gold-text" />
                  <div className="h-px flex-1 bg-gold/30" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold airline-gold-text">{booking.destinationCode}</div>
                  <div className="text-xs text-gold-light/60">{booking.destination}</div>
                  <div className="text-sm text-gold-light/80 font-mono">{booking.arrivalTime}</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gold-light/60 uppercase tracking-wider">Selection Cutoff</div>
              <div className={`flex items-center gap-1.5 text-sm font-medium mt-1 ${canEdit ? 'airline-gold-text' : 'text-destructive'}`}>
                {canEdit ? <Clock className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {countdown}
              </div>
              <div className="text-xs text-gold-light/50 mt-1">{booking.departureDate} • {booking.aircraft}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4">
        {/* Passenger selector */}
        <div className="airline-card mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Passengers</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {booking.passengers.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActivePassenger(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  i === activePassenger
                    ? 'airline-gold-bg font-semibold'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {p.name} <span className="opacity-60">({p.seatNumber})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'meals' as const, label: 'Meal Selection', icon: UtensilsCrossed },
            { key: 'services' as const, label: 'Special Services', icon: HeartHandshake },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary airline-gold-text'
                    : 'bg-card text-muted-foreground hover:bg-muted border border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'meals' ? (
          <motion.div
            key="meals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {mealOptions.filter(m => m.available).map(meal => {
              const selected = selectedMealId === meal.id;
              return (
                <motion.button
                  key={meal.id}
                  whileHover={{ scale: canEdit ? 1.02 : 1 }}
                  whileTap={{ scale: canEdit ? 0.98 : 1 }}
                  onClick={() => handleMealSelect(meal.id)}
                  disabled={!canEdit}
                  className={`text-left p-5 rounded-xl border-2 transition-all ${
                    selected
                      ? 'airline-card-selected bg-card'
                      : 'bg-card border-border hover:border-gold/40'
                  } ${!canEdit ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{meal.icon}</span>
                    {selected && (
                      <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                        <Check className="w-4 h-4 text-navy" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{meal.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{meal.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {meal.tags.map(tag => (
                      <span key={tag} className="airline-badge airline-badge-gold text-[10px]">{tag}</span>
                    ))}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-2 font-mono">{meal.code}</div>
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {specialServices.filter(s => s.available).map(service => {
              const selected = selectedServiceIds.includes(service.id);
              return (
                <div
                  key={service.id}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    selected ? 'airline-card-selected bg-card' : 'bg-card border-border'
                  } ${!canEdit ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{service.icon}</span>
                    <button
                      onClick={() => handleServiceToggle(service.id)}
                      disabled={!canEdit}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        selected
                          ? 'bg-gold border-gold'
                          : 'border-border hover:border-gold/50'
                      } ${!canEdit ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {selected && <Check className="w-4 h-4 text-navy" />}
                    </button>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{service.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                  <span className="airline-badge airline-badge-sky text-[10px] mt-3">{service.category}</span>
                  {selected && canEdit && (
                    <div className="mt-3">
                      <div className="flex items-center gap-1 mb-1">
                        <StickyNote className="w-3 h-3 text-muted-foreground" />
                        <label className="text-xs text-muted-foreground">Notes</label>
                      </div>
                      <input
                        type="text"
                        placeholder="Add any special requirements..."
                        value={serviceNotes[service.id] || ''}
                        onChange={e => setServiceNotes(prev => ({ ...prev, [service.id]: e.target.value }))}
                        className="airline-input text-xs py-2"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingDetail;
