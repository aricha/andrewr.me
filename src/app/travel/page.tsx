import { getAllTravels } from '@/lib/travels';
import TravelMap from '@/components/travels/TravelMap';
import TravelIntro from '@/components/travels/TravelIntro';
import TravelSummary from '@/components/travels/TravelSummary';

export default function Travel() {
  const travels = getAllTravels();
  
  return (
    <div style={{ scrollPaddingTop: 'var(--navbar-height)' }} className="flex flex-col min-h-screen">
      <div className="flex-grow h-screen overflow-y-auto snap-y snap-proximity relative">
        <TravelIntro />
        <TravelSummary 
          locations={travels.locations}
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