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
  name: string;
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
}

export class TravelDataProvider {
  private static instance: TravelDataProvider;
  private cachedData: TravelData | null = null;
  private currentFilterConfig: FilterConfig | undefined;
  private rawLocationsData: RawLocationsData[] | null = null;
  private rawTripData: RawTripData[] | null = null;

  private constructor() {}

  static getInstance(): TravelDataProvider {
    if (!TravelDataProvider.instance) {
      TravelDataProvider.instance = new TravelDataProvider();
    }
    return TravelDataProvider.instance;
  }

  private mergeLocationsData(files: RawLocationsData[]): RawLocationsData[] {
    return files;
  }

  private mergeTripData(files: RawTripData[]): RawTripData[] {
    return files;
  }

  async loadRawData(): Promise<void> {
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
    if (!this.rawLocationsData || !this.rawTripData) {
      await this.loadRawData();
    }

    if (this.cachedData && 
        JSON.stringify(this.currentFilterConfig) === JSON.stringify(filterConfig)) {
      return this.cachedData;
    }

    const tripParts: TripPart[] = [];
    let globalBounds = {
      north: -90,
      south: 90,
      east: -180,
      west: 180
    };
    let totalKm = 0;
    let startDate = Infinity;
    let endDate = -Infinity;

    for (let i = 0; i < this.rawLocationsData!.length; i++) {
      const parsedData = PolarstepsParser.parse(
        this.rawLocationsData![i],
        this.rawTripData![i],
        includeDebugInfo,
        filterConfig
      );

      const simplifiedSegments = PolarstepsParser.simplifyRoute(
        parsedData.routeSegments,
        simplificationThreshold
      );

      tripParts.push({
        name: parsedData.name,
        routeSegments: simplifiedSegments.map(segment => ({
          points: segment.points,
          isFlight: segment.isFlight,
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

    const travelData: TravelData = {
      name: this.rawTripData![0].name,
      startDate,
      endDate,
      totalKm,
      tripParts,
      bounds: globalBounds
    };

    this.cachedData = travelData;
    this.currentFilterConfig = filterConfig;
    
    return travelData;
  }

  updateFilterConfig(
    filterConfig: FilterConfig, 
    includeDebugInfo: boolean = false
  ): Promise<TravelData> {
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