import { Location, RawLocationsData, RawTripData } from '@/components/travels/PolarstepsParser';

export function loadTripData() {
  const locationsContext = (require as any).context('@/assets/trip-data', false, /locations.*\.json$/);
  const locationsFiles = locationsContext.keys().map(locationsContext) as RawLocationsData[];
  const tripContext = (require as any).context('@/assets/trip-data', false, /trip.*\.json$/);
  const tripFiles = tripContext.keys().map(tripContext) as RawTripData[];

  return {
    locationsData: mergeLocationsData(locationsFiles),
    tripData: mergeTripData(tripFiles)
  };
}

function mergeLocationsData(files: RawLocationsData[]): RawLocationsData {
  return {
    locations: files.reduce((acc, file) => [...acc, ...(file.locations || [])], [] as Location[])
  };
}

function mergeTripData(files: RawTripData[]): RawTripData {
  return files.reduce((acc, file) => ({
    name: acc.name || file.name,
    start_date: Math.min(acc.start_date || Infinity, file.start_date),
    end_date: Math.max(acc.end_date || -Infinity, file.end_date),
    total_km: (acc.total_km || 0) + (file.total_km || 0),
    all_steps: [...(acc.all_steps || []), ...(file.all_steps || [])]
  }), {
    name: '',
    start_date: 0,
    end_date: 0,
    total_km: 0,
    all_steps: []
  });
} 
