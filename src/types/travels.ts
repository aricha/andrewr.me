export interface Location {
  id: string;
  name: string;
  coordinates: [lat: number, lng: number];
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