'use client'
import { useState } from 'react';
import TravelMap from './TravelMap';
import { FilterConfig, SelectedPoint, RawLocationsData, RawTripData } from './PolarstepsParser';
import defaultFilterConfig from '@/assets/trip-data/filter-config.json';

interface TravelMapDebugToolProps {
  locationsData: RawLocationsData;
  tripData: RawTripData;
}

export default function TravelMapDebugTool({ locationsData, tripData }: TravelMapDebugToolProps) {
  const [showDetailedPoints, setShowDetailedPoints] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<SelectedPoint[]>(() => {
    // Initialize with points from default filter config
    return defaultFilterConfig.excludedPoints || [];
  });
  
  const handleFilterConfigChange = (points: SelectedPoint[]) => {
    setSelectedPoints(points);
  };

  const filterConfig: FilterConfig = {
    excludedPoints: selectedPoints
  };

  const handleExportConfig = () => {
    const config = {
      excludedPoints: selectedPoints
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filter-config.json';
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 bg-black/80 p-4 rounded-lg">
        <button
          onClick={() => setShowDetailedPoints(!showDetailedPoints)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {showDetailedPoints ? 'Hide Points' : 'Show Points'}
        </button>
        <button
          onClick={handleExportConfig}
          className="px-4 py-2 bg-green-500 text-white rounded mt-2 block w-full"
        >
          Export Filter Config
        </button>
        <div className="mt-2 text-xs text-gray-300">
          Selected points: {selectedPoints.length}
        </div>
        <button
          onClick={() => setSelectedPoints([])}
          className="px-4 py-2 bg-red-500 text-white rounded mt-2"
        >
          Clear Selection
        </button>
      </div>

      <TravelMap
        locationsData={locationsData}
        tripData={tripData}
        onFilterConfigChange={handleFilterConfigChange}
        filterConfig={filterConfig}
        debugMode={true}
        showDetailedPoints={showDetailedPoints}
        selectedPoints={selectedPoints}
        style={{
            height: '90vh'
        }}
      />
    </div>
  );
} 