import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Plane, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignup && !name)) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }
    let success: boolean;
    if (isSignup) {
      success = signup(name, email, password);
    } else {
      success = login(email, password);
    }
    if (success) {
      toast({ title: isSignup ? 'Welcome aboard!' : 'Welcome back!', description: 'You have been signed in successfully.' });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left: hero */}
      <div className="hidden lg:flex lg:w-1/2 airline-gradient-bg relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-gold/20"
              style={{
                width: `${200 + i * 150}px`,
                height: `${200 + i * 150}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full airline-gold-bg flex items-center justify-center mx-auto mb-8">
            <Plane className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-display font-bold airline-gold-text mb-4">
            Elevate Your Journey
          </h1>
          <p className="text-lg text-gold-light/70 leading-relaxed">
            Pre-select meals and special services for a seamless travel experience tailored just for you.
          </p>
        </motion.div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-foreground">
              {isSignup ? 'Create Account' : 'Sign In'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isSignup ? 'Join SkyLine Airways to manage your bookings' : 'Access your bookings and preferences'}
            </p>
          </div>

          {!isSignup && (
            <div className="mb-6 p-4 rounded-lg bg-sky-light border border-sky/20">
              <p className="text-sm text-navy font-medium">Demo accounts:</p>
              <p className="text-xs text-navy-muted mt-1">User: rahul@example.com • Admin: admin@skyline.com</p>
              <p className="text-xs text-navy-muted">Any password works</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="airline-input pl-10"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="airline-input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="airline-input pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-lg font-semibold text-sm airline-gold-bg hover:opacity-90 transition-all">
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignup(!isSignup)} className="airline-gold-text font-semibold hover:underline">
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
