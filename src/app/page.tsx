import { getAllTravels } from '@/lib/travels';
import TravelMap from '@/components/travels/TravelMap';

export default function HomePage() {
  const travels = getAllTravels();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Travel Adventures</h1>
      <TravelMap locations={travels.locations} />
    </main>
  );
}