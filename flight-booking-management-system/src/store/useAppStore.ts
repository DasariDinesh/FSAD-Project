import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, BookingSelectionsMap, MealOption, ServiceOption } from '../lib/types';
import { initialSelections } from '../lib/mockData';

interface AppState {
  user: User | null;
  selections: BookingSelectionsMap;
  login: (user: User) => void;
  logout: () => void;
  updateMeal: (pnr: string, passengerId: string, meal: MealOption) => void;
  toggleService: (pnr: string, passengerId: string, service: ServiceOption) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      selections: initialSelections,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      updateMeal: (pnr, passengerId, meal) => set((state) => {
        const bookingSelections = state.selections[pnr] || {};
        const passSelections = bookingSelections[passengerId] || { services: [] };
        
        return {
          selections: {
            ...state.selections,
            [pnr]: {
              ...bookingSelections,
              [passengerId]: {
                ...passSelections,
                meal
              }
            }
          }
        };
      }),
      toggleService: (pnr, passengerId, service) => set((state) => {
        const bookingSelections = state.selections[pnr] || {};
        const passSelections = bookingSelections[passengerId] || { services: [] };
        
        const hasService = passSelections.services.includes(service);
        const newServices = hasService 
          ? passSelections.services.filter(s => s !== service)
          : [...passSelections.services, service];
          
        return {
          selections: {
            ...state.selections,
            [pnr]: {
              ...bookingSelections,
              [passengerId]: {
                ...passSelections,
                services: newServices
              }
            }
          }
        };
      })
    }),
    {
      name: 'flight-booking-storage',
    }
  )
);
