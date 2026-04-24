import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { lookupBooking } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Search, Plane, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookingLookup = () => {
  const [pnr, setPnr] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addBooking } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnr || !lastName) {
      setError('Please enter both PNR and last name.');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    const booking = lookupBooking(pnr, lastName);
    setLoading(false);
    if (booking) {
      addBooking(booking);
      toast({ title: 'Booking found!', description: `Flight ${booking.flightNumber} — ${booking.originCode} → ${booking.destinationCode}` });
      navigate(`/booking/${booking.id}`);
    } else {
      setError('No booking found. Try: ABC123/SHARMA, XYZ789/PATEL, or LMN456/KUMAR');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 airline-gold-text" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Manage Booking</h1>
          <p className="text-muted-foreground mt-2">Enter your booking reference to select meals and services</p>
        </div>

        <div className="airline-card">
          <form onSubmit={handleLookup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Booking Reference (PNR)</label>
              <input
                type="text"
                value={pnr}
                onChange={e => setPnr(e.target.value.toUpperCase())}
                placeholder="e.g. ABC123"
                maxLength={6}
                className="airline-input uppercase tracking-widest text-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="e.g. Sharma"
                className="airline-input"
              />
            </div>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </motion.div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm airline-gold-bg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
              ) : (
                <>
                  <Plane className="w-4 h-4" />
                  Retrieve Booking
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Demo PNRs: <span className="font-mono font-medium">ABC123</span>/Sharma • <span className="font-mono font-medium">XYZ789</span>/Patel • <span className="font-mono font-medium">LMN456</span>/Kumar
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingLookup;
