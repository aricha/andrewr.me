'use client'

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { TravelStory } from '@/types/travel';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { storyImports } from '@/content/travel/config';

interface StoryModalProps {
  story: TravelStory;
  onClose: () => void;
  layoutId: string;
}

export default function StoryModal({ story, onClose, layoutId }: StoryModalProps) {
  const StoryContent = dynamic(storyImports[story.slug], {
    loading: () => <LoadingContent />,
    ssr: false
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.75 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        layoutId={layoutId}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.75 }}
        className="relative w-full h-fit max-h-[100%] max-w-[900px] bg-zinc-950 rounded-2xl overflow-y-auto flex flex-col"
        style={{
          minHeight: 'calc(min(100vh, 1000px))',
          minWidth: 'calc(min(100vw, 400px))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-button"
        >
          <X size={24} />
        </button>

        <div className="overflow-y-auto">
          <div className="relative h-[60vh] min-h-96 max-h-[600px] flex-none">
            <CldImage
              src={story.image}
              alt={story.title}
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 900px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6">
              <h2 className="text-3xl font-bold text-white">
                {story.title}
              </h2>
              {story.description && (
                <p className="text-lg text-zinc-200 mt-1">
                  {story.description}
                </p>
              )}
            </div>
          </div>
          <div className="py-6 px-4 sm:px-8 prose prose-invert prose-stone max-w-none flex-1">
            <Suspense fallback={<LoadingContent />}>
              <StoryContent />
            </Suspense>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 

const LoadingContent = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
    <div className="h-4 bg-zinc-800 rounded w-full"></div>
    <div className="h-4 bg-zinc-800 rounded w-4/5"></div>
  </div>
);
