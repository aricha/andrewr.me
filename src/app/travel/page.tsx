import { getTravelStories } from '@/lib/mdx';
import { TravelClient } from './TravelClient';
import { TravelDataProvider } from '@/components/travels/TravelDataProvider';

// This ensures the page is statically generated at build time
export const dynamic = 'force-static';
export const revalidate = false;

export default async function TravelPage() {
  const stories = await getTravelStories();
  const dataProvider = TravelDataProvider.getInstance();
  const { data: travelData } = await dataProvider.loadTravelData();

  return <TravelClient stories={stories} travelData={travelData} />;
}