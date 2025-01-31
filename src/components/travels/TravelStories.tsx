'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { Animations } from '@/lib/animations';
import { PageBackground } from '../layout/PageBackground';
import StoryModal from './StoryModal';
import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { TravelStory } from '@/types/travel';
import { Footer } from '../layout/Footer';

interface TravelStoriesProps {
  stories: TravelStory[];
}

export default function TravelStories({ stories }: TravelStoriesProps) {
  const [selectedStory, setSelectedStory] = useState<TravelStory | null>(null);

  return (
    <section id="stories" className="snap-start relative w-full min-h-screen flex flex-col">
      <PageBackground
        image="travel/stories-background"
        hasBlur={false}
        lazy={true}
      />

      <div className="flex-1 flex items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={Animations.appearVariants}
          className='w-full page-max-width-wide pb-8 relative z-10 pt-[calc(var(--navbar-height)+1rem)]'
        >
          <h1
            className="text-4xl font-bold text-white mb-8"
            style={{ textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)' }}
          >
            Stories
          </h1>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 auto-rows-[100px] sm:auto-rows-[125px]">
            {stories.map((story, index) => (
              <motion.div
                key={story.title}
                variants={Animations.appearVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative group cursor-pointer ${story.prominent ? 'row-span-3 md:row-span-4 col-span-2' : 'row-span-2 col-span-2 min-[400px]:col-span-1'}`}
                onClick={() => setSelectedStory(story)}
                layoutId={`story-${story.title}`}
              >
                <div className="relative h-full rounded-2xl overflow-hidden">
                  <CldImage
                    src={story.image}
                    alt={story.title}
                    fill
                    loading='lazy'
                    className="object-cover transition-transform ease-out duration-500 group-hover:scale-105"
                    sizes={
                      story.prominent
                        ? "(max-width: 768px) 100vw, (max-width: 1024px) 66vw, (max-width: 1280px) 50vw, 640px"
                        : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 320px"
                    }
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
      </div>

      <AnimatePresence>
        {selectedStory && (
          <StoryModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
            layoutId={`story-${selectedStory.title}`}
          />
        )}
      </AnimatePresence>

      <Footer className="mt-auto pt-2 mb-3" />
    </section>
  );
} 