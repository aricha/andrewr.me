#!/usr/bin/env python3

import json
import argparse
from datetime import datetime
import sys
import os
from operator import itemgetter

def process_locations(locations):
    """
    Sort locations by timestamp and remove duplicates.
    
    Args:
        locations (list): List of location dictionaries
    
    Returns:
        list: Sorted, deduplicated location list
    """
    # Sort by timestamp
    sorted_locations = sorted(locations, key=itemgetter('time'))
    
    # Remove duplicates (keeping first occurrence of each timestamp)
    seen_timestamps = set()
    unique_locations = []
    
    for loc in sorted_locations:
        if loc['time'] not in seen_timestamps:
            seen_timestamps.add(loc['time'])
            unique_locations.append(loc)
    
    return unique_locations

def create_line_segment(start_loc, end_loc):
    """
    Create a GeoJSON LineString feature between two points.
    
    Args:
        start_loc (dict): Starting location
        end_loc (dict): Ending location
    
    Returns:
        dict: GeoJSON Feature representing the line segment
    """
    return {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [start_loc['lon'], start_loc['lat']],
                [end_loc['lon'], end_loc['lat']]
            ]
        },
        "properties": {
            "start_time": start_loc['time'],
            "end_time": end_loc['time'],
            "start_datetime": datetime.fromtimestamp(start_loc['time']).isoformat(),
            "end_datetime": datetime.fromtimestamp(end_loc['time']).isoformat(),
            "duration_seconds": end_loc['time'] - start_loc['time']
        }
    }

def convert_to_geojson(input_file, output_file):
    """
    Convert Polarsteps JSON format to GeoJSON with points and connecting line segments.
    
    Args:
        input_file (str): Path to input JSON file
        output_file (str): Path to output GeoJSON file
    
    Returns:
        bool: True if conversion was successful, False otherwise
    """
    try:
        # Read the input JSON file
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Validate input data structure
        if 'locations' not in data:
            print(f"Error: Input file '{input_file}' does not contain 'locations' key")
            return False
        
        # Sort and deduplicate locations
        locations = process_locations(data['locations'])
        
        # Create GeoJSON structure
        geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        
        # Create point features and line segments
        for i, location in enumerate(locations):
            # Validate required fields
            required_fields = ['lon', 'lat', 'time']
            if not all(field in location for field in required_fields):
                print(f"Warning: Skipping location due to missing required fields: {location}")
                continue
            
            # Add point feature
            point_feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [location['lon'], location['lat']]
                },
                "properties": {
                    "timestamp": location['time'],
                    "datetime": datetime.fromtimestamp(location['time']).isoformat()
                }
            }
            
            # Add optional fields if they exist
            optional_fields = ['altitude', 'speed', 'accuracy']
            for field in optional_fields:
                if field in location:
                    point_feature['properties'][field] = location[field]
                    
            geojson['features'].append(point_feature)
            
            # Create line segment to next point if it exists
            if i < len(locations) - 1:
                next_location = locations[i + 1]
                line_segment = create_line_segment(location, next_location)
                geojson['features'].append(line_segment)
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        # Write the GeoJSON to a file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(geojson, f, indent=2)
            
        point_count = sum(1 for f in geojson['features'] if f['geometry']['type'] == 'Point')
        line_count = sum(1 for f in geojson['features'] if f['geometry']['type'] == 'LineString')
        print(f"Successfully converted {point_count} locations to GeoJSON")
        print(f"Created {point_count} points and {line_count} line segments")
        print(f"Output written to: {output_file}")
        return True
        
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in input file: {e}")
        return False
    except IOError as e:
        print(f"Error: File operation failed: {e}")
        return False
    except Exception as e:
        print(f"Error: Unexpected error occurred: {e}")
        return False

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(
        description='Convert Polarsteps JSON format to GeoJSON with points and connecting line segments'
    )
    parser.add_argument(
        'input_file',
        help='Path to input JSON file from Polarsteps'
    )
    parser.add_argument(
        'output_file',
        help='Path where the output GeoJSON file should be written'
    )
    
    # Parse arguments
    args = parser.parse_args()
    
    # Run conversion
    success = convert_to_geojson(args.input_file, args.output_file)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
