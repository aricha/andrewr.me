import Link from 'next/link';
import React from 'react';
import { PlayIcon } from 'lucide-react';
import { ProjectEntry } from './ProjectEntry';
import { WorkExperience } from './WorkExperience';

import AppleVisionIcon from '@/assets/work/vision-pro-icon.svg'
import { CldImage } from 'next-cloudinary';
import { Footer } from '../layout/Footer';

export default function VisionWorkExperience() {
  return (
    <WorkExperience
      id="apple-vision"
      company="Apple"
      role="visionOS UI Frameworks"
      period="2019 - 2024"
      Icon={AppleVisionIcon}
      backgroundImage="work/living-room-background"
      lazy={false}
      description="
        I had the opportunity to help build visionOS from the early days of Apple Vision Pro, 
        working with some amazing people to figure out how people should build apps in a 3D spatial environment. 
        I got to work on a lot of fun and very challenging projects, like figuring out how SwiftUI should become 
        a fully 3D-capable UI framework. It was a thrill to get to see the Vision Pro, one of Apple's most 
        innovative and ambitious new products in years, through to shipping!
        Below are some of the projects I worked on.
      ">
      <ProjectEntry
        title="WWDC23: Meet SwiftUI for spatial computing"
        description="
        I had the honor of presenting a headline talk for visionOS at WWDC23, “Meet SwiftUI for spatial computing”, that introduced the core design concepts for SwiftUI on visionOS and some of its new capabilities. Presenting a WWDC talk was a dream come true for me!
        ">
        <VisionWindow>
          <Link href="https://developer.apple.com/videos/play/wwdc2023/10109/" target="_blank" rel="noopener noreferrer">
            <div className="relative w-full aspect-video">
              <CldImage
                src="work/wwdc-talk"
                alt="WWDC23 Talk"
                fill
                priority
                className="rounded-lg object-cover"
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 38vw, 390px"
              />
              <div className='absolute z-1 inset-0 bg-black/20 rounded-lg'>
                <div className='absolute w-16 h-16 inset-0 bg-black/30 backdrop-blur-xl rounded-full flex justify-center items-center mx-auto my-auto'>
                  <PlayIcon fill='white' className='w-full h-full m-4' />
                </div>
              </div>
            </div>
          </Link>
        </VisionWindow>
      </ProjectEntry>

      <ProjectEntry
        title="Privacy-preserving hover effects"
        description={<>
          Privacy is a core tenet of the Vision Pro, and your gaze patterns are extremely sensitive – they can be used to tell all kinds of things about you. I was tasked with the challenge of figuring out how to display UI feedback when looking at elements of an app without revealing to the app where you’re looking. I helped design and architect the solution for this, known as “hover effects”, from the core system behavior up to the visual appearance and the public APIs, which also received <Link className='underline' href='https://patents.google.com/patent/US12131170B2/en' target='_blank' rel='noopener noreferrer'>a patent</Link>. This was featured in the announce keynote for the Vision Pro, which was a thrill for me!
        </>}
        orientation="right">
        <VisionWindow orientation="right">
          <iframe
            className="w-full aspect-video rounded-lg"
            src="https://www.youtube.com/embed/GYkq9Rgoj8E?si=yC5JPZIv1mZ3VgfF&clip=Ugkxi91CdonqnXXC93VcFUzw-if7WMM5vZ7_&clipt=EJOntQMYlIS4Aw&autoplay=1&controls=0&loop=1&mute=1&playsinline=1&rel=0&showinfo=0"
            title="Privacy-preserving hover effects"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </VisionWindow>
      </ProjectEntry>

      <Footer />
    </WorkExperience>
  )
}

interface VisionWindowProps {
  orientation?: 'left' | 'right';
  children: React.ReactNode;
}

function VisionWindow({
  orientation = 'left',
  children,
}: VisionWindowProps) {
  return (
    <div style={{ perspective: '500px', perspectiveOrigin: orientation }} className="flex-grow w-full max-w-md mx-auto sm:mx-0">
      <div className={`${orientation == 'left' ? 'sm:[transform:rotateY(8deg)]' : 'sm:[transform:rotateY(-8deg)]'} orientation-${orientation}`}>
        <div className="my-4 p-[2.5%] bg-black/30 backdrop-blur-xl rounded-lg">
          {children}
        </div>
        <div className='w-fit mx-auto flex flex-row gap-2'>
          <div style={{ scale: '1.4' }} className="w-1 h-1 bg-white/30 backdrop-blur-md rounded-full"></div>
          <div className="w-14 h-1 bg-white/30 backdrop-blur-md rounded-full"></div>
        </div>
      </div>
    </div>
  )
}