'use client'

import Link from 'next/link'
import { LucideIcon, ArrowRight, Laptop, Plane } from 'lucide-react'
import React, { useState, useEffect } from 'react';
import Image from 'next/image'

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
      <div className="w-fit mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-6 lg:px-8 py-16">
        <Card className="w-fit h-fit row-span-2">
          <div className="max-w-md relative">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl mb-4">
              <Image
                  src="/images/profile.jpg"
                  alt="Andrew Richardson"
                  fill
                  className="object-cover"
                  priority
                />
            </div>

            <h3 className="text-lg text-zinc-700 dark:text-zinc-300">👋, you've reached the home of</h3>
            <h1 className="text-4xl font-bold mb-4">Andrew Richardson</h1>

            <p className="text-xl text-zinc-700 dark:text-zinc-200 mb-8">
              I'm a software engineer and travel addict from Vancouver, Canada, currently based in Seattle.
              I love to build cool things and see the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink href="/work" icon={Laptop}>Work</NavLink>
              <NavLink href="/travel" icon={Plane}>Travel</NavLink>
            </div>
          </div>
        </Card>
        <div className="grid grid-rows-2 gap-4">
          <Card className="h-fit max-w-md">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl mb-4">
              <Image
                  src="/images/vision-pro-privacy.png"
                  alt="Work"
                  fill
                  className="object-cover"
                />
            </div>
            <NavLink href="/work" icon={Laptop}>Work</NavLink>
          </Card>
          <Card className="h-fit max-w-md">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl mb-4">
              <Image
                  src="/images/home-background.jpg"
                  alt="Travel"
                  fill
                  className="object-cover"
                />
            </div>
            <NavLink href="/travel" icon={Plane}>Travel</NavLink>
          </Card>
        </div>
      </div>
    </>
  )
}

function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`p-4 rounded-3xl bg-zinc-50/50 dark:bg-zinc-950/40 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  )
}

function NavLink({ 
  href, icon: Icon, children 
}: { 
  href: string, icon: LucideIcon, children: React.ReactNode 
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center px-6 py-3 text-2xl font-bold rounded-md text-zinc-700 dark:text-zinc-200`}
    >
      <Icon className={`mr-2 h-8 w-8`} />
      {children}
    </Link>
  )
}