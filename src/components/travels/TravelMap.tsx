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

export default function TravelMap({ locationsData, tripData }: TravelMapProps) {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState(2);
  
  const mapContainerStyle = {
    width: '100%',
    height: '70vh',
  };

  // Parse the trip data
  const parsedTrip = useMemo(() => {
    return PolarstepsParser.parse(locationsData, tripData);
  }, [locationsData, tripData]);

  // Simplify the route to reduce number of points
  const simplifiedRoute = useMemo(() => {
    return PolarstepsParser.simplifyRoute(parsedTrip.routeCoordinates, 0.01);
  }, [parsedTrip]);

  // Convert route coordinates to LatLngLiteral array
  const pathCoordinates = useMemo(() => {
    return simplifiedRoute.map(([lat, lon]) => ({
      lat,
      lng: lon
    }));
  }, [simplifiedRoute]);
  console.log(pathCoordinates);

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

  return (
    <APIProvider apiKey='AIzaSyAZ12pcBvlCZP6eH3nYQ12j-9yiwqmIE6U'>
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
          {/* Render route line */}
          {pathCoordinates.length > 0 && (
            <Polyline
              path={pathCoordinates}
              strokeColor={'#FF0000'}
              strokeOpacity={0.8}
              strokeWeight={2}
              geodesic={true}
              zIndex={1}
            />
          )}

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
    </APIProvider>
  );
}