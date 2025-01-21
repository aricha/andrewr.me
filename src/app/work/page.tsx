'use client'
import { Smartphone, Wrench } from 'lucide-react'
import { WorkExperience } from '@/components/work/WorkExperience'
import { VisionWorkExperience } from '@/components/work/VisionWorkExperience'
import { useRef } from 'react'
import { Layout } from '@/components/layout/Layout'
import { ProjectEntry } from '@/components/work/ProjectEntry'
import { HomeWorkExperience } from '@/components/work/HomeWorkExperience'
import { PhonePocketImage } from '@/components/work/PhonePocketImage'

import AppleVisionIcon from '@/assets/vision-pro-icon.svg'
import HomeKitIcon from '@/assets/homekit-icon.svg'
import settingsSearch from '@/assets/settings-search.png'
import calculatorPhone from '@/assets/calculator.png'
import abstergoImage from '@/assets/abstergo.png'
import mergeImage from '@/assets/merge.png'
import jukeboxImage from '@/assets/jukebox.png'

export default function Work() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const experiences = [
    {
      company: 'Apple',
      role: 'visionOS UI Frameworks',
      period: '2019 - 2024',
      description: `
        I had the opportunity to help build visionOS from the early days of Apple Vision Pro, 
        working with some amazing people to figure out how people should build apps in a 3D spatial environment. 
        I got to work on a lot of fun and very challenging projects, like figuring out how SwiftUI should become 
        a fully 3D-capable UI framework. It was a thrill to get to see the Vision Pro, one of Apple's most 
        innovative and ambitious new products in years, through to shipping!
        Below are some of the projects I worked on.
      `,
      Icon: AppleVisionIcon,
      projects: [],
      backgroundImage: '/images/living-room-background-2.jpg',
      customContent: (
        <VisionWorkExperience />
      ),
    },
    {
      company: 'Apple',
      role: 'Home app',
      period: '2015 - 2019',
      description: `
      I worked on the Home app team for almost 5 years, from the beginning of the first version of the app in iOS 10. I had the opportunity to work on many different parts of the app, from the core appearance to accessory controls, home cameras, automations, and HomePod support. Here are some of the key projects I contributed to:
      `,
      Icon: HomeKitIcon,
      projects: [],
      backgroundImage: '/images/living-room-background-2.jpg',
      customContent: (
        <HomeWorkExperience />
      ),
    },
    {
      company: 'Apple',
      role: 'iOS Apps & Frameworks Intern',
      period: '2013 - 2014',
      description: `
      I first joined Apple as an intern in 2013 on the iOS Apps & Frameworks team, where I was able to help fix a variety of bugs for the release of iOS 7. Across my two internships in 2013 and 2014, I was able to work on a number of different projects and prototypes and demo them to senior leadership. Here are two of them that wound up shipping:
      `,
      Icon: Smartphone,
      projects: [],
      backgroundImage: '/images/living-room-background.jpg',
      customContent: (
        <>
        <ProjectEntry
          title="Search in Settings"
          description="
          I built the first version of the search feature in the Settings app on iOS, which later shipped in iOS 9. This meant building both the UI and the search index across all settings, which required building new APIs and sprawling adoption across hundreds of settings pages.
          ">
            <PhonePocketImage src={settingsSearch} alt="Settings" />
          </ProjectEntry>
          <ProjectEntry
            title="Interactive Calculator"
            description="
            I rewrote large parts of the Calculator app in Swift, making it one of the first Apple apps using the language in iOS 9. I also built a new design that supported visualizing and editing expressions, and viewing a calculation history. While these did not ship in iOS 9, they did eventually get resurrected with the Calculator redesign in iOS 18!
            "
            orientation="right"
            >
            <PhonePocketImage src={calculatorPhone} alt="Calculator" className="sm:-mb-9" />
          </ProjectEntry>
        </>
      ),
    },
    {
      company: '',
      role: 'iOS Jailbreak Developer',
      period: '2011 - 2013',
      description: `
      I got my start in iOS development while in university by getting involved in the iOS jailbreak community. I worked on building “tweaks”, or extensions that modified the OS itself, for jailbroken devices. I learned how to reverse engineer the internals of the OS, hook into the right functions, and use it to build cool tweaks. Some of these were eventually added as native iOS features by Apple!
      `,
      Icon: Wrench,
      projects: [],
      customContent: (
        <>
          <ProjectEntry
            title="Abstergo"
            description="
            Meaning “to clean away” in Latin, Abstergo provided tools for easily managing notifications for iOS 5-6. It added the ability to clear a single notification or all notifications with a swipe (before these existed natively), and a reminder system to postpone notifications until later.
            "
          >
            <PhonePocketImage src={abstergoImage} alt="Abstergo" />
          </ProjectEntry>
          <ProjectEntry
            title="Merge"
            description="
            Messages on iOS had a longstanding annoying behavior in iOS 5-6: conversations with different numbers or emails for the same contact were kept separate. This was especially bad when iMessage had a habit of changing which address you were messaging, causing conversations to fork off and get very confusing. Merge fixed that problem, automatically merging these conversations together in the UI, and providing an easy way to select which address your message would be sent to.
            "
            orientation="right"
          >
            <PhonePocketImage src={mergeImage} alt="Merge" />
          </ProjectEntry>
          <ProjectEntry
            title="Jukebox"
            description="
            Jukebox provided a beautiful music widget with rich controls built into Notification Center on iOS 5-6 (before widgets existed natively). It even integrated with other tweaks to support being used directly on the Home Screen.
            "
          >
            <PhonePocketImage src={jukeboxImage} alt="Jukebox" className="sm:-mb-9" />
          </ProjectEntry>
        </>
      ),
      backgroundImage: '/images/living-room-background-2.jpg',
    },
  ]

  return (
    <Layout scrollContainer={scrollContainerRef}>
      <div 
        style={{ scrollPaddingTop: 'var(--navbar-height)' }} 
        className="flex flex-col min-h-screen"
      >
        <div 
          ref={scrollContainerRef}
          className="flex-grow h-screen overflow-y-auto snap-y"
        >
          {experiences.map((experience) => (
            <WorkExperience
              key={experience.company + experience.role}
              {...experience}
              className="min-h-screen relative snap-start"
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}