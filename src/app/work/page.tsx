'use client'

import { useRef } from 'react'
import { Layout } from '@/components/layout/Layout'

import HomeWorkExperience from '@/components/work/HomeWorkExperience'
import InternshipWorkExperience from '@/components/work/InternshipWorkExperience'
import JailbreakWorkExperience from '@/components/work/JailbreakWorkExperience'
import VisionWorkExperience from '@/components/work/VisionWorkExperience'

export default function Work() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <Layout scrollContainer={scrollContainerRef}>
      <div 
        style={{ scrollPaddingTop: 'var(--navbar-height)' }} 
        className="flex flex-col min-h-screen"
      >
        <div 
          ref={scrollContainerRef}
          className="flex-grow h-screen overflow-y-auto snap-y"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <VisionWorkExperience />
          <HomeWorkExperience />
          <InternshipWorkExperience />
          <JailbreakWorkExperience />
        </div>
      </div>
    </Layout>
  )
}