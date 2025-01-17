import { getAllTravels } from '@/lib/travels';
import TravelIntro from '@/components/travels/TravelIntro';
import TravelSummary from '@/components/travels/TravelSummary';
import { PolarstepsParser } from '@/components/travels/PolarstepsParser';
import tripData from '@/assets/trip.json';
import locationsData from '@/assets/locations.json';

export default function Travel() {
  return (
    <div style={{ scrollPaddingTop: 'var(--navbar-height)' }} className="flex flex-col min-h-screen">
      <div className="flex-grow h-screen overflow-y-auto snap-y snap-proximity relative">
        <TravelIntro />
        <TravelSummary 
          locations={locationsData}
          tripData={tripData}
          stats={{
            kilometers: 13820,
            countries: 13,
            photos: 37028,
            days: 312,
            cheapestMeal: 0.32,
            continents: 4,
            languages: 7,
            things: 68,
            steps: 14.2,
          }}
        />
      </div>
    </div>
  );
}