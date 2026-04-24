import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { mealOptions, specialServices, isBeforeCutoff } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Plane, UtensilsCrossed, HeartHandshake, Search, Clock, ChevronRight, Users } from 'lucide-react';

const Dashboard = () => {
  const { user, bookings, mealSelections, serviceSelections } = useAppStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  // NEW: calculate total passengers
  const totalPassengers = bookings.reduce(
    (sum, booking) => sum + booking.passengers.length,
    0
  );

  // NEW: current date
  const today = new Date().toLocaleDateString();

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-12">

      {/* Welcome Banner */}
      <div className="airline-gradient-bg py-10">
        <div className="container mx-auto px-4">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold airline-gold-text">
              Welcome, {user.name}
            </h1>

            <p className="text-gold-light/60 mt-2">
              Manage your flights, meals, and special services
            </p>

            {/* NEW subtitle */}
            <p className="text-sm text-gold-light/40 mt-1">
              Flight Booking Management Dashboard
            </p>

            {/* NEW date */}
            <p className="text-xs text-gold-light/40 mt-1">
              Date: {today}
            </p>

          </motion.div>

        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">

          {[
            { label: 'Active Bookings', value: bookings.length, icon: Plane },
            { label: 'Meals Selected', value: mealSelections.length, icon: UtensilsCrossed },
            { label: 'Services Added', value: serviceSelections.length, icon: HeartHandshake },

            // NEW STAT
            { label: 'Total Passengers', value: totalPassengers, icon: Users },

          ].map((stat, i) => {

            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="airline-card flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 airline-gold-text" />
                </div>

                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>

              </motion.div>
            );
          })}

        </div>

        {/* Quick action */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/lookup')}
          className="w-full airline-card flex items-center gap-4 mb-8 hover:border-gold/40 cursor-pointer group"
        >

          <div className="w-12 h-12 rounded-xl airline-gold-bg flex items-center justify-center shrink-0">
            <Search className="w-6 h-6" />
          </div>

          <div className="flex-1 text-left">

            <div className="font-semibold text-foreground">
              Add a Booking
            </div>

            <div className="text-xs text-muted-foreground">
              Look up a booking by PNR to manage meals and services
            </div>

          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:airline-gold-text transition-colors" />

        </motion.button>

        {/* Bookings List */}

        <h2 className="text-xl font-display font-bold text-foreground mb-4">
          Your Bookings
        </h2>

        {bookings.length === 0 ? (

          <div className="airline-card text-center py-12">

            <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />

            <h3 className="font-semibold text-foreground">
              No bookings yet
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              Use the booking lookup to add your flights
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {bookings.map((booking, i) => {

              const canEdit = isBeforeCutoff(
                booking.departureDate,
                booking.departureTime
              );

              const bookingMeals = mealSelections.filter(
                m => m.bookingId === booking.id
              );

              const bookingServices = serviceSelections.filter(
                s => s.bookingId === booking.id
              );

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/booking/${booking.id}`)}
                  className="airline-card cursor-pointer group hover:border-gold/40"
                >

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="flex items-center gap-6">

                      <div className="text-center">
                        <div className="text-xl font-bold text-foreground">
                          {booking.originCode}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {booking.departureTime}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 min-w-[80px]">
                        <div className="h-px flex-1 bg-border" />
                        <Plane className="w-4 h-4 airline-gold-text" />
                        <div className="h-px flex-1 bg-border" />
                      </div>

                      <div className="text-center">
                        <div className="text-xl font-bold text-foreground">
                          {booking.destinationCode}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {booking.arrivalTime}
                        </div>
                      </div>

                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:airline-gold-text transition-colors" />

                  </div>

                </motion.div>
              );

            })}

          </div>

        )}

      </div>

    </div>
  );
};

export default Dashboard;