'use client'
import { useState, useMemo, useCallback, useEffect } from 'react';
import { APIProvider, Map, InfoWindow, AdvancedMarker, Pin, AdvancedMarkerProps, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { Polyline } from './Polyline';
import { TravelData, Location } from './TravelDataProvider';

interface TravelMapProps {
  travelData?: TravelData;
  debugMode?: boolean;
  showDetailedPoints?: boolean;
  selectedPoints?: Location[];
  style?: React.CSSProperties;
  onPointSelectionChange?: (points: Location[]) => void;
}

const AdvancedMarkerWithRef = (
  props: AdvancedMarkerProps & {
    onMarkerClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  }
) => {
  const { children, onMarkerClick, ...advancedMarkerProps } = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      ref={markerRef}
      {...advancedMarkerProps}
    >
      {children}
    </AdvancedMarker>
  );
};

interface SegmentDebugInfo {
  index: number;
  points: Location[];
  isFlight: boolean;
  debugInfo?: {
    startTime: number;
    endTime: number;
    speedKmH?: number;
    distanceDegrees?: number;
  } | null;
  pointInfo?: {
    lat: number;
    lon: number;
    time: number;
  };
}

interface PointSelectionMode {
  type: 'single' | 'range';
  startPoint?: Location;
  endPoint?: Location;
}

interface PointInfoPanelProps {
  point: Location;
  onDelete: () => void;
  onClose: () => void;
  onStartRange: () => void;
}

