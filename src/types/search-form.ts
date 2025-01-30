export type AirportOption = {
  value: string;
  label: string;
};

export type FormValues = {
  originSkyId: string;
  destinationSkyId: string;
  departureDate: string;
  returnDate?: string;
  passengerCount: string;
};
