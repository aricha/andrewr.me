'use client'

import { Laptop, Plane } from 'lucide-react'
import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { Card, CardLink } from '@/components/Card'
import { SocialLinks } from '@/components/SocialLinks'

export default function Home() {
  // These would come from your CMS or configuration
  const imageConfig = {
    src: "/api/placeholder/1600/900",
    alt: "Travel photo",
    // Normalized coordinates (0-1) of where you appear in the image
    focusPoint: { x: 0.5, y: 0.7 }
  };

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine layout mode based on screen width
  const isMobile = windowSize.width < 768;

  // Calculate card position based on focus point and screen size
  const getCardPosition = () => {
    if (isMobile) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    // On desktop, position card on the opposite side of the focus point
    const isSubjectOnLeft = imageConfig.focusPoint.x <= 0.5;
    return {
      top: '50%',
      left: isSubjectOnLeft ? '20%' : '80%',
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <>
      <div className="fixed inset-0 z-0" style={{ 
        backgroundImage: 'url(/images/home-background-2.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
      }}></div>
      <div className="min-h-screen px-2 sm:px-4 py-4 sm:py-8 flex items-center">
        <div className="grid grid-cols-2 gap-4 max-w-lg sm:max-w-4xl mx-auto">
          <Card className="col-span-2 sm:col-span-1 sm:h-auto flex flex-col items-center justify-center text-2xl">
            <div className="relative w-full aspect-[16/9] md:max-h-[236px] overflow-hidden rounded-t-3xl">
              <Image
                  src="/images/profile.jpg"
                  alt="Andrew Richardson"
                  fill
                  className="object-cover"
                  priority
                />
            </div>
            <div className="p-4">
              <h3 className="text-lg text-zinc-700 dark:text-zinc-300">👋, you've reached the home of</h3>
              <h1 className="text-4xl font-bold mb-4">Andrew Richardson</h1>
              <p className="text-xl text-zinc-700 dark:text-zinc-200">
              I’m a software engineer and travel addict from Vancouver 🇨🇦, and currently based out of Seattle 🇺🇸. 
              I live to explore, try new things, and get out in nature. I’ve been lucky to spend 2024 on sabbatical traveling the world. 
              When I’m working, I love to build cool things and specialize in UI for  platforms.
              </p>
              <SocialLinks className="mt-4" />
            </div>
          </Card>
          <div className="col-span-2 xs sm:col-span-1 grid grid-cols-2 sm:grid-cols-1 gap-4 sm:h-full">
            <CardLink
              href="/work" label="Work" icon={Laptop}
              imageSrc="/images/wwdc-talk-zoom.png" imageAlt="Work"
            />
            <CardLink
              href="/travel" label="Travel" icon={Plane}
              imageSrc="/images/travel.jpg" imageAlt="Travel"
            />
          </div>
        </div>
      </div>
    </>
  )
}