const PointInfoPanel: React.FC<PointInfoPanelProps> = ({ point, onDelete, onClose, onStartRange }) => {
  const time = new Date(point.time * 1000).toLocaleString();

  return (
    <div className="absolute top-10 right-10 bg-black/80 text-white p-4 rounded-lg">
      <div className="mb-2">
        <div>Time: {time}</div>
        <div>Lat: {point.lat.toFixed(6)}</div>
        <div>Lon: {point.lon.toFixed(6)}</div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onDelete}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Delete Point
        </button>
        <button
          onClick={onStartRange}
          className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
        >
          Start Range
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 px-3 py-1 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function TravelMap({
  travelData,
  debugMode = false,
  showDetailedPoints = false,
  selectedPoints = [],
  style = {},
  onPointSelectionChange
}: TravelMapProps) {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [selectedSegment, setSelectedSegment] = useState<SegmentDebugInfo | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [googleMapsSymbolsLoaded, setGoogleMapsSymbolsLoaded] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<SegmentDebugInfo | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Location | null>(null);
  const [selectionMode, setSelectionMode] = useState<PointSelectionMode>({ type: 'single' });

  const mapContainerStyle = {
    width: '100%',
    height: '70vh',
    ...style
  };

  // Calculate center point of the map
  const initialCenter = useMemo(() => (
    travelData && {
      lat: (travelData.bounds.north + travelData.bounds.south) / 2,
      lng: (travelData.bounds.east + travelData.bounds.west) / 2
    } || {
      lat: 0,
      lng: 0
    }
  ), [travelData?.bounds]);

  const handleMarkerClick = useCallback((index: number, marker: google.maps.marker.AdvancedMarkerElement) => {
    setActiveMarker(activeMarker === index ? null : index);
    setSelectedMarker(marker);
  }, [activeMarker]);

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
      Type: ${segment.isFlight ? 'Flight' : 'Ground'}
    `;
  };

  const togglePointSelection = useCallback((point: Location) => {
    if (!onPointSelectionChange || !travelData) return;

    if (selectionMode.type === 'single') {
      setSelectedPoint(point);
    } else if (selectionMode.type === 'range' && selectionMode.startPoint) {
      // Handle range selection
      const startTime = Math.min(selectionMode.startPoint.time, point.time);
      const endTime = Math.max(selectionMode.startPoint.time, point.time);

      // Find all points within the time range
      const pointsInRange = travelData.routeSegments.flatMap(segment =>
        segment.points.filter(p => p.time >= startTime && p.time <= endTime)
      );

      // Convert to SelectedPoint format
      const newPoints = [
        ...selectedPoints,
        ...pointsInRange.map(p => ({
          time: p.time,
          lat: p.lat,
          lon: p.lon
        }))
      ];

      onPointSelectionChange(newPoints);
      setSelectionMode({ type: 'single' });
    }
  }, [selectedPoints, onPointSelectionChange, selectionMode, travelData?.routeSegments]);

  // Add these new handler functions
  const handleDeletePoint = useCallback(() => {
    if (!selectedPoint || !onPointSelectionChange) return;

    const newPoints = [...selectedPoints, {
      time: selectedPoint.time,
      lat: selectedPoint.lat,
      lon: selectedPoint.lon
    }];

    onPointSelectionChange(newPoints);
    setSelectedPoint(null);
  }, [selectedPoint, selectedPoints, onPointSelectionChange]);

  const handleStartRange = useCallback(() => {
    if (!selectedPoint) return;

    setSelectionMode({
      type: 'range',
      startPoint: selectedPoint
    });
    setSelectedPoint(null);
  }, [selectedPoint]);

  // Add effect to detect when Google Maps symbols are loaded
  useEffect(() => {
    const checkGoogleMapsSymbols = () => {
      if ((window.google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW as any) !== undefined) {
        setGoogleMapsSymbolsLoaded(true);
      } else {
        // If not loaded yet, check again in 100ms
        setTimeout(checkGoogleMapsSymbols, 100);
      }
    };

    checkGoogleMapsSymbols();

    return () => {
      setGoogleMapsSymbolsLoaded(false);
    };
  }, []);

  const forwardArrowPath = useMemo(() =>
    googleMapsSymbolsLoaded
      ? window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW
      : undefined
    , [googleMapsSymbolsLoaded]);

  return (
    <APIProvider apiKey='AIzaSyAZ12pcBvlCZP6eH3nYQ12j-9yiwqmIE6U'>
      <div>
        <Map
          style={mapContainerStyle}
          center={center || initialCenter}
          mapId="8eb6596767bee51b"
          onClick={() => {
            setActiveMarker(null);
            setSelectedMarker(null);
          }}
          onCenterChanged={(event) => {
            if (event) {
              setCenter(event.detail.center)
            }
          }}
          zoom={zoomLevel}
          onZoomChanged={(event) => {
            if (event) {
              setZoomLevel(event.detail.zoom)
            }
          }}
          gestureHandling='cooperative'
          mapTypeId='hybrid'
          colorScheme='DARK'
          disableDefaultUI={true}
          scrollwheel={true}
        >
          {/* Render route segments */}
          {travelData?.routeSegments.map((segment, index) => (
            <Polyline
              key={index}
              path={segment.points.map(point => ({
                lat: point.lat,
                lng: point.lon
              }))}
              strokeColor={segment.isFlight ? '#00FF00' : '#FF0000'}
              strokeOpacity={segment.isFlight ? 0 : 0.8}
              strokeWeight={2}
              geodesic={true}
              zIndex={1}
              icons={forwardArrowPath ? [{
                icon: {
                  path: forwardArrowPath,
                  scale: 3,
                  strokeColor: segment.isFlight ? '#00FF00' : '#FF0000',
                  strokeOpacity: 1,
                },
                offset: '50%',
                repeat: '100px'
              },
              ...(segment.isFlight ? [{
                icon: {
                  path: 'M 0,-1 0,1',
                  strokeOpacity: 1,
                  scale: 2,
                  strokeColor: '#00FF00'
                },
                offset: '0',
                repeat: '10px'
              }] : [])] : undefined}
              onMouseOver={segment.debugInfo ? () => setSelectedSegment({
                index,
                ...segment
              }) : undefined}
              onMouseOut={() => setSelectedSegment(null)}
            />
          ))}

          {/* Only render detailed points in debug mode */}
          {debugMode && showDetailedPoints && travelData?.routeSegments.map((segment, segmentIndex) =>
            segment.points.map((point, pointIndex) => {
              const isSelected = selectedPoints.some(p =>
                p.lat === point.lat && p.lon === point.lon
              );
              const isRangeStart = selectionMode.type === 'range' &&
                selectionMode.startPoint?.time === point.time;

              return (
                <AdvancedMarkerWithRef
                  key={`${segmentIndex}-${pointIndex}`}
                  position={{ lat: point.lat, lng: point.lon }}
                  onMarkerClick={() => togglePointSelection(point)}
                  onMouseEnter={() => setHoveredPoint({
                    index: segmentIndex,
                    points: segment.points,
                    isFlight: segment.isFlight,
                    pointInfo: point
                  })}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${isSelected ? 'bg-red-500' :
                        isRangeStart ? 'bg-yellow-500' :
                          'bg-blue-500'
                      }`}
                  />
                </AdvancedMarkerWithRef>
              );
            })
          )}

          {/* Render stop markers */}
          {travelData?.stops.map((stop, index) => (
            <div key={index}>
              <AdvancedMarkerWithRef
                position={{ lat: stop.location.lat, lng: stop.location.lon }}
                onMarkerClick={(marker) => handleMarkerClick(index, marker)}
              >
                <Pin
                  background={'#DB4437'}
                  borderColor={'#AA1B0B'}
                  glyphColor={'#FFFFFF'}
                />
              </AdvancedMarkerWithRef>

              {activeMarker === index && selectedMarker && (
                <InfoWindow
                  anchor={selectedMarker}
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div>{stop.displayName}</div>
                </InfoWindow>
              )}
            </div>
          ))}
        </Map>

        {/* Add the point info panel */}
        {selectedPoint && (
          <PointInfoPanel
            point={selectedPoint}
            onDelete={handleDeletePoint}
            onClose={() => setSelectedPoint(null)}
            onStartRange={handleStartRange}
          />
        )}

        {/* Show range selection mode indicator */}
        {selectionMode.type === 'range' && (
          <div className="absolute top-10 left-10 bg-black/80 text-white p-4 rounded-lg">
            <div>Select end point for range deletion</div>
            <button
              onClick={() => setSelectionMode({ type: 'single' })}
              className="bg-gray-500 px-3 py-1 rounded hover:bg-gray-600 mt-2"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Only show debug panel in debug mode */}
        {debugMode && (selectedSegment?.debugInfo || hoveredPoint) && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '4px',
            maxWidth: '300px',
            whiteSpace: 'pre-line'
          }}>
            <div>{hoveredPoint ? 'Point Info' : `Segment #${selectedSegment?.index}`}</div>
            <div>{formatDebugInfo(hoveredPoint || selectedSegment!)}</div>
          </div>
        )}
      </div>
    </APIProvider>
  );
}