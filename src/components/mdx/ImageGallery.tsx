'use client'

import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageAssetKey } from '@/types/image-asset';

interface ImageGalleryProps {
  images: ImageAssetKey[];
  alt?: string;
}

export function ImageGallery({ images, alt = '' }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="flex flex-wrap -mx-2 sm:mx-0 gap-2 sm:gap-4 my-8 not-prose justify-center items-center">
        {images.map((image, index) => (
          <div
            key={image}
            className="relative aspect-square cursor-pointer basis-[calc(33.333%-0.67rem)] flex-shrink-0"
            onClick={() => {
              setCurrentIndex(index);
              setIsFullscreen(true);
            }}
          >
            <CldImage
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              quality={50}
              loading="lazy"
              className="object-cover rounded-lg hover:opacity-90 transition-opacity"
              sizes="(max-width: 900px) 33vw, 275px"
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center not-prose"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 rounded-button"
            >
              <X size={24} />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-button z-10"
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <div className="relative w-full max-w-4xl aspect-square">
              <CldImage
                src={images[currentIndex]}
                alt={`${alt} ${currentIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-button z-10"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 