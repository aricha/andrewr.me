'use client'

import TravelIntro from '@/components/travels/TravelIntro';
import TravelSummary from '@/components/travels/TravelSummary';
import TravelStories from '@/components/travels/TravelStories';
import { Layout } from '@/components/layout/Layout';
import { useRef } from 'react';
import type { TravelData } from '@/components/travels/TravelDataProvider';
import { TravelStory } from '@/types/travel';

interface TravelClientProps {
  stories: TravelStory[];
  travelData: TravelData;
}

export function TravelClient({ stories, travelData }: TravelClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Layout scrollContainer={scrollContainerRef} navBarMaxWidth="wide">
      <div className="flex flex-col min-h-screen">
        <div
          ref={scrollContainerRef}
          className="flex-grow h-screen overflow-y-auto snap-y"
        >
          <TravelIntro />
          <TravelSummary travelData={travelData} />
          <TravelStories stories={stories} />
        </div>
      </div>
    </Layout>
  );
} 