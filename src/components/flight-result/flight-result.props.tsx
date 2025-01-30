import { Flight } from "@/types/flight-list";

export interface FlightResultProps {
  selectedDepartureFlight: Flight | null;
  selectedReturnFlight: Flight | null;
}
