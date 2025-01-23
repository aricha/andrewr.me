'use client'
import TravelIntro from '@/components/travels/TravelIntro';
import TravelSummary from '@/components/travels/TravelSummary';
import { TravelDataProvider } from '@/components/travels/TravelDataProvider';
import { Layout } from '@/components/layout/Layout';
import { useRef, useEffect, useState } from 'react';
import type { TravelData } from '@/components/travels/TravelDataProvider';

export default function Travel() {
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
      <div
        className="flex flex-col min-h-screen"
      >
        <div
          ref={scrollContainerRef}
          className="flex-grow h-screen overflow-y-auto snap-y"
        >
          <TravelIntro />
          {travelData && (
            <TravelSummary
              travelData={travelData}
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
          )}
        </div>
      </div>
    </Layout>
  );
}