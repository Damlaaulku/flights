import { Flight } from "@/types/flight-list";

export interface FlightListProps {
  formData: {
    originSkyId: string;
    destinationSkyId: string;
    departureDate: string;
    returnDate?: string;
    passengerCount: string;
  };
}

export interface FlightCardProps {
  flight: Flight;
  isSelected: boolean;
  onSelect: () => void;
}
