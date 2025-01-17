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

interface ParsedTripData {
  name: string;
  startDate: number;
  endDate: number;
  totalKm: number;
  routeCoordinates: Array<[number, number]>; // [lat, lon] pairs for route
  stops: TripStep[]; // Major stops/waypoints
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export class PolarstepsParser {
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
      routeCoordinates: [],
      stops: [],
      bounds: {
        north: -90,
        south: 90,
        east: -180,
        west: 180
      }
    };

    // Process location data into route coordinates
    const locations: Location[] = locationsJson.locations;
    
    // Update bounds and create route coordinates
    locations.forEach(loc => {
      tripData.routeCoordinates.push([loc.lat, loc.lon]);
      
      // Update bounding box
      tripData.bounds.north = Math.max(tripData.bounds.north, loc.lat);
      tripData.bounds.south = Math.min(tripData.bounds.south, loc.lat);
      tripData.bounds.east = Math.max(tripData.bounds.east, loc.lon);
      tripData.bounds.west = Math.min(tripData.bounds.west, loc.lon);
    });

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

  /**
   * Filter out redundant coordinates that are too close together
   * @param coordinates Array of [lat, lon] pairs
   * @param minDistance Minimum distance in degrees between points
   * @returns Filtered coordinate array
   */
  static simplifyRoute(coordinates: Array<[number, number]>, minDistance: number = 0.01): Array<[number, number]> {
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