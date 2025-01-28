/// <reference types="google.maps" preserve="true" />
'use client'
import { Fragment, useState, useMemo, useCallback } from 'react';
import {
  APIProvider, Map, InfoWindow, AdvancedMarker, 
  Pin, AdvancedMarkerProps, useAdvancedMarkerRef,
  CollisionBehavior
} from '@vis.gl/react-google-maps';
import { Polyline } from './Polyline';
import { TravelData, Location, RouteSegment, TravelMode } from './TravelDataProvider';
import { PLANE_ICON_PATH, TRAIN_ICON_PATH } from './icons';

interface TravelMapProps {
  travelData?: TravelData;
  debugMode?: boolean;
  showDetailedPoints?: boolean;
  selectedPoints?: Location[];
  style?: React.CSSProperties;
  onSegmentHover?: (segment: SegmentDebugInfo | null) => void;
  onPointHover?: (segment: SegmentDebugInfo | null) => void;
  onPointClick?: (point: Location) => void;
  highlightedPoints?: {
    point: Location;
    color: string;
  }[];
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

export interface SegmentDebugInfo {
  index: number;
  points: Location[];
  mode: TravelMode;
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

interface RouteSegmentPolylineProps {
  segment: RouteSegment;
  partIndex: number;
  segmentIndex: number;
  debugMode: boolean;
  onSegmentHover?: (segment: SegmentDebugInfo | null) => void;
}

const RouteSegmentPolyline: React.FC<RouteSegmentPolylineProps> = ({
  segment,
  partIndex,
  segmentIndex,
  onSegmentHover,
  debugMode
}) => {
  const path = segment.points.map(point => ({
    lat: point.lat,
    lng: point.lon
  }));

  const style = getTravelModeStyles(debugMode)[segment.mode || 'ground'];

  return (
    <Polyline
      key={`${partIndex}-${segmentIndex}`}
      path={path}
      strokeColor={style.color}
      strokeOpacity={style.opacity}
      strokeWeight={2}
      geodesic={true}
      zIndex={1}
      icons={style.icons}
      onMouseOver={segment.debugInfo ? () => onSegmentHover?.({
        index: segmentIndex,
        ...segment
      }) : undefined}
      onMouseOut={() => onSegmentHover?.(null)}
    />
  );
};

const getTravelModeStyles = (debugMode: boolean): Record<TravelMode, {
  color: string;
  opacity: number;
  icons?: google.maps.IconSequence[];
}> => ({
  ground: {
    color: debugMode ? '#FF0000' : 'white',
    opacity: 0.8,
    icons: debugMode ? [
      {
        icon: {
          path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
          strokeOpacity: 1,
          scale: 2,
        },
        offset: "0",
        repeat: "100px",
      }
    ] : []
  },
  flight: {
    color: debugMode ? '#0000FF' : 'white',
    opacity: 0,
    icons: [
      {
        icon: {
          path: PLANE_ICON_PATH,
          scale: 1,
          rotation: -47,
          anchor: new google.maps.Point(25, 0),
          fillColor: debugMode ? '#0000FF' : 'white',
          fillOpacity: 0.9,
        },
        offset: '50%',
        repeat: '0'
      },
      {
        icon: {
          path: "M 0,-1 0,1",
          strokeOpacity: 1,
          scale: 2,
        },
        offset: "0",
        repeat: "10px",
      }
    ]
  },
  train: {
    color: debugMode ? '#00FF00' : 'white',
    opacity: 0,
    icons: [
      {
        icon: {
          path: TRAIN_ICON_PATH,
          scale: 1,
          rotation: -115,
          anchor: new google.maps.Point(10, 0),
          fillColor: debugMode ? '#00FF00' : 'white',
          fillOpacity: 0.9,
          strokeColor: debugMode ? '#00FF00' : 'white',
          strokeOpacity: 0.9,
        },
        offset: '50%',
        repeat: '0'
      },
      {
        icon: {
          path: "M 0,-1 0,1",
          strokeOpacity: 1,
          scale: 2,
        },
        offset: "0",
        repeat: "10px",
      }
    ]
  },
  boat: {
    color: debugMode ? '#2196F3' : 'white',
    opacity: 0.8,
    icons: [{
      icon: {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        scale: 2,
      },
      offset: "0",
      repeat: "15px",
    }]
  }
});

export default function TravelMap({
  travelData,
  debugMode = false,
  showDetailedPoints = false,
  selectedPoints = [],
  style = {},
  onSegmentHover,
  onPointHover,
  onPointClick,
  highlightedPoints = []
}: TravelMapProps) {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const mapBounds = useMemo(() => (
    travelData ? {
      north: travelData.bounds.north,
      south: travelData.bounds.south,
      east: travelData.bounds.west,
      west: travelData.bounds.east
    } : {
      north: 90,
      south: -90,
      east: 180,
      west: -180
    }
  ), [travelData]);

  const handleMarkerClick = useCallback((index: number, marker: google.maps.marker.AdvancedMarkerElement) => {
    setActiveMarker(activeMarker === index ? null : index);
    setSelectedMarker(marker);
  }, [activeMarker]);

  return (
    <APIProvider apiKey='AIzaSyAZ12pcBvlCZP6eH3nYQ12j-9yiwqmIE6U'>
      <div>
        <Map
          style={style}
          className='w-full sm:h-[70vh] sm:max-h-[750px] aspect-square sm:aspect-auto'
          defaultBounds={{...mapBounds, padding: 100}}
          mapId="8eb6596767bee51b"
          onClick={() => {
            setActiveMarker(null);
            setSelectedMarker(null);
          }}
          gestureHandling='cooperative'
          mapTypeId='hybrid'
          colorScheme='DARK'
          disableDefaultUI={true}
          scrollwheel={debugMode}
          renderingType='VECTOR'
        >
          {/* Render route segments for each trip part */}
          {travelData?.tripParts.map((tripPart, partIndex) => (
            <Fragment key={partIndex}>
              {tripPart.routeSegments.map((segment, segmentIndex) => (
                <RouteSegmentPolyline
                  key={`${partIndex}-${segmentIndex}`}
                  segment={segment}
                  partIndex={partIndex}
                  segmentIndex={segmentIndex}
                  debugMode={debugMode}
                  onSegmentHover={onSegmentHover}
                />
              ))}

              {/* Render debug points for each trip part */}
              {debugMode && showDetailedPoints && tripPart.routeSegments.map((segment, segmentIndex) => (
                segment.points.map((point, pointIndex) => {
                  const isSelected = selectedPoints?.some(p =>
                    p.lat === point.lat && p.lon === point.lon
                  );
                  const highlight = highlightedPoints.find(h => 
                    h.point.time === point.time
                  );

                  return (
                    <AdvancedMarkerWithRef
                      key={`${partIndex}-${segmentIndex}-${pointIndex}`}
                      position={{ lat: point.lat, lng: point.lon }}
                      onMarkerClick={() => onPointClick?.(point)}
                      onMouseEnter={() => onPointHover?.({
                        index: segmentIndex, ...segment
                      })}
                      onMouseLeave={() => onPointHover?.(null)}
                      collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          highlight ? highlight.color :
                          isSelected ? 'bg-red-500' : 
                          'bg-blue-500'
                        }`}
                      />
                    </AdvancedMarkerWithRef>
                  );
                })
              ))}

              {/* Render stops for each trip part */}
              {tripPart.stops.map((stop, stopIndex) => (
                <div key={stopIndex}>
                  <AdvancedMarkerWithRef
                    position={{ lat: stop.location.lat, lng: stop.location.lon }}
                    onMarkerClick={(marker) => handleMarkerClick(stopIndex, marker)}
                    // collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
                  >
                    <Pin
                      background={'#DB4437'}
                      borderColor={'#AA1B0B'}
                      glyphColor={'#FFFFFF'}
                    />
                  </AdvancedMarkerWithRef>

                  {activeMarker === stopIndex && selectedMarker && (
                    <InfoWindow
                      anchor={selectedMarker}
                      onCloseClick={() => setActiveMarker(null)}
                    >
                      <div>{stop.displayName}</div>
                    </InfoWindow>
                  )}
                </div>
              ))}
            </Fragment>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}