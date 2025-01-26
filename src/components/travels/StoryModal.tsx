'use client'

import { motion, AnimatePresence } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import { Story } from './TravelStories';
import { ArrowRightIcon, XIcon } from 'lucide-react';
import { ArrowLeftIcon } from 'lucide-react';
import { CldImage } from 'next-cloudinary';

interface StoryModalProps {
  story: Story;
  onClose: () => void;
  layoutId: string;
}

export default function StoryModal({ story, onClose, layoutId }: StoryModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = story.photos || [story.image];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

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
        className="relative w-fit h-full max-w-[900px] max-h-[900px] bg-zinc-900 rounded-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-square h-[60%]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentPhotoIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <CldImage
                src={photos[currentPhotoIndex]}
                alt={`${story.title} photo ${currentPhotoIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1400px) 100vw, 1400px"
              />
            </motion.div>
          </AnimatePresence>

          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
              >
                <ArrowRightIcon className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`w-2 h-2 rounded-full ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 bg-black/50 hover:bg-black/70 text-white"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        <div className="flex-1 max-w-prose min-h-[40%] flex flex-col">
          <div className="flex-none px-6 pt-4 pb-2">
            <h2 className="text-2xl font-bold text-white">
              {story.title}
            </h2>
          </div>

          <div className="flex-1 px-6 pb-6">
            <div className="prose prose-invert max-w-none whitespace-pre-line">
              {story.fullDescription || story.description}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 