import { 
  Location, 
  FilterConfig, 
  RawLocationsData, 
  RawTripData,
  PolarstepsParser,
  TravelMode
} from './PolarstepsParser';

export type { 
  Location, TravelMode, TravelModeRange, FilterConfig 
} from './PolarstepsParser';

/**
 * Trip data is split into multiple JSON files.
 * Each trip has two files:
 * - locations-*.json: Contains raw GPS coordinates and timestamps
 * - trip-*.json: Contains metadata, waypoints, and trip details
 */
import TripStatsData from '@/assets/trip-data/trip-stats.json';
import LocationsSEA from '@/assets/trip-data/locations-sea.json';
import LocationsEurope from '@/assets/trip-data/locations-europe.json';
import LocationsCentralAmerica from '@/assets/trip-data/locations-central-america.json';
import TripSEA from '@/assets/trip-data/trip-sea.json';
import TripEurope from '@/assets/trip-data/trip-europe.json';
import TripCentralAmerica from '@/assets/trip-data/trip-central-america.json';

// Type assertion functions to ensure imported JSON matches expected types
const asLocations = (json: unknown): RawLocationsData => json as RawLocationsData;
const asTrip = (json: unknown): RawTripData => json as RawTripData;

const TRIP_DATA = {
  'sea': {
    locations: asLocations(LocationsSEA),
    trip: asTrip(TripSEA)
  },
  'europe': {
    locations: asLocations(LocationsEurope),
    trip: asTrip(TripEurope)
  },
  'central-america': {
    locations: asLocations(LocationsCentralAmerica),
    trip: asTrip(TripCentralAmerica)
  }
} as const;

type TripName = keyof typeof TRIP_DATA;

export interface TripStats {
  [key: string]: number | string;
}

export interface Stop {
  name: string;
  displayName: string;
  startTime: number;
  location: {
    lat: number;
    lon: number;
    name: string;
    detail: string;
  };
}

export interface RouteSegment {
  points: Location[];
  mode: TravelMode;
  debugInfo?: {
    startTime: number;
    endTime: number;
    speedKmH?: number;
    distanceDegrees?: number;
  } | null;
}

export interface TripPart {
  name: string;
  routeSegments: RouteSegment[];
  stops: Stop[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface TravelData {
  startDate: number;
  endDate: number;
  totalKm: number;
  tripParts: TripPart[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  stats: { [key: string]: number | string };
  countries: { [code: string]: string };
}

export class TravelDataProvider {
  private static instance: TravelDataProvider;
  private cachedData: TravelData | null = null;
  private currentFilterConfig: FilterConfig | undefined;

  private constructor() {}

  static getInstance(): TravelDataProvider {
    if (!TravelDataProvider.instance) {
      TravelDataProvider.instance = new TravelDataProvider();
    }
    return TravelDataProvider.instance;
  }

  private async loadFilterConfig(): Promise<FilterConfig> {
    const filterConfig = await import('@/assets/trip-data/filter-config.json');
    return {
      excludedPoints: filterConfig.excludedPoints,
      travelModes: filterConfig.travelModes.map(mode => ({
        startTime: new Date(mode.startTime).getTime() / 1000,
        endTime: new Date(mode.endTime).getTime() / 1000,
        mode: mode.mode as TravelMode
      })),
      insertedPoints: Object.fromEntries(
        Object.entries(filterConfig.insertedPoints).map(([tripName, points]) => [
          tripName,
          points.map(point => ({
            time: new Date(point.time).getTime() / 1000,
            lat: point.lat,
            lon: point.lon
          }))
        ])
      )
    };
  }

  async loadTravelData(
    simplificationThreshold: number = 0.01,
    includeDebugInfo: boolean = false
  ): Promise<{ data: TravelData, filterConfig: FilterConfig }> {
    if (!this.currentFilterConfig) {
      this.currentFilterConfig = await this.loadFilterConfig();
    }

    if (this.cachedData) {
      return { data: this.cachedData, filterConfig: this.currentFilterConfig };
    }

    const tripParts: TripPart[] = [];
    const globalBounds = {
      north: -90,
      south: 90,
      east: -180,
      west: 180
    };
    let totalKm = 0;
    let startDate = Infinity;
    let endDate = -Infinity;

    for (const [tripName, data] of Object.entries(TRIP_DATA) as [TripName, typeof TRIP_DATA[TripName]][]) {
      const parsedData = PolarstepsParser.parse(
        data.locations,
        data.trip,
        tripName,
        includeDebugInfo,
        this.currentFilterConfig
      );

      const simplifiedSegments = PolarstepsParser.simplifyRoute(
        parsedData.routeSegments,
        simplificationThreshold
      );

      tripParts.push({
        name: parsedData.name,
        routeSegments: simplifiedSegments.map(segment => ({
          points: segment.points,
          mode: segment.mode,
          debugInfo: includeDebugInfo ? segment.debugInfo : undefined
        })),
        stops: parsedData.stops,
        bounds: parsedData.bounds
      });

      globalBounds.north = Math.max(globalBounds.north, parsedData.bounds.north);
      globalBounds.south = Math.min(globalBounds.south, parsedData.bounds.south);
      globalBounds.east = Math.max(globalBounds.east, parsedData.bounds.east);
      globalBounds.west = Math.min(globalBounds.west, parsedData.bounds.west);
      totalKm += parsedData.totalKm;
      startDate = Math.min(startDate, parsedData.startDate);
      endDate = Math.max(endDate, parsedData.endDate);
    }

    const stats = TripStatsData.stats;
    stats.Kilometers = totalKm;

    const travelData: TravelData = {
      startDate,
      endDate,
      totalKm,
      tripParts,
      bounds: globalBounds,
      stats: stats,
      countries: TripStatsData.countries
    };

    this.cachedData = travelData;
    
    return { data: travelData, filterConfig: this.currentFilterConfig };
  }

  async updateFilterConfig(
    filterConfig: FilterConfig, 
    includeDebugInfo: boolean = false
  ): Promise<TravelData> {
    this.clearCache();
    this.currentFilterConfig = filterConfig;
    const { data } = await this.loadTravelData(0.01, includeDebugInfo);
    return data;
  }

  clearCache() {
    this.cachedData = null;
    this.currentFilterConfig = undefined;
  }

  getRawData() {
    return TRIP_DATA;
  }
} 