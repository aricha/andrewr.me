'use client'

import TravelMap from './TravelMap';
import { Card } from '../Card';
import { TravelData } from './TravelDataProvider';
import { Animations } from '@/lib/animations';
import { motion } from 'framer-motion';
import { StickyBackground } from '../layout/StickyBackground';
import BackgroundImage from '@/assets/travel/summary-bg.jpg';

interface TravelSummaryProps {
  travelData: TravelData;
  stats: {
    kilometers: number;
    countries: number;
    photos: number;
    days: number;
    cheapestMeal: number;
    continents: number;
    languages: number;
    things: number;
    steps: number;
  };
}

export default function TravelSummary({
  travelData,
  stats
}: TravelSummaryProps) {
  return (
    <section className="snap-start relative w-full min-h-screen content-center">
      <StickyBackground 
        image={BackgroundImage} 
        hasBlur={false}
      />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={Animations.appearVariants}
        className='page-max-width-wide pb-8 relative z-10 pt-[calc(var(--navbar-height)+1rem)]'
      >
        <h1
          className="text-4xl font-bold text-white mb-8"
          style={{ textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)' }}
        >
          In a Nutshell
        </h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-2/3 bg-gray-900 rounded-2xl overflow-hidden flex">
            <div className="flex-1">
              <TravelMap
                travelData={travelData}
              />
            </div>
          </div>

          <Card className="md:w-1/3 rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
              <Stat value={stats.kilometers.toLocaleString()} label="Kilometers" />
              <Stat value={stats.countries} label="Countries" />
              <Stat value={stats.photos.toLocaleString()} label="Photos" />
              <Stat value={stats.days} label="Days" />
              <Stat value={`$${stats.cheapestMeal}`} label="Cheapest Meal" />
              <Stat value={stats.continents} label="Continents" />
              <Stat value={stats.languages} label="Languages" />
              <Stat value={stats.things} label="Things" />
              <Stat value={`${stats.steps}m`} label="Steps" />
            </div>
          </Card>
        </div>
      </motion.div>
    </section>
  );
}

function Stat({ value, label }: { value: string | number, label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-md text-zinc-300">{label}</div>
    </div>
  );
}