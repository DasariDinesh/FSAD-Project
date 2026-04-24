import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, UtensilsCrossed, HeartHandshake, Clock, ArrowRight, Shield, LayoutDashboard } from 'lucide-react';

const LandingPage = () => {
  const features = [
    { icon: UtensilsCrossed, title: 'Meal Pre-Selection', desc: '8+ cuisine options from vegetarian to kosher — tailored to every dietary need.' },
    { icon: HeartHandshake, title: 'Special Services', desc: 'Wheelchair assistance, extra legroom, priority boarding, and more.' },
    { icon: Clock, title: 'Real-Time Updates', desc: 'Modify selections up to 12 hours before departure with live countdown.' },
    { icon: Shield, title: 'Secure & Simple', desc: 'Your data is safe. Quick PNR lookup to manage everything in one place.' },

    // NEW FEATURE (your visible modification)
    { icon: LayoutDashboard, title: 'User-Friendly Dashboard', desc: 'Manage bookings, view details, and update preferences easily.' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">

      {/* Hero */}
      <section className="airline-gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-gold/20"
              style={{
                width: `${100 + i * 120}px`,
                height: `${100 + i * 120}px`,
                top: '60%',
                left: '70%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="airline-badge airline-badge-gold mb-4 inline-block">
                Booking Management System
              </span>

              <h1 className="text-4xl md:text-6xl font-display font-bold airline-gold-text leading-tight">
                Smart Flight Booking,
                <br />
                <span className="text-gold-light/70">
                  Made Simple
                </span>
              </h1>

              <p className="text-lg text-gold-light/50 mt-6 max-w-lg leading-relaxed">
                Manage your flight bookings, services, and preferences easily through a modern web application interface.
              </p>

              {/* NEW LINE (your identification) */}
              <p className="text-sm text-gold-light/40 mt-3">
                Developed by: Dinesh
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold airline-gold-bg hover:opacity-90 transition-all"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/lookup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 border-gold/30 airline-gold-text hover:bg-gold/10 transition-all"
                >
                  <Plane className="w-4 h-4" />
                  Manage Booking
                </Link>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground">
              System Features
            </h2>
            <p className="text-muted-foreground mt-2">
              Easy and efficient flight booking management
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;

              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="airline-card text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 airline-gold-text" />
                  </div>

                  <h3 className="font-semibold text-foreground mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="airline-gradient-bg py-16">
        <div className="container mx-auto px-4 text-center">

          <h2 className="text-3xl font-display font-bold airline-gold-text mb-4">
            Ready to Manage Your Booking?
          </h2>

          <p className="text-gold-light/50 mb-8 max-w-md mx-auto">
            Sign in now to access your dashboard and manage flight details.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold airline-gold-bg hover:opacity-90 transition-all text-lg"
          >
            Login Now
            <ArrowRight className="w-5 h-5" />
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full airline-gold-bg flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>

            <span className="font-display font-bold text-foreground">
              SkyLine Airways
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 Booking Management System | Developed by Dinesh
          </p>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;