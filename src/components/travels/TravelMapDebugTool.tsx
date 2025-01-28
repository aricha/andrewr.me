'use client'
import { useState, useEffect, useMemo } from 'react';
import TravelMap, { SegmentDebugInfo } from './TravelMap';
import { TravelData, TravelDataProvider, Location } from './TravelDataProvider';
import { emptyFilterConfig, FilterConfig, TravelMode, TravelModeRange } from './PolarstepsParser';

interface TravelModeRangeListProps {
  travelModes: TravelModeRange[];
  onRemove: (index: number) => void;
}

type SelectionMode = 'exclude' | 'travelMode';
type ExclusionMode = 'single' | 'range';

const TravelModeRangeList: React.FC<TravelModeRangeListProps> = ({ travelModes, onRemove }) => {
  return (
    <div className="mt-4 max-h-48 overflow-y-auto">
      <h3 className="text-white text-sm mb-2">Travel Mode Ranges:</h3>
      {travelModes.map((range, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded mb-1">
          <div className="text-xs text-white">
            <div>{new Date(range.startTime * 1000).toLocaleString()}</div>
            <div>{new Date(range.endTime * 1000).toLocaleString()}</div>
            <div className="font-bold">{range.mode}</div>
          </div>
          <button
            onClick={() => onRemove(index)}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default function TravelMapDebugTool() {
  const dataProvider = TravelDataProvider.getInstance();
  const [showDetailedPoints, setShowDetailedPoints] = useState(false);
  const [filterConfig, setFilterConfig] = useState<FilterConfig | undefined>(undefined);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('exclude');
  const [selectedTravelMode, setSelectedTravelMode] = useState<TravelMode>('ground');
  const [travelData, setTravelData] = useState<TravelData | undefined>(undefined);
  const [rangeStart, setRangeStart] = useState<Location | null>(null);
  const [exclusionMode, setExclusionMode] = useState<ExclusionMode>('single');
  const [hoveredPoint, setHoveredPoint] = useState<SegmentDebugInfo | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<SegmentDebugInfo | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      const { data, filterConfig } = await dataProvider.loadTravelData(0.01, true);
      setTravelData(data);
      setFilterConfig(filterConfig);
    };

    loadInitialData();
  }, [dataProvider]);

  const handleFilterConfigChange = async (newConfig: FilterConfig) => {
    setFilterConfig(newConfig);
    const newData = await dataProvider.updateFilterConfig(newConfig, true);
    setTravelData(newData);
  };

  const handleExcludePointSelection = (point: Location) => {
    // Just exclude the single point
    if (exclusionMode === 'single') {
      const newConfig = {...filterConfig!};
      newConfig.excludedPoints = [...newConfig.excludedPoints, point];
      handleFilterConfigChange(newConfig);
    } else if (exclusionMode === 'range') {
      if (!rangeStart) {
        setRangeStart(point);
      } else {
        // Handle range selection
        const startTime = Math.min(rangeStart.time, point.time);
        const endTime = Math.max(rangeStart.time, point.time);

        // Find all points within the time range
        const pointsInRange = travelData?.tripParts.flatMap(tripPart =>
          tripPart.routeSegments.flatMap(segment =>
            segment.points.filter(p => p.time >= startTime && p.time <= endTime)
          )
        ) || [];

        const newConfig = {...filterConfig!};
        newConfig.excludedPoints = [
          ...newConfig.excludedPoints,
          ...pointsInRange
        ];
        handleFilterConfigChange(newConfig);
      }
    }
  };

  const handleTravelModeSelection = (point: Location) => {
    // Handle travel mode range selection
    if (!rangeStart) {
      setRangeStart(point);
    } else {
      // Complete the range selection
      const startTime = Math.min(rangeStart.time, point.time);
      const endTime = Math.max(rangeStart.time, point.time);

      const newConfig = {...filterConfig!};
      newConfig.travelModes = [
        ...newConfig.travelModes,
        {
          startTime,
          endTime,
          mode: selectedTravelMode
        }
      ];

      handleFilterConfigChange(newConfig);
      setRangeStart(null);
    }
  };

  const handlePointHover = (segment: SegmentDebugInfo | null) => {
    setHoveredPoint(segment);
  }

  const handlePointClick = (point: Location) => {
    if (selectionMode === 'exclude') {
      handleExcludePointSelection(point);
    } else {
      handleTravelModeSelection(point);
    }
  };

  // Calculate highlighted points for visualization
  const highlightedPoints = useMemo(() => {
    if (!rangeStart) return [];

    return [{
      point: rangeStart,
      color: 'bg-yellow-500'
    }];
  }, [rangeStart]);

  const handleExportConfig = () => {
    const blob = new Blob([JSON.stringify(filterConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'filter-config.json';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRemoveTravelMode = (index: number) => {
    const newConfig = {...filterConfig!};
    newConfig.travelModes = newConfig.travelModes.filter((_, i) => i !== index);
    handleFilterConfigChange(newConfig);
  };

  const handleClearAll = () => {
    handleFilterConfigChange(emptyFilterConfig);
  };

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 bg-black/80 p-4 rounded-lg">
        <button
          onClick={() => setShowDetailedPoints(!showDetailedPoints)}
          className="px-4 py-2 bg-blue-500 text-white rounded w-full"
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
          Selected points: {filterConfig?.excludedPoints.length}
        </div>
        <button
          onClick={handleClearAll}
          className="px-4 py-2 bg-red-500 text-white rounded mt-2 w-full"
        >
          Clear All
        </button>
        <div className="mt-4 flex flex-col gap-1">
          <select
            value={selectionMode}
            onChange={(e) => setSelectionMode(e.target.value as 'exclude' | 'travelMode')}
            className="p-2 rounded bg-gray-700 text-white"
          >
            <option value="exclude">Exclude Points</option>
            <option value="travelMode">Set Travel Mode</option>
          </select>

          {selectionMode === 'exclude' && (
            <>
              <select
                value={exclusionMode}
                onChange={(e) => setExclusionMode(e.target.value as ExclusionMode)}
                className="p-2 rounded bg-gray-700 text-white mt-2"
              >
                <option value="single">Single Point</option>
                <option value="range">Range</option>
              </select>
            </>
          )}

          {selectionMode === 'travelMode' && (
            <>
              <select
                value={selectedTravelMode}
                onChange={(e) => setSelectedTravelMode(e.target.value as TravelMode)}
                className="w-full p-2 rounded bg-gray-700 text-white mt-2"
              >
                <option value="ground">Ground</option>
                <option value="flight">Flight</option>
                <option value="train">Train</option>
                <option value="boat">Boat</option>
              </select>

              <TravelModeRangeList
                travelModes={filterConfig?.travelModes || []}
                onRemove={handleRemoveTravelMode}
              />
            </>
          )}
        </div>
      </div>

      {(hoveredSegment?.debugInfo || hoveredPoint) && (
        <div className="absolute top-10 max-w-[300px] rounded-lg right-10 bg-black/80 text-white p-4 z-10">
          <div>{hoveredPoint ? 'Point Info' : `Segment #${hoveredSegment?.index}`}</div>
          <div>{formatDebugInfo(hoveredPoint || hoveredSegment!)}</div>
        </div>
      )}

      <TravelMap
        travelData={travelData}
        onSegmentHover={setHoveredSegment}
        onPointHover={handlePointHover}
        onPointClick={handlePointClick}
        debugMode={true}
        showDetailedPoints={showDetailedPoints}
        selectedPoints={filterConfig?.excludedPoints}
        highlightedPoints={highlightedPoints}
        style={{
          height: '90vh'
        }}
      />
    </div>
  );
}

// Helper function to format debug info
const formatDebugInfo = (segment: SegmentDebugInfo) => {
  if (segment.pointInfo) {
    const time = new Date(segment.pointInfo.time * 1000).toLocaleString();
    return `
      Point Info:
      Time: ${time}
      Lat: ${segment.pointInfo.lat.toFixed(6)}
      Lon: ${segment.pointInfo.lon.toFixed(6)}
    `;
  }

  if (!segment.debugInfo) return 'Debug info not available';

  const startDate = new Date(segment.debugInfo.startTime * 1000).toLocaleString();
  const endDate = new Date(segment.debugInfo.endTime * 1000).toLocaleString();
  const speed = segment.debugInfo.speedKmH?.toFixed(2) || 'N/A';
  const distance = segment.debugInfo.distanceDegrees ?
    (segment.debugInfo.distanceDegrees * 111).toFixed(2) : 'N/A';

  return `
    Start: ${startDate}
    End: ${endDate}
    Speed: ${speed} km/h
    Distance: ${distance} km
    Mode: ${segment.mode}
  `;
};
