'use client'
import TravelMapDebugTool from '@/components/travels/TravelMapDebugTool';
import { loadTripData } from '@/utils/trip-data-loader';

export default function TravelMapDebugPage() {
  const { locationsData, tripData } = loadTripData();
    
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