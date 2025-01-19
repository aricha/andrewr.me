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
}

export class TravelDataProvider {
  private static instance: TravelDataProvider;
  private cachedData: TravelData | null = null;
  private currentFilterConfig: FilterConfig | undefined;
  private rawLocationsData: { [tripName: string]: RawLocationsData } | null = null;
  private rawTripData: { [tripName: string]: RawTripData } | null = null;

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
            time: new Date(point.time).getTime(),
            lat: point.lat,
            lon: point.lon
          }))
        ])
      )
    };
  }

  async loadRawData(): Promise<void> {
    const locationsContext = (require as any).context('@/assets/trip-data', false, /locations.*\.json$/);
    const locationsFiles = Object.fromEntries(
      locationsContext.keys().map((key: string) => [
        key.replace(/^\.\/locations-(.*)\.json$/, '$1'),
        locationsContext(key)
      ])
    ) as { [key: string]: RawLocationsData };
    const tripContext = (require as any).context('@/assets/trip-data', false, /trip.*\.json$/);
    const tripFiles = Object.fromEntries(
      tripContext.keys().map((key: string) => [
        key.replace(/^\.\/trip-(.*)\.json$/, '$1'), 
        tripContext(key)
      ])
    ) as { [key: string]: RawTripData };

    this.rawLocationsData = locationsFiles;
    this.rawTripData = tripFiles;
  }

  async loadTravelData(
    simplificationThreshold: number = 0.01,
    includeDebugInfo: boolean = false
  ): Promise<{ data: TravelData, filterConfig: FilterConfig }> {
    if (!this.rawLocationsData || !this.rawTripData) {
      await this.loadRawData();
    }
    if (!this.currentFilterConfig) {
      this.currentFilterConfig = await this.loadFilterConfig();
    }

    if (this.cachedData) {
      return { data: this.cachedData, filterConfig: this.currentFilterConfig };
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

    for (const tripName in this.rawLocationsData) {
      const parsedData = PolarstepsParser.parse(
        this.rawLocationsData[tripName],
        this.rawTripData![tripName],
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

    const travelData: TravelData = {
      startDate,
      endDate,
      totalKm,
      tripParts,
      bounds: globalBounds
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
    return {
      locationsData: this.rawLocationsData,
      tripData: this.rawTripData
    };
  }
} 