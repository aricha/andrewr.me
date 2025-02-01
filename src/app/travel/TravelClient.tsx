'use client'

import TravelIntro from '@/components/travels/TravelIntro';
import TravelSummary from '@/components/travels/TravelSummary';
import TravelStories from '@/components/travels/TravelStories';
import { Layout } from '@/components/layout/Layout';
import type { TravelData } from '@/components/travels/TravelDataProvider';
import { TravelStory } from '@/types/travel';

interface TravelClientProps {
  stories: TravelStory[];
  travelData: TravelData;
}

export function TravelClient({ stories, travelData }: TravelClientProps) {
  return (
    <Layout navBarMaxWidth="wide">
      <TravelIntro />
      <TravelSummary travelData={travelData} />
      <TravelStories stories={stories} />
    </Layout>
  );
} 