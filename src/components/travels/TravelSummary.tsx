'use client'

import { useEffect, useState } from 'react';
import TravelMap from './TravelMap';
import { Card } from '../Card';
import { TravelData } from './TravelDataProvider';
import { Animations } from '@/lib/animations';
import { motion } from 'framer-motion';
import { PageBackground } from '../layout/PageBackground';
import { loadFlag } from '@/lib/flags';
import type { SVGProps } from 'react';

interface TravelSummaryProps {
  travelData: TravelData;
}

export default function TravelSummary({
  travelData,
}: TravelSummaryProps) {
  return (
    <section className="snap-start relative w-full min-h-screen content-center">
      <PageBackground
        image="travel/summary-bg"
        hasBlur={false}
        lazy={true}
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

          <StatsCard stats={travelData.stats} countries={travelData.countries} />
        </div>
      </motion.div>
    </section>
  );
}

function StatsCard({ stats, countries }: { 
  stats: { [key: string]: number | string }, 
  countries: { [code: string]: string }
 }) {
  type FlagComponent = React.ComponentType<SVGProps<SVGSVGElement>>;
  const [flags, setFlags] = useState<Record<string, FlagComponent>>({});

  useEffect(() => {
    const loadFlags = async () => {
      const loadedFlags: Record<string, FlagComponent> = {};
      await Promise.all(
        Object.keys(countries).map(async (code) => {
          loadedFlags[code] = await loadFlag(code);
        })
      );
      setFlags(loadedFlags);
    };
    loadFlags();
  }, [countries]);

  return (
    <Card className="md:w-1/3 rounded-2xl p-4 sm:p-6" style={{ minWidth: 'calc(min(22rem, 100vw - 2rem))' }}>
      <div className="max-w-[34rem] mx-auto items-center">
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <Stat key={key} value={value} label={key} />
          ))}
        </div>
        <div className="pt-6">
          <h2 className="text-xl font-semibold text-zinc-50 mb-2">Countries Visited</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(3.5rem,1fr))] gap-2 [&>*]:w-[3.5rem]">
            {Object.entries(countries).map(([code, name]) => {
              const Flag = flags[code];
              return Flag ? <Flag key={code} aria-label={name} /> : null;
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (Math.round(num / 10000) / 100).toFixed(1) + 'm';
  } else if (num >= 100000) {
    return (Math.round(num / 100) / 10).toFixed(1) + 'k';
  }
  return Math.round(num).toLocaleString();
}

function Stat({ value, label }: { value: number | string, label: string }) {
  return (
    <div className="flex flex-col text-center items-center">
      <div className="text-3xl font-bold text-white">{typeof value === 'number' ? formatNumber(value) : value}</div>
      <div className="text-md text-zinc-300">{label}</div>
    </div>
  );
}