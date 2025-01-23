'use client'

import { motion } from 'framer-motion';
import { Animations } from '@/lib/animations';
import { StickyBackground } from '../layout/StickyBackground';
import Image, { StaticImageData } from 'next/image';
import BackgroundImage from '@/assets/travel/stories/stories-background.jpg';

import VietnamMotorbike from '@/assets/travel/stories/vietnam-motorbike.jpg';
import CaveCamping from '@/assets/travel/stories/cave-camping.jpg';
import Acatenango from '@/assets/travel/stories/acatenango.jpg';
import SailingColombia from '@/assets/travel/stories/sailing-colombia.jpg';
import Camino from '@/assets/travel/stories/camino.jpg';

interface Story {
  title: string;
  image: StaticImageData;
  description?: string;
  emoji: string;
}

const stories: Story[] = [
  {
    title: 'Motorbiking Vietnam',
    image: VietnamMotorbike,
    description: 'An absolutely wild adventure touring 5,600km all over the country, from south to north, over 10 weeks',
    emoji: '🏍️'
  },
  {
    title: 'Camping in a Cave',
    image: CaveCamping,
    emoji: '⛺'
  },
  {
    title: 'Summitting Acatenango',
    image: Acatenango,
    emoji: '🏔️'
  },
  {
    title: 'Sailing to Colombia',
    image: SailingColombia,
    emoji: '⛰️'
  },
  {
    title: 'Hiking the Camino',
    image: Camino,
    emoji: '🥾'
  }
];

export default function TravelStories() {
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
          Stories
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[250px]">
          {stories.map((story, index) => (
            <motion.div
              key={story.title}
              variants={Animations.appearVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative group cursor-pointer ${index === 0 ? 'row-span-2 col-span-2' : ''}`}
            >
              <div className="relative h-full rounded-2xl overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white">
                    {story.title} {story.emoji}
                  </h3>
                  {story.description && (
                    <p className="text-sm text-zinc-200 mt-1">
                      {story.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
} 