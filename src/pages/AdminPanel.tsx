import { useAppStore } from '@/lib/store';
import { mealOptions, specialServices, mockBookings } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { BarChart3, UtensilsCrossed, Plane, Users, Settings, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AdminPanel = () => {
  const { user, mealSelections, serviceSelections, bookings } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'meals' | 'bookings'>('analytics');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground mt-2">Admin access required. Login as admin@skyline.com</p>
          <button onClick={() => navigate('/login')} className="mt-4 airline-gold-text font-medium hover:underline">Go to Login</button>
        </div>
      </div>
    );
  }

  // Analytics: count meal selections across all bookings
  const mealCounts = mealOptions.map(meal => ({
    ...meal,
    count: mealSelections.filter(ms => ms.mealId === meal.id).length,
  }));
  const maxCount = Math.max(1, ...mealCounts.map(m => m.count));

  const serviceCounts = specialServices.map(svc => ({
    ...svc,
    count: serviceSelections.filter(ss => ss.serviceId === svc.id).length,
  }));

  const allBookings = [...mockBookings];

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-12">
      <div className="airline-gradient-bg py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 airline-gold-text" />
            <h1 className="text-3xl font-display font-bold airline-gold-text">Admin Panel</h1>
          </div>
          <p className="text-gold-light/60">Manage meals, services, and view analytics</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
            { key: 'meals' as const, label: 'Meal Options', icon: UtensilsCrossed },
            { key: 'bookings' as const, label: 'All Bookings', icon: Plane },
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

        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Bookings', value: allBookings.length, icon: Plane },
                { label: 'Total Passengers', value: allBookings.reduce((a, b) => a + b.passengers.length, 0), icon: Users },
                { label: 'Meals Selected', value: mealSelections.length, icon: UtensilsCrossed },
                { label: 'Services Requested', value: serviceSelections.length, icon: HeartHandshake },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="airline-card flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 airline-gold-text" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Meal analytics */}
            <div className="airline-card">
              <h3 className="text-lg font-display font-bold text-foreground mb-4">Meal Selection Distribution</h3>
              <div className="space-y-3">
                {mealCounts.map(meal => (
                  <div key={meal.id} className="flex items-center gap-3">
                    <span className="text-xl w-8">{meal.icon}</span>
                    <span className="text-sm font-medium text-foreground w-32 shrink-0">{meal.name}</span>
                    <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(meal.count / maxCount) * 100}%` }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="h-full rounded-lg airline-gold-bg"
                      />
                    </div>
                    <span className="text-sm font-bold text-foreground w-8 text-right">{meal.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service analytics */}
            <div className="airline-card">
              <h3 className="text-lg font-display font-bold text-foreground mb-4">Special Services Requests</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {serviceCounts.map(svc => (
                  <div key={svc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <span className="text-xl">{svc.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{svc.name}</div>
                      <div className="text-xs text-muted-foreground">{svc.category}</div>
                    </div>
                    <div className="text-lg font-bold text-foreground">{svc.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'meals' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mealOptions.map(meal => (
              <div key={meal.id} className="airline-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{meal.icon}</span>
                  <span className={`airline-badge ${meal.available ? 'airline-badge-success' : 'airline-badge-warning'}`}>
                    {meal.available ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">{meal.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{meal.description}</p>
                <div className="text-xs text-muted-foreground font-mono mt-2">{meal.code}</div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {allBookings.map(booking => (
              <div key={booking.id} className="airline-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">{booking.originCode}</div>
                      <div className="text-xs text-muted-foreground">{booking.departureTime}</div>
                    </div>
                    <Plane className="w-4 h-4 airline-gold-text" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">{booking.destinationCode}</div>
                      <div className="text-xs text-muted-foreground">{booking.arrivalTime}</div>
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-sm text-foreground">{booking.flightNumber}</div>
                      <div className="text-xs text-muted-foreground">PNR: {booking.pnr}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="airline-badge airline-badge-gold">{booking.class}</span>
                    <span className="airline-badge airline-badge-sky">{booking.passengers.length} pax</span>
                    <span className="text-xs text-muted-foreground">{booking.departureDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
