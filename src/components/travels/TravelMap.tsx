'use client'
import { useState, useMemo, useCallback } from 'react';
import { APIProvider, Map, Marker, InfoWindow, AdvancedMarker, Pin, AdvancedMarkerProps, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { Polyline } from './Polyline';
import { Location } from '@/types/travels';
import { PolarstepsParser } from './PolarstepsParser';

interface TravelMapProps {
  locationsData: any;
  tripData: any;
}

// Add constant at the top of the file
const ENABLE_DEBUG_MODE = true;  // Set to true when debugging is needed

// First, let's create the AdvancedMarkerWithRef component
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

// Add new interface for segment debug info
interface SegmentDebugInfo {
  index: number;
  coordinates: Array<[number, number]>;
  isFlight: boolean;
  debugInfo?: {
    startTime: number;
    endTime: number;
    speedKmH?: number;
    distanceDegrees?: number;
  } | null;
}

export default function TravelMap({ locationsData, tripData }: TravelMapProps) {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [selectedSegment, setSelectedSegment] = useState<SegmentDebugInfo | null>(null);
  
  const mapContainerStyle = {
    width: '100%',
    height: '70vh',
  };

  // Parse the trip data using the constant
  const parsedTrip = useMemo(() => {
    return PolarstepsParser.parse(locationsData, tripData, ENABLE_DEBUG_MODE);
  }, [locationsData, tripData]);

  // Simplify the route to reduce number of points
  const simplifiedRoute = useMemo(() => {
    return PolarstepsParser.simplifyRoute(parsedTrip.routeSegments, 0.01);
  }, [parsedTrip]);

  // Convert route coordinates to LatLngLiteral array
  const pathCoordinates = useMemo(() => {
    return simplifiedRoute.map((segment) => segment.coordinates.map(([lat, lon]) => ({
      lat,
      lng: lon
    })));
  }, [simplifiedRoute]);

  // Calculate center point of the map
  const initialCenter = useMemo(() => ({
    lat: (parsedTrip.bounds.north + parsedTrip.bounds.south) / 2,
    lng: (parsedTrip.bounds.east + parsedTrip.bounds.west) / 2
  }), [parsedTrip.bounds]);
  const [center, setCenter] = useState(initialCenter);

  const handleMarkerClick = useCallback((index: number, marker: google.maps.marker.AdvancedMarkerElement) => {
    setActiveMarker(activeMarker === index ? null : index);
    setSelectedMarker(marker);
  }, [activeMarker]);

  // Helper function to format debug info
  const formatDebugInfo = (segment: SegmentDebugInfo) => {
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

  return (
    <APIProvider apiKey='AIzaSyAZ12pcBvlCZP6eH3nYQ12j-9yiwqmIE6U'>
      <div>
        <Map
          style={mapContainerStyle}
          center={center}
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
          {/* Render route segments - now only add click handler if debug info is enabled */}
          {simplifiedRoute.map((segment, index) => (
            <Polyline
              key={index}
              path={segment.coordinates.map(([lat, lon]) => ({
                lat,
                lng: lon
              }))}
              strokeColor={segment.isFlight ? '#00FF00' : '#FF0000'}
              strokeOpacity={segment.isFlight ? 0 : 0.8}
              strokeWeight={2}
              geodesic={true}
              zIndex={1}
              icons={segment.isFlight ? [{
                icon: {
                  path: 'M 0,-1 0,1',
                  strokeOpacity: 1,
                  scale: 2
                },
                offset: '0',
                repeat: '10px'
              }] : undefined}
              // Only add click handler if debug info is present
              onClick={segment.debugInfo ? () => setSelectedSegment({
                index,
                ...segment
              }) : undefined}
            />
          ))}

          {/* Render stop markers */}
          {parsedTrip.stops.map((stop, index) => (
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

        {/* Debug panel - only shown if debug info is present */}
        {selectedSegment?.debugInfo && (
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
            <div>Segment #{selectedSegment.index}</div>
            <div>{formatDebugInfo(selectedSegment)}</div>
            <button 
              onClick={() => setSelectedSegment(null)}
              style={{ marginTop: '10px' }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </APIProvider>
  );
}