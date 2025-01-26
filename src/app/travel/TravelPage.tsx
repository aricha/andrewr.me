'use client'

import TravelIntro from '@/components/travels/TravelIntro';
import TravelSummary from '@/components/travels/TravelSummary';
import TravelStories from '@/components/travels/TravelStories';
import { TravelDataProvider } from '@/components/travels/TravelDataProvider';
import { Layout } from '@/components/layout/Layout';
import { useRef, useEffect, useState } from 'react';
import type { TravelData } from '@/components/travels/TravelDataProvider';
import { TravelStory } from '@/types/travel';

interface TravelPageProps {
  initialStories: TravelStory[];
}

export default function TravelPage({ initialStories }: TravelPageProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [travelData, setTravelData] = useState<TravelData | null>(null);
  const dataProvider = TravelDataProvider.getInstance();

  useEffect(() => {
    const loadData = async () => {
      const { data } = await dataProvider.loadTravelData();
      setTravelData(data);
    };
    loadData();
  }, []);

  return (
    <Layout scrollContainer={scrollContainerRef} navBarMaxWidth="wide">
      <div className="flex flex-col min-h-screen">
        <div
          ref={scrollContainerRef}
          className="flex-grow h-screen overflow-y-auto snap-y"
        >
          <TravelIntro />
          {travelData && (
            <TravelSummary travelData={travelData}/>
          )}
          <TravelStories stories={initialStories} />
        </div>
      </div>
    </Layout>
  );
} 