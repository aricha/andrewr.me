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
    description: 'An incredible adventure touring 5,600km all over the country, from south to north, over 10 weeks',
    fullDescription:
      `By the time I arrived in Vietnam in early April, I had long been dreaming of traveling the country with the ultimate freedom: by buying my own motorbike. I found a trusty Honda Wave to call my own in the city of Can Tho in the Mekong Delta, and proceeded to spend the next 10 weeks driving over 5,600km all through the country. I wandered my way through the huge variety of scenery Vietnam has to offer, from lush jungles to beautiful coastline to towering karst mountains. And I somehow survived driving through the organized chaos of cities like Ho Chi Minh City and through places that definitely do not qualify as roads in the countryside, without more than a scratch. (I still wore protective gear just in case.)

      Some of the highlights include:

      * Driving the Ho Chi Minh Road, a pristine and near-deserted winding road through the countryside from Khe Sanh to Phong Nha
      * Staying in a homestay in the jungle near the small town of Ben Tre, where we lived a day in the life of a traditional farmer: we learned how to climb coconut trees to harvest coconuts, fish in the Mekong Delta, and assemble our own freshly harvested meal
      * Exploring the far north of Vietnam – in my opinion the most beautiful part of the country – where I really got off the beaten path. In addition to driving the famous Ha Giang Loop with its jaw-dropping scenery, I explored lesser-known but equally beautiful places in the northwest around Sapa, in the northeast around Cao Bang, and closer to Hanoi in Ba Be Lake. I got within a stone’s throw of the Chinese border and visited fascinating places like the cave in which Ho Chi Minh hid for many years leading up to the war.
      * Experiencing the wonderful warmth and hospitality of so many Vietnamese, especially in the smaller towns off the tourist trail.
      * The food! Oh my god, the food. From the famous pho and banh mi to lesser-known dishes that I adored like banh xeo and bun cha, I absolutely adored the food I ate in Vietnam. It also remains the cheapest place I’ve ever eaten – I had hearty banh mis for as little as 9,000 VND, about $0.32 USD!

      Without a doubt these 10 weeks were the craziest, most thrilling times of my year of traveling. It was everything I dreamed it would be and more.`
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