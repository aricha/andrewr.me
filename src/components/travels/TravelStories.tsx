'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { Animations } from '@/lib/animations';
import { StickyBackground } from '../layout/StickyBackground';
import Image from 'next/image';
import StoryModal from './StoryModal';
import { useState } from 'react';
import { CldImage } from 'next-cloudinary';

export interface Story {
  title: string;
  image: string;
  photos?: string[];
  description?: string;
  fullDescription?: string;
  prominent?: boolean;
}

const stories: Story[] = [
  {
    title: 'Motorbiking Vietnam 🏍️',
    image: '/travel/stories/vietnam/motorbike.jpg',
    photos: [
      '/travel/stories/vietnam/motorbike.jpg',
      '/travel/stories/vietnam/motorbike.jpg',
      '/travel/stories/vietnam/motorbike.jpg'
    ],
    prominent: true,
    description: 'An absolutely wild adventure touring 5,600km all over the country, from south to north, over 10 weeks',
    fullDescription:
      `Over 10 incredible weeks, I embarked on a 5,600km journey through Vietnam on a trusty Honda Win motorbike. Starting from Ho Chi Minh City in the south, I made my way north to Hanoi, exploring everything in between.

      The journey took me through bustling cities, remote mountain passes, and stunning coastal roads. I navigated through the organized chaos of Vietnamese traffic, experienced the warmth of local hospitality in small villages, and discovered hidden gems off the tourist trail.

      Some highlights included:
      • Riding the legendary Hai Van Pass
      • Exploring the terraced rice fields of Sapa
      • Getting lost in the maze-like streets of Hanoi's Old Quarter
      • Cruising through the limestone karsts of Ha Giang
      • Sharing meals with locals in tiny roadside phở shops

      This adventure wasn't just about the destinations - it was about the journey itself, the people met along the way, and the countless unexpected moments that made it unforgettable.`
  },
  {
    title: 'Camping in a Cave ⛺',
    image: '/travel/stories/cave-camping.jpg'
  },
  {
    title: 'Summitting Acatenango 🏔️',
    image: '/travel/stories/acatenango.jpg'
  },
  {
    title: 'Sailing to Colombia ⛰️',
    image: '/travel/stories/sailing-colombia.jpg'
  },
  {
    title: 'Hiking the Camino 🥾',
    image: '/travel/stories/camino.jpg'
  }
];

export default function TravelStories() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <section className="snap-start relative w-full min-h-screen content-center">
      <StickyBackground
        image="/travel/stories/stories-background.jpg"
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
              className={`relative group cursor-pointer ${story.prominent ? 'row-span-2 col-span-2' : ''}`}
              onClick={() => setSelectedStory(story)}
              layoutId={`story-${story.title}`}
            >
              <div className="relative h-full rounded-2xl overflow-hidden">
                <CldImage
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white">
                    {story.title}
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

      <AnimatePresence>
        {selectedStory && (
          <StoryModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
            layoutId={`story-${selectedStory.title}`}
          />
        )}
      </AnimatePresence>
    </section>
  );
} 