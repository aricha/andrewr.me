'use client'
import { useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { Location } from '@/types/travels';

interface TravelMapProps {
  locations: Location[];
}

export default function TravelMap({ locations }: TravelMapProps) {
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  
  const mapContainerStyle = {
    width: '100%',
    height: '70vh',
  };

  return (
    <APIProvider apiKey='AIzaSyAZ12pcBvlCZP6eH3nYQ12j-9yiwqmIE6U'>
      <Map
        style={mapContainerStyle}
        center={center}
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
        mapTypeId='satellite'
        colorScheme='DARK'
        disableDefaultUI={true}
        scrollwheel={false}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{
              lat: location.coordinates[0],
              lng: location.coordinates[1]
            }}
            onClick={() => setActiveLocation(location)}
          />
        ))}
        
        {activeLocation && (
          <InfoWindow
            position={{
              lat: activeLocation.coordinates[0],
              lng: activeLocation.coordinates[1]
            }}
            onCloseClick={() => setActiveLocation(null)}
          >
            <div>{activeLocation.name}</div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}