import { Booking } from "./types";
import { addDays, subHours } from "date-fns";

const now = new Date();

export const mockBookings: Booking[] = [
  {
    pnr: "XYZ123",
    ownerUsername: "john",
    flightNumber: "BA123",
    airline: "British Airways",
    aircraft: "Boeing 777",
    origin: { code: "LHR", city: "London" },
    destination: { code: "DXB", city: "Dubai" },
    departure: addDays(now, 5).toISOString(),
    arrival: addDays(now, 5).toISOString(), // rough estimate
    passengers: [
      { id: "p1", name: "John Carter", seat: "12A" },
      { id: "p2", name: "Sarah Carter", seat: "12B" },
    ],
    editableUntil: addDays(now, 4).toISOString(), // 24h before
  },
  {
    pnr: "ABC456",
    ownerUsername: "john",
    flightNumber: "AF456",
    airline: "Air France",
    aircraft: "Airbus A350",
    origin: { code: "CDG", city: "Paris" },
    destination: { code: "JFK", city: "New York" },
    departure: addDays(now, 10).toISOString(),
    arrival: addDays(now, 10).toISOString(),
    passengers: [
      { id: "p3", name: "John Carter", seat: "24C" },
    ],
    editableUntil: addDays(now, 9).toISOString(),
  },
  {
    pnr: "LOCKED99",
    ownerUsername: "maya",
    flightNumber: "EK789",
    airline: "Emirates",
    aircraft: "Airbus A380",
    origin: { code: "DXB", city: "Dubai" },
    destination: { code: "SIN", city: "Singapore" },
    departure: addDays(now, 0).toISOString(), // Departing very soon
    arrival: addDays(now, 0).toISOString(),
    passengers: [
      { id: "p4", name: "Maya Singh", seat: "4A" },
    ],
    editableUntil: subHours(now, 12).toISOString(), // Cutoff passed
  },
  {
    pnr: "ADM001",
    ownerUsername: "admin",
    flightNumber: "SQ001",
    airline: "Singapore Airlines",
    aircraft: "Airbus A350",
    origin: { code: "SIN", city: "Singapore" },
    destination: { code: "SFO", city: "San Francisco" },
    departure: addDays(now, 14).toISOString(),
    arrival: addDays(now, 14).toISOString(),
    passengers: [
      { id: "p5", name: "Alex Rivera", seat: "1A" },
    ],
    editableUntil: addDays(now, 13).toISOString(),
  }
];

export const initialSelections = {
  "XYZ123": {
    "p1": { meal: "non-vegetarian" as const, services: ["extra-legroom" as const] },
    "p2": { meal: "vegetarian" as const, services: [] }
  },
  "LOCKED99": {
    "p4": { meal: "vegan" as const, services: ["wheelchair" as const, "priority-boarding" as const] }
  }
};
