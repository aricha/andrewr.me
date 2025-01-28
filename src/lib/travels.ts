import { TravelData } from '@/types/travels';
import travelData from '../../public/data/travels.json';

export function getAllTravels(): TravelData {
  return travelData as TravelData;
}

export function getLocationById(id: string) {
  return getAllTravels().locations.find(
    location => location.id === id
  );
}