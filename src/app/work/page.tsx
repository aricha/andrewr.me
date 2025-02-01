'use client'

import { Layout } from '@/components/layout/Layout'
import HomeWorkExperience from '@/components/work/HomeWorkExperience'
import InternshipWorkExperience from '@/components/work/InternshipWorkExperience'
import JailbreakWorkExperience from '@/components/work/JailbreakWorkExperience'
import VisionWorkExperience from '@/components/work/VisionWorkExperience'

export default function Work() {
  return (
    <Layout>
      <div style={{ scrollPaddingTop: 'var(--navbar-height)' }}>
        <VisionWorkExperience />
        <HomeWorkExperience />
        <InternshipWorkExperience />
        <JailbreakWorkExperience />
      </div>
    </Layout>
  )
}