export type UserRole = "passenger" | "admin";

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export interface Passenger {
  id: string;
  name: string;
  seat: string;
}

export interface Airport {
  code: string;
  city: string;
}

export interface Booking {
  pnr: string;
  ownerUsername: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  origin: Airport;
  destination: Airport;
  departure: string; // ISO
  arrival: string; // ISO
  passengers: Passenger[];
  editableUntil: string; // ISO
}

export type MealOption = "vegetarian" | "non-vegetarian" | "vegan" | "kosher" | "jain";
export type ServiceOption = "wheelchair" | "extra-legroom" | "priority-boarding" | "medical";

export interface PassengerSelections {
  meal?: MealOption;
  services: ServiceOption[];
}

// Maps bookingPnr -> passengerId -> Selections
export type BookingSelectionsMap = Record<string, Record<string, PassengerSelections>>;
