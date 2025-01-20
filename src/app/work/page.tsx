import { Smartphone, Wrench } from 'lucide-react'
import { WorkExperience } from '@/components/work/WorkExperience'
import AppleVisionIcon from '../../assets/vision-pro-icon.svg'
import HomeKitIcon from '../../assets/homekit-icon.svg'
import { VisionWorkExperience } from '@/components/work/VisionWorkExperience'

export default function Work() {
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
      projects: [
        // {
        //   title: 'WWDC23 Talk',
        //   description: `
        //   I presented the headline talk introducing SwiftUI for visionOS, 
        //   "Meet SwiftUI for spatial computing", at WWDC23.
        //   `,
        //   imageSrc: '/images/wwdc-talk.jpg'
        // },
        // {
        //   title: 'Privacy-Preserving Hover Effects',
        //   description: `
        //   I designed the privacy-preserving system to provide visual feedback
        //   when looking at UI elements.
        //   `,
        //   imageSrc: '/images/vision-pro-privacy.png'
        // },
        // {
        //   title: 'Patents',
        //   description: 'Built a real-time collaboration system...',
        //   imageSrc: '/images/wwdc-talk.jpg'
        // }
      ],
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
      I worked on the Home app team for almost 5 years, from the beginning of the first version of the app in iOS 10. I had the opportunity to work on many different parts of the app, from the core appearance to accessory controls, home cameras, and automations.
      `,
      Icon: HomeKitIcon,
      projects: [
        {
          title: 'HomeKit Secure Video',
          description: `
          Lead early work on the UI for recording secure video with HomeKit cameras.
          `,
          imageSrc: '/images/homekit_secure_video.jpg',
        },
        {
          title: 'Multi-User Presence Automations',
          description: `
          Designed and built the UI for automations that trigger when 
          people leave or arrive home.
          `,
          imageSrc: '/images/homekit-location-automation.png',
        }
      ],
      backgroundImage: '/images/living-room-background-2.jpg'
    },
    {
      company: 'Apple',
      role: 'iOS Apps & Frameworks Intern',
      period: '2013 - 2014',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      Icon: Smartphone,
      projects: [],
      backgroundImage: '/images/living-room-background.jpg'
    },
    {
      company: '',
      role: 'iOS Jailbreak Developer',
      period: '2011 - 2013',
      description: `
      I spent years reverse engineering the internals of iOS to build innovative tweaks
      for jailbroken iOS devices, including features that were later adopted by Apple.
      `,
      Icon: Wrench,
      projects: [
        {
          title: 'Abstergo',
          description: 'A tweak for iOS 6 that made it easy to manage notifications.',
          imageSrc: '/images/abstergo.jpg',
        },
        {
          title: 'Merge',
          description: 'A tweak for iOS 5-6 that merged conversations from different numbers for the same contact.',
          imageSrc: '/images/merge.png',
        },
        {
          title: 'Jukebox',
          description: 'A beautiful widget for easily controlling your music.',
          imageSrc: '/images/jukebox.jpg',
        }
      ],
      backgroundImage: '/images/living-room-background-2.jpg',
    },
  ]

  return (
    <div style={{ scrollPaddingTop: 'var(--navbar-height)' }} className="flex flex-col min-h-screen">
      <div className="flex-grow h-screen overflow-y-auto snap-y">
        {experiences.map((experience) => (
          <WorkExperience
            key={experience.company + experience.role}
            {...experience}
            className="min-h-screen relative snap-start"
          />
        ))}
      </div>
    </div>
  )
}