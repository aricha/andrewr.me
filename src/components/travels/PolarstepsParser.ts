export type TravelMode = 'ground' | 'flight' | 'train' | 'boat';

export interface TravelModeRange {
  startTime: number;
  endTime: number;
  mode: TravelMode;
}

export interface Location {
  lat: number;
  lon: number;
  time: number;
}

interface TripStep {
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

interface RouteSegment {
  points: Location[];
  mode: TravelMode;
  debugInfo?: {
    startTime: number;
    endTime: number;
    speedKmH?: number;
    distanceDegrees?: number;
  } | null;
}

interface ParsedTripData {
  name: string;
  startDate: number;
  endDate: number;
  totalKm: number;
  routeSegments: RouteSegment[];
  stops: TripStep[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface FilterConfig {
  excludedPoints: Location[];
  travelModes: TravelModeRange[];
  insertedPoints: { [tripName: string]: Location[] };
}

export const emptyFilterConfig: FilterConfig = {
  excludedPoints: [],
  travelModes: [],
  insertedPoints: {}
};

export interface RawLocationsData {
  locations: Location[];
}

export interface RawTripStep {
  name: string;
  display_name: string;
  start_time: number;
  location: {
    lat: number;
    lon: number;
    name: string;
    detail: string;
  };
}

export interface RawTripData {
  name: string;
  start_date: number;
  end_date: number;
  total_km: number;
  all_steps: RawTripStep[];
}

export class PolarstepsParser {
  // Constants for flight detection
  private static FLIGHT_DISTANCE_THRESHOLD = 0.5; // degrees (~110km)
  private static FLIGHT_SPEED_THRESHOLD = 100; // km/h

  /**
   * Parse Polarsteps JSON data into a format suitable for mapping
   * @param locationsJson Raw locations data from Polarsteps
   * @param tripJson Trip metadata and waypoints
   * @param includeDebugInfo Whether to include debug information in the output
   * @param filterConfig Optional configuration for filtering out problematic points
   * @returns Processed trip data ready for visualization
   */
  static parse(
    locationsJson: any,
    tripJson: any,
    tripName: string,
    includeDebugInfo: boolean = false,
    filterConfig?: FilterConfig
  ): ParsedTripData {
    // Filter out excluded points if filterConfig is provided
    let locations: Location[] = [...locationsJson.locations];

    if (filterConfig?.excludedPoints?.length) {
      locations = locations.filter(loc =>
        !filterConfig.excludedPoints.some(excluded =>
          // Use approximate matching for coordinates and ignore timestamp
          Math.abs(excluded.lat - loc.lat) < 0.0000001 &&
          Math.abs(excluded.lon - loc.lon) < 0.0000001
        )
      );
    }

    const insertedPoints = filterConfig?.insertedPoints[tripName];
    if (insertedPoints?.length) {
      locations = [...locations, ...insertedPoints];
    }
    
    // Sort locations by timestamp before processing
    locations.sort((a, b) => a.time - b.time);

    // Extract basic trip info
    const tripData: ParsedTripData = {
      name: tripJson.name,
      startDate: tripJson.start_date,
      endDate: tripJson.end_date,
      totalKm: tripJson.total_km,
      routeSegments: [],
      stops: [],
      bounds: {
        north: -90,
        south: 90,
        east: -180,
        west: 180
      }
    };

    // Process locations into segments
    let currentSegment: RouteSegment = {
      points: [],
      mode: 'ground',
      ...(includeDebugInfo && {
        debugInfo: {
          startTime: locations[0].time,
          endTime: locations[0].time,
          speedKmH: 0,
          distanceDegrees: 0
        }
      })
    };

    let cumulativeDistance = 0;  // Track total distance in current segment
    let startTime = locations[0].time;

    // Apply travel mode overrides before processing segments
    const determineSegmentMode = (
      startTime: number, endTime: number, implicitMode: TravelMode
    ): TravelMode => {
      if (!filterConfig?.travelModes) return implicitMode;

      const override = filterConfig.travelModes.find(range =>
        range.startTime <= startTime && range.endTime >= endTime
      );

      return override?.mode || implicitMode;
    };

    for (let i = 0; i < locations.length; i++) {
      const current = locations[i];
      currentSegment.points.push({
        lat: current.lat,
        lon: current.lon,
        time: current.time
      });

      // Update debug info for current segment if enabled
      if (includeDebugInfo && currentSegment.debugInfo) {
        currentSegment.debugInfo.endTime = current.time;
      }

      if (i < locations.length - 1) {
        const next = locations[i + 1];
        const distance = this.calculateDistance(
          current.lat, current.lon,
          next.lat, next.lon
        );
        const timeGap = next.time - current.time;

        // Update cumulative distance for current segment
        cumulativeDistance += distance;

        // Calculate average speed for entire segment
        const totalTime = (next.time - startTime) / 3600; // hours
        const averageSpeedKmH = (cumulativeDistance * 111) / totalTime;

        // For flight detection, still use point-to-point values
        const pointToPointSpeedKmH = (distance * 111) / (timeGap / 3600);

        // First check for manual override
        const implicitMode = (
          distance > this.FLIGHT_DISTANCE_THRESHOLD &&
            pointToPointSpeedKmH > this.FLIGHT_SPEED_THRESHOLD ?
            'flight' : 'ground'
        );
        const segmentMode = determineSegmentMode(current.time, next.time, implicitMode);

        if (currentSegment.mode === segmentMode) {
          // Update debug info with cumulative calculations if enabled
          if (includeDebugInfo && currentSegment.debugInfo) {
            currentSegment.debugInfo.speedKmH = averageSpeedKmH;
            currentSegment.debugInfo.distanceDegrees = cumulativeDistance;
          }
        } else {
          // End current segment
          if (currentSegment.mode === 'flight') {
            const ps = currentSegment.points;
            currentSegment.points = ps.length > 1 ? [ps[0], ps[ps.length - 1]] : [ps[0]];
          }
          tripData.routeSegments.push(currentSegment);

          // Start new segment
          currentSegment = {
            points: [current, next],
            mode: segmentMode,
            ...(includeDebugInfo && {
              debugInfo: {
                startTime: current.time,
                endTime: next.time,
                speedKmH: pointToPointSpeedKmH,
                distanceDegrees: distance
              }
            })
          };
          cumulativeDistance = 0;  // Reset cumulative distance for new segment
          startTime = next.time;
        }
      }

      // Update bounds as before
      tripData.bounds.north = Math.max(tripData.bounds.north, current.lat);
      tripData.bounds.south = Math.min(tripData.bounds.south, current.lat);
      tripData.bounds.east = Math.max(tripData.bounds.east, current.lon);
      tripData.bounds.west = Math.min(tripData.bounds.west, current.lon);
    }

    // Add the last segment
    if (currentSegment.points.length > 0) {
      tripData.routeSegments.push(currentSegment);
    }

    // Process stops/waypoints
    tripData.stops = tripJson.all_steps.map((step: any) => ({
      name: step.name || step.display_name,
      displayName: step.display_name || step.name,
      startTime: step.start_time,
      location: {
        lat: step.location.lat,
        lon: step.location.lon,
        name: step.location.name,
        detail: step.location.detail
      }
    }));

    return tripData;
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Simple Euclidean distance in degrees
    return Math.sqrt(
      Math.pow(lat2 - lat1, 2) +
      Math.pow(lon2 - lon1, 2)
    );
  }

  /**
   * Filter out redundant coordinates that are too close together
   * @param segments Array of route segments
   * @param minDistance Minimum distance in degrees between points
   * @returns Filtered segment array
   */
  static simplifyRoute(segments: RouteSegment[], minDistance: number = 0.01): RouteSegment[] {
    return segments.map(segment => ({
      points: this.simplifyPoints(segment.points, minDistance),
      mode: segment.mode,
      debugInfo: segment.debugInfo
    }));
  }

  private static simplifyPoints(points: Location[], minDistance: number): Location[] {
    if (points.length <= 2) return points;

    const filtered: Location[] = [points[0]];
    let lastPoint = points[0];

    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      const distance = Math.sqrt(
        Math.pow(point.lat - lastPoint.lat, 2) +
        Math.pow(point.lon - lastPoint.lon, 2)
      );

      if (distance >= minDistance) {
        filtered.push(point);
        lastPoint = point;
      }
    }

    // Always include the last point
    if (filtered[filtered.length - 1] !== points[points.length - 1]) {
      filtered.push(points[points.length - 1]);
    }

    return filtered;
  }
}