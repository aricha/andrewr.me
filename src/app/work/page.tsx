import { Smartphone, Wrench } from 'lucide-react'
import { WorkExperience } from '@/components/work/WorkExperience'
import AppleVisionIcon from '../../assets/vision-pro-icon.svg'
import HomeKitIcon from '../../assets/homekit-icon.svg'

export default function Work() {
  const experiences = [
    {
      company: 'Apple Inc.',
      role: 'visionOS UI Frameworks',
      period: '2019 - 2024',
      description: `
        As a lead engineer, I helped augment SwiftUI to a fully 3D UI framework,
        design privacy-preserving visual feedback just by looking at UI elements,
        and architect the tight-knit integration between SwiftUI and rich 3D content
        from RealityKit and Unity.
      `,
      Icon: AppleVisionIcon,
      projects: [
        {
          title: 'WWDC23 Talk',
          description: `
          I presented the headline talk introducing SwiftUI for visionOS, 
          "Meet SwiftUI for spatial computing", at WWDC23.
          `,
          imageSrc: '/images/wwdc-talk.jpg'
        },
        {
          title: 'Privacy-Preserving Hover Effects',
          description: `
          I designed the privacy-preserving system to provide visual feedback
          when looking at UI elements.
          `,
          imageSrc: '/images/vision-pro-privacy.png'
        },
        {
          title: 'Patents',
          description: 'Built a real-time collaboration system...',
          imageSrc: '/images/wwdc-talk.jpg'
        }
      ],
      backgroundImage: '/images/living-room-background-2.jpg'
    },
    {
      company: 'Apple Inc.',
      role: 'Home app',
      period: '2015 - 2019',
      description: `
      I helped build the Apple Home app from its 1.0 release up to features like
      HomeKit Secure Video and multi-user presence automations.
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
      company: 'Apple Inc.',
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
    <div className="flex flex-col min-h-screen mt-[-var(--navbar-height)]">
      <div className="flex-grow h-screen overflow-y-auto snap-y snap-mandatory">
        {experiences.map((experience) => (
          <WorkExperience 
            key={experience.company + experience.role} 
            {...experience} 
            className="h-screen min-h-[600px] relative snap-start"
          />
        ))}
      </div>
    </div>
  )
}