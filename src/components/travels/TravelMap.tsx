'use client'
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Location } from '@/types/travels';
import { LatLngExpression } from 'leaflet';  // Add this import
import 'leaflet/dist/leaflet.css';

interface TravelMapProps {
  locations: Location[];
}

export default function TravelMap({ locations }: TravelMapProps) {
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  
  // Specify the center as a LatLngExpression
  const defaultCenter: LatLngExpression = [0, 0];

  return (
    <div className="h-[600px] w-full">
      <MapContainer
        center={defaultCenter}
        zoom={2}
        className="h-full w-full"
        scrollWheelZoom={false}  // Optional: disable zoom on scroll
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinates as LatLngExpression}  // Type assertion here
            eventHandlers={{
              click: () => setActiveLocation(location),
            }}
          >
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}