'use client'
import { useState, useEffect } from 'react';
import TravelMap from './TravelMap';
import { TravelData, TravelDataProvider, Location } from './TravelDataProvider';
import defaultFilterConfig from '@/assets/trip-data/filter-config.json';

export default function TravelMapDebugTool() {
  const [showDetailedPoints, setShowDetailedPoints] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<Location[]>(() => {
    return defaultFilterConfig.excludedPoints || [];
  });
  const [travelData, setTravelData] = useState<TravelData | undefined>(undefined);
  
  const dataProvider = TravelDataProvider.getInstance();

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await dataProvider.loadTravelData({
        excludedPoints: selectedPoints
      }, 0.01, true);
      setTravelData(data);
    };
    
    loadInitialData();
  }, []);

  const handleFilterConfigChange = async (points: Location[]) => {
    setSelectedPoints(points);
    const newData = await dataProvider.updateFilterConfig({
      excludedPoints: points
    }, true);
    setTravelData(newData);
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
          onClick={() => handleFilterConfigChange([])}
          className="px-4 py-2 bg-red-500 text-white rounded mt-2"
        >
          Clear Selection
        </button>
      </div>

      <TravelMap
        travelData={travelData}
        onPointSelectionChange={handleFilterConfigChange}
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