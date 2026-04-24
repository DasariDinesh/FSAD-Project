import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { Plane, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/lookup', label: 'Manage Booking', icon: Plane },
        ...(user.role === 'admin'
          ? [{ to: '/admin', label: 'Admin Panel', icon: Shield }]
          : []),
      ]
    : [];

  return (
    <header className="sticky top-0 z-50 airline-gradient-bg border-b border-navy-light backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo and Project Name */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 rounded-full flex items-center justify-center airline-gold-bg"
          >
            <Plane className="w-5 h-5" />
          </motion.div>

          <div className="flex flex-col leading-tight">
            <span className="text-lg font-display font-bold airline-gold-text tracking-wide">
              SkyLine Airways
            </span>
            <span className="text-[10px] text-muted-foreground">
              Booking Management System
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const active = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'airline-gold-text bg-navy-light'
                    : 'text-muted-foreground hover:airline-gold-text hover:bg-navy-light/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Login Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-navy-light flex items-center justify-center">
                  <User className="w-4 h-4 airline-gold-text" />
                </div>

                <span className="airline-gold-text font-medium">
                  {user.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:airline-gold-text hover:bg-navy-light/50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-semibold airline-gold-bg transition-all duration-200 hover:opacity-90 hover:scale-105"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;