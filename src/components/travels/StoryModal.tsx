'use client'

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { TravelStory } from '@/types/travel';

interface StoryModalProps {
  story: TravelStory;
  onClose: () => void;
  layoutId: string;
}

export default function StoryModal({ story, onClose, layoutId }: StoryModalProps) {
  const StoryContent = require(`@/content/travel/${story.slug}.mdx`).default;

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
        className="relative w-fit h-full max-w-[900px] max-h-[900px] bg-zinc-900/60 backdrop-blur-lg rounded-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-button"
        >
          <X size={24} />
        </button>

        <div className="overflow-y-auto">
          <div className="relative h-[60vh] min-h-96 flex-none">
            <CldImage
              src={story.image}
              alt={story.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-6">
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
          <div className="p-6 prose prose-invert prose-stone max-w-none flex-1">
            <StoryContent />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 