export interface Carrier {
  name: string;
  alternateId: string;
  logoUrl: string;
}

export interface Leg {
  origin: { displayCode: string };
  destination: { displayCode: string };
  departure: string;
  arrival: string;
  durationInMinutes: number;
  stopCount: number;
  carriers: { marketing: Carrier[] };
}

export interface Flight {
  legs: Leg[];
  price: { formatted: string };
}
