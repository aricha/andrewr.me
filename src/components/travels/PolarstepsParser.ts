// Types for the parsed data
interface Location {
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

// Add new types for route segments
interface RouteSegment {
  coordinates: Array<[number, number]>;
  isFlight: boolean;
}

interface ParsedTripData {
  name: string;
  startDate: number;
  endDate: number;
  totalKm: number;
  routeSegments: RouteSegment[]; // Replace routeCoordinates with segments
  stops: TripStep[]; // Major stops/waypoints
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export class PolarstepsParser {
  // Constants for flight detection
  private static FLIGHT_DISTANCE_THRESHOLD = 0.5; // degrees (~55km)
  private static FLIGHT_SPEED_THRESHOLD = 100; // km/h

  /**
   * Parse Polarsteps JSON data into a format suitable for mapping
   * @param locationsJson Raw locations data from Polarsteps
   * @param tripJson Trip metadata and waypoints
   * @returns Processed trip data ready for visualization
   */
  static parse(locationsJson: any, tripJson: any): ParsedTripData {
    // Extract basic trip info
    const tripData: ParsedTripData = {
      name: tripJson.name,
      startDate: tripJson.start_date,
      endDate: tripJson.end_date,
      totalKm: tripJson.total_km,
      routeSegments: [], // Replace routeCoordinates
      stops: [],
      bounds: {
        north: -90,
        south: 90,
        east: -180,
        west: 180
      }
    };

    const locations: Location[] = locationsJson.locations;
    
    // Process locations into segments
    let currentSegment: RouteSegment = {
      coordinates: [],
      isFlight: false
    };
    
    for (let i = 0; i < locations.length; i++) {
      const current = locations[i];
      currentSegment.coordinates.push([current.lat, current.lon]);
      
      // Update bounds as before
      tripData.bounds.north = Math.max(tripData.bounds.north, current.lat);
      tripData.bounds.south = Math.min(tripData.bounds.south, current.lat);
      tripData.bounds.east = Math.max(tripData.bounds.east, current.lon);
      tripData.bounds.west = Math.min(tripData.bounds.west, current.lon);

      // Check if this is the last point or if we need to start a new segment
      if (i < locations.length - 1) {
        const next = locations[i + 1];
        const distance = this.calculateDistance(
          current.lat, current.lon,
          next.lat, next.lon
        );
        const timeGap = next.time - current.time;
        const speedKmH = (distance * 111) / (timeGap / 3600); // Convert to km/h
        console.log(`${JSON.stringify(locations[i])} to ${JSON.stringify(locations[i + 1])}: distance: ${distance}, speed: ${speedKmH}`);

        if (distance > this.FLIGHT_DISTANCE_THRESHOLD || speedKmH > this.FLIGHT_SPEED_THRESHOLD) {
          // End current segment
          tripData.routeSegments.push(currentSegment);
          
          // Create a flight segment with just the start and end points
          tripData.routeSegments.push({
            coordinates: [[current.lat, current.lon], [next.lat, next.lon]],
            isFlight: true
          });
          
          // Start new segment
          currentSegment = {
            coordinates: [],
            isFlight: false
          };
        }
      }
    }

    // Add the last segment
    if (currentSegment.coordinates.length > 0) {
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
      coordinates: this.simplifyCoordinates(segment.coordinates, minDistance),
      isFlight: segment.isFlight
    }));
  }

  private static simplifyCoordinates(coordinates: Array<[number, number]>, minDistance: number): Array<[number, number]> {
    if (coordinates.length <= 2) return coordinates;

    const filtered: Array<[number, number]> = [coordinates[0]];
    let lastPoint = coordinates[0];

    for (let i = 1; i < coordinates.length; i++) {
      const point = coordinates[i];
      const distance = Math.sqrt(
        Math.pow(point[0] - lastPoint[0], 2) + 
        Math.pow(point[1] - lastPoint[1], 2)
      );

      if (distance >= minDistance) {
        filtered.push(point);
        lastPoint = point;
      }
    }

    // Always include the last point
    if (filtered[filtered.length - 1] !== coordinates[coordinates.length - 1]) {
      filtered.push(coordinates[coordinates.length - 1]);
    }

    return filtered;
  }
}