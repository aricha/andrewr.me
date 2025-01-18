'use client'
import TravelMapDebugTool from '@/components/travels/TravelMapDebugTool';
import locationsData from '@/assets/locations.json';
import tripData from '@/assets/trip.json';

export default function TravelMapDebugPage() {
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