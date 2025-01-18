import { 
  Location, 
  FilterConfig, 
  RawLocationsData, 
  RawTripData,
  PolarstepsParser
} from './PolarstepsParser';

export type { Location } from './PolarstepsParser';

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
  isFlight: boolean;
  debugInfo?: {
    startTime: number;
    endTime: number;
    speedKmH?: number;
    distanceDegrees?: number;
  } | null;
}

export interface TravelData {
  name: string;
  startDate: number;
  endDate: number;
  totalKm: number;
  routeSegments: RouteSegment[];
  stops: Stop[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export class TravelDataProvider {
  private static instance: TravelDataProvider;
  private cachedData: TravelData | null = null;
  private currentFilterConfig: FilterConfig | undefined;
  private rawLocationsData: RawLocationsData | null = null;
  private rawTripData: RawTripData | null = null;

  private constructor() {}

  static getInstance(): TravelDataProvider {
    if (!TravelDataProvider.instance) {
      TravelDataProvider.instance = new TravelDataProvider();
    }
    return TravelDataProvider.instance;
  }

  private mergeLocationsData(files: RawLocationsData[]): RawLocationsData {
    return {
      locations: files.reduce((acc, file) => [...acc, ...(file.locations || [])], [] as Location[])
    };
  }

  private mergeTripData(files: RawTripData[]): RawTripData {
    return files.reduce((acc, file) => ({
      name: acc.name || file.name,
      start_date: Math.min(acc.start_date || Infinity, file.start_date),
      end_date: Math.max(acc.end_date || -Infinity, file.end_date),
      total_km: (acc.total_km || 0) + (file.total_km || 0),
      all_steps: [...(acc.all_steps || []), ...(file.all_steps || [])]
    }), {
      name: '',
      start_date: 0,
      end_date: 0,
      total_km: 0,
      all_steps: []
    });
  }

  async loadRawData(): Promise<void> {
    // Using require.context for loading JSON files
    const locationsContext = (require as any).context('@/assets/trip-data', false, /locations.*\.json$/);
    const locationsFiles = locationsContext.keys().map(locationsContext) as RawLocationsData[];
    const tripContext = (require as any).context('@/assets/trip-data', false, /trip.*\.json$/);
    const tripFiles = tripContext.keys().map(tripContext) as RawTripData[];

    this.rawLocationsData = this.mergeLocationsData(locationsFiles);
    this.rawTripData = this.mergeTripData(tripFiles);
  }

  async loadTravelData(
    filterConfig?: FilterConfig,
    simplificationThreshold: number = 0.01,
    includeDebugInfo: boolean = false
  ): Promise<TravelData> {
    // Load raw data if not already loaded
    if (!this.rawLocationsData || !this.rawTripData) {
      await this.loadRawData();
    }

    // If filter config hasn't changed and we have cached data, return it
    if (this.cachedData && 
        JSON.stringify(this.currentFilterConfig) === JSON.stringify(filterConfig)) {
      return this.cachedData;
    }

    // Parse the raw data
    const parsedData = PolarstepsParser.parse(
      this.rawLocationsData!,
      this.rawTripData!,
      includeDebugInfo, // Pass through debug flag
      filterConfig
    );

    // Simplify the route
    const simplifiedSegments = PolarstepsParser.simplifyRoute(
      parsedData.routeSegments,
      simplificationThreshold
    );

    // Transform into our cleaner TravelData format, preserving debug info
    const travelData: TravelData = {
      name: parsedData.name,
      startDate: parsedData.startDate,
      endDate: parsedData.endDate,
      totalKm: parsedData.totalKm,
      routeSegments: simplifiedSegments.map(segment => ({
        points: segment.points,
        isFlight: segment.isFlight,
        debugInfo: includeDebugInfo ? segment.debugInfo : undefined
      })),
      stops: parsedData.stops,
      bounds: parsedData.bounds
    };

    // Update cache and current filter config
    this.cachedData = travelData;
    this.currentFilterConfig = filterConfig;
    
    return travelData;
  }

  updateFilterConfig(
    filterConfig: FilterConfig, 
    includeDebugInfo: boolean = false
  ): Promise<TravelData> {
    // Clear cache and reload with new filter config
    this.clearCache();
    return this.loadTravelData(filterConfig, 0.01, includeDebugInfo);
  }

  clearCache() {
    this.cachedData = null;
    this.currentFilterConfig = undefined;
  }

  getRawData() {
    return {
      locationsData: this.rawLocationsData,
      tripData: this.rawTripData
    };
  }
} 