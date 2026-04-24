export interface Passenger {
  id: string;
  name: string;
  seatNumber: string;
  type: 'adult' | 'child' | 'infant';
}

export interface Booking {
  id: string;
  pnr: string;
  lastName: string;
  flightNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  status: 'confirmed' | 'checked-in' | 'cancelled';
  passengers: Passenger[];
  aircraft: string;
  class: 'Economy' | 'Business' | 'First';
}

export interface MealOption {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  tags: string[];
  available: boolean;
}

export interface SpecialService {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  category: 'mobility' | 'comfort' | 'medical' | 'family' | 'priority';
  available: boolean;
}

export interface MealSelection {
  passengerId: string;
  mealId: string;
  bookingId: string;
}

export interface ServiceSelection {
  passengerId: string;
  serviceId: string;
  bookingId: string;
  notes: string;
}

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    pnr: 'ABC123',
    lastName: 'SHARMA',
    flightNumber: 'SK 201',
    origin: 'New Delhi',
    originCode: 'DEL',
    destination: 'London Heathrow',
    destinationCode: 'LHR',
    departureDate: '2026-04-15',
    departureTime: '02:30',
    arrivalTime: '07:45',
    status: 'confirmed',
    aircraft: 'Boeing 787-9 Dreamliner',
    class: 'Business',
    passengers: [
      { id: 'p1', name: 'Rahul Sharma', seatNumber: '2A', type: 'adult' },
      { id: 'p2', name: 'Priya Sharma', seatNumber: '2B', type: 'adult' },
      { id: 'p3', name: 'Arjun Sharma', seatNumber: '2C', type: 'child' },
    ],
  },
  {
    id: 'b2',
    pnr: 'XYZ789',
    lastName: 'PATEL',
    flightNumber: 'SK 445',
    origin: 'Mumbai',
    originCode: 'BOM',
    destination: 'Dubai',
    destinationCode: 'DXB',
    departureDate: '2026-04-20',
    departureTime: '14:15',
    arrivalTime: '16:30',
    status: 'confirmed',
    aircraft: 'Airbus A380',
    class: 'Economy',
    passengers: [
      { id: 'p4', name: 'Amit Patel', seatNumber: '24F', type: 'adult' },
    ],
  },
  {
    id: 'b3',
    pnr: 'LMN456',
    lastName: 'KUMAR',
    flightNumber: 'SK 102',
    origin: 'Singapore',
    originCode: 'SIN',
    destination: 'Tokyo Narita',
    destinationCode: 'NRT',
    departureDate: '2026-05-01',
    departureTime: '09:00',
    arrivalTime: '17:15',
    status: 'checked-in',
    aircraft: 'Boeing 777-300ER',
    class: 'First',
    passengers: [
      { id: 'p5', name: 'Vijay Kumar', seatNumber: '1A', type: 'adult' },
      { id: 'p6', name: 'Lakshmi Kumar', seatNumber: '1B', type: 'adult' },
    ],
  },
];

export const mealOptions: MealOption[] = [
  { id: 'm1', name: 'Standard Meal', code: 'STML', description: 'Chef-curated entrée with sides, bread roll, and dessert', icon: '🍽️', tags: ['Popular'], available: true },
  { id: 'm2', name: 'Vegetarian', code: 'VGML', description: 'Plant-based entrée with seasonal vegetables and grains', icon: '🥗', tags: ['Vegetarian'], available: true },
  { id: 'm3', name: 'Vegan', code: 'VVML', description: 'Fully plant-based meal with no animal products', icon: '🌱', tags: ['Vegan', 'Dairy-Free'], available: true },
  { id: 'm4', name: 'Jain Meal', code: 'VJML', description: 'No root vegetables, onion, or garlic — Jain dietary guidelines', icon: '🪷', tags: ['Jain', 'Vegetarian'], available: true },
  { id: 'm5', name: 'Halal Meal', code: 'MOML', description: 'Prepared according to Islamic dietary requirements', icon: '🍖', tags: ['Halal'], available: true },
  { id: 'm6', name: 'Kosher Meal', code: 'KSML', description: 'Prepared under rabbinical supervision', icon: '✡️', tags: ['Kosher'], available: true },
  { id: 'm7', name: 'Gluten-Free', code: 'GFML', description: 'No wheat, barley, rye, or gluten-containing ingredients', icon: '🌾', tags: ['Gluten-Free'], available: true },
  { id: 'm8', name: 'Child Meal', code: 'CHML', description: 'Kid-friendly portions with fun presentation', icon: '🧒', tags: ['Kids'], available: true },
];

export const specialServices: SpecialService[] = [
  { id: 's1', name: 'Wheelchair Assistance', code: 'WCHR', description: 'Wheelchair to/from aircraft door', icon: '♿', category: 'mobility', available: true },
  { id: 's2', name: 'Extra Legroom Seat', code: 'EXST', description: 'Preferred seating with additional legroom', icon: '🦵', category: 'comfort', available: true },
  { id: 's3', name: 'Medical Assistance', code: 'MEDA', description: 'Special medical support during travel', icon: '⚕️', category: 'medical', available: true },
  { id: 's4', name: 'Infant Bassinet', code: 'BSCT', description: 'Bassinet seat for infants under 10kg', icon: '👶', category: 'family', available: true },
  { id: 's5', name: 'Priority Boarding', code: 'PRBR', description: 'Board the aircraft before general boarding', icon: '⭐', category: 'priority', available: true },
  { id: 's6', name: 'Unaccompanied Minor', code: 'UMNR', description: 'Staff assistance for children traveling alone', icon: '🧒', category: 'family', available: true },
  { id: 's7', name: 'Meet & Assist', code: 'MAAS', description: 'Personal escort through the airport', icon: '🤝', category: 'comfort', available: true },
];

export const mockUsers = [
  { id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'user' as const },
  { id: 'u2', name: 'Admin User', email: 'admin@skyline.com', role: 'admin' as const },
];

export function lookupBooking(pnr: string, lastName: string): Booking | undefined {
  return mockBookings.find(
    b => b.pnr.toUpperCase() === pnr.toUpperCase() && b.lastName.toUpperCase() === lastName.toUpperCase()
  );
}

export function getFlightCutoffTime(departureDate: string, departureTime: string): Date {
  const [h, m] = departureTime.split(':').map(Number);
  const d = new Date(departureDate);
  d.setHours(h, m, 0, 0);
  d.setHours(d.getHours() - 12);
  return d;
}

export function isBeforeCutoff(departureDate: string, departureTime: string): boolean {
  return new Date() < getFlightCutoffTime(departureDate, departureTime);
}
