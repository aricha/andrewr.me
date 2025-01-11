export interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
  dates: {
    start: string;
    end: string;
  };
  photos: string[];
  highlights: string[];
  description: string;
}

export interface TravelData {
  locations: Location[];
}