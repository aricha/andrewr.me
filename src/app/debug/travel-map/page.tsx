'use client'
import TravelMapDebugTool from '@/components/travels/TravelMapDebugTool';
import { RawLocationsData, RawTripData } from '@/components/travels/PolarstepsParser';

export default function TravelMapDebugPage() {
  const locationsContext = (require as any).context('@/assets/trip-data', false, /locations.*\.json$/);
  const locationsFiles = locationsContext.keys().map(locationsContext) as RawLocationsData[];
  const tripContext = (require as any).context('@/assets/trip-data', false, /trip.*\.json$/);
  const tripFiles = tripContext.keys().map(tripContext) as RawTripData[];

  // Merge all locations data
  const locationsData: RawLocationsData = locationsFiles.reduce((acc, file) => {
    return {
      locations: [...(acc.locations || []), ...(file.locations || [])]
    };
  }, { locations: [] });

  // Merge all trip data
  const tripData: RawTripData = tripFiles.reduce((acc, file) => {
    return {
      ...acc,
      name: acc.name || file.name,
      start_date: Math.min(acc.start_date || Infinity, file.start_date),
      end_date: Math.max(acc.end_date || -Infinity, file.end_date),
      total_km: (acc.total_km || 0) + (file.total_km || 0),
      all_steps: [...(acc.all_steps || []), ...(file.all_steps || [])]
    };
  }, { 
    name: '',
    start_date: 0,
    end_date: 0,
    total_km: 0,
    all_steps: []
  });
    
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Travel Map Debug Tool</h1>
      <TravelMapDebugTool
        locationsData={locationsData}
        tripData={tripData}
      />
    </div>
  );
} 