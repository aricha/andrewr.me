import { Laptop, Plane } from 'lucide-react'
import React from 'react';
import Image from 'next/image'
import { Card, CardLink } from '@/components/Card'
import { SocialLinks } from '@/components/SocialLinks'
import { StickyBackground } from '@/components/layout/StickyBackground'

import WorkImage from '@/assets/home/wwdc-talk-zoom.png'
import TravelImage from '@/assets/home/travel.jpg'
import ProfileImage from '@/assets/home/profile.jpg'
import BackgroundImage from '@/assets/home/home-background-2.jpg'

export default function Home() {
  return (
    <>
      <StickyBackground image={BackgroundImage}/>
      <div className="min-h-screen px-2 sm:px-4 py-4 sm:py-8 flex items-center dark">
        <div className="grid grid-cols-2 gap-4 max-w-lg sm:max-w-4xl mx-auto">
          <Card className="col-span-2 sm:col-span-1 sm:h-auto flex flex-col items-center justify-center text-2xl">
            <div className="relative w-full aspect-[16/9] md:max-h-[236px] overflow-hidden rounded-t-3xl">
              <Image
                  src={ProfileImage}
                  alt="Andrew Richardson"
                  fill
                  className="object-cover"
                  priority
                />
            </div>
            <div className="p-4">
              <h3 className="text-lg text-zinc-700 dark:text-zinc-300">👋, you've reached the home of</h3>
              <h1 className="text-4xl font-bold mb-4 text-zinc-950 dark:text-zinc-100">Andrew Richardson</h1>
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
              imageSrc={WorkImage} imageAlt="Work"
            />
            <CardLink
              href="/travel" label="Travel" icon={Plane}
              imageSrc={TravelImage} imageAlt="Travel"
            />
          </div>
        </div>
      </div>
    </>
  )
}
