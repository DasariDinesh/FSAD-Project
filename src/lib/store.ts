import { create } from 'zustand';
import type { Booking, MealSelection, ServiceSelection } from './mockData';
import { mockUsers } from './mockData';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AppState {
  user: User | null;
  bookings: Booking[];
  mealSelections: MealSelection[];
  serviceSelections: ServiceSelection[];
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  addBooking: (booking: Booking) => void;
  setMealSelection: (sel: MealSelection) => void;
  setServiceSelection: (sel: ServiceSelection) => void;
  removeServiceSelection: (passengerId: string, serviceId: string, bookingId: string) => void;
  getMealForPassenger: (passengerId: string, bookingId: string) => string | undefined;
  getServicesForPassenger: (passengerId: string, bookingId: string) => ServiceSelection[];
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  bookings: [],
  mealSelections: [],
  serviceSelections: [],
  login: (email: string, _password: string) => {
    const found = mockUsers.find(u => u.email === email);
    if (found) {
      set({ user: found });
      return true;
    }
    // Allow any login for demo
    const newUser: User = { id: 'u-' + Date.now(), name: email.split('@')[0], email, role: 'user' };
    set({ user: newUser });
    return true;
  },
  signup: (name: string, email: string, _password: string) => {
    const newUser: User = { id: 'u-' + Date.now(), name, email, role: 'user' };
    set({ user: newUser });
    return true;
  },
  logout: () => set({ user: null }),
  addBooking: (booking) => set(s => ({
    bookings: s.bookings.some(b => b.id === booking.id) ? s.bookings : [...s.bookings, booking],
  })),
  setMealSelection: (sel) => set(s => ({
    mealSelections: [
      ...s.mealSelections.filter(m => !(m.passengerId === sel.passengerId && m.bookingId === sel.bookingId)),
      sel,
    ],
  })),
  setServiceSelection: (sel) => set(s => ({
    serviceSelections: [
      ...s.serviceSelections.filter(
        ss => !(ss.passengerId === sel.passengerId && ss.serviceId === sel.serviceId && ss.bookingId === sel.bookingId)
      ),
      sel,
    ],
  })),
  removeServiceSelection: (passengerId, serviceId, bookingId) => set(s => ({
    serviceSelections: s.serviceSelections.filter(
      ss => !(ss.passengerId === passengerId && ss.serviceId === serviceId && ss.bookingId === bookingId)
    ),
  })),
  getMealForPassenger: (passengerId, bookingId) => {
    return get().mealSelections.find(m => m.passengerId === passengerId && m.bookingId === bookingId)?.mealId;
  },
  getServicesForPassenger: (passengerId, bookingId) => {
    return get().serviceSelections.filter(s => s.passengerId === passengerId && s.bookingId === bookingId);
  },
}));
