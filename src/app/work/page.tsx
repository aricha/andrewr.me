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
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      Icon: AppleVisionIcon,
      projects: [
        {
          title: 'WWDC Talk',
          description: 'Built a real-time collaboration system...',
          imageSrc: '/images/wwdc-talk.jpg',
          tags: ['UIKit', 'WebSocket', 'Core Animation']
        },
        {
          title: 'Privacy-Preserving Hover Effects',
          description: 'Redesigned and implemented the core messaging experience...',
          imageSrc: '/images/vision-pro-privacy.png',
          tags: ['Swift', 'SwiftUI', 'Core Data']
        },
        {
          title: 'Patents',
          description: 'Built a real-time collaboration system...',
          imageSrc: '/images/wwdc-talk.jpg',
          tags: ['UIKit', 'WebSocket', 'Core Animation']
        }
      ]
    },
    {
      company: 'Apple Inc.',
      role: 'Home app',
      period: '2015 - 2019',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      Icon: HomeKitIcon,
      projects: [
        {
          title: 'Feature X',
          description: 'Redesigned and implemented the core messaging experience...',
          imageSrc: '/images/vision-pro-privacy.png',
          tags: ['Swift', 'SwiftUI', 'Core Data']
        },
        {
          title: 'Feature Y',
          description: 'Built a real-time collaboration system...',
          imageSrc: '/images/wwdc-talk.jpg',
          tags: ['UIKit', 'WebSocket', 'Core Animation']
        }
      ]
    },
    {
      company: 'Apple Inc.',
      role: 'iOS Apps & Frameworks Intern',
      period: '2013 - 2014',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      Icon: Smartphone,
      projects: [
        {
          title: 'Feature X',
          description: 'Redesigned and implemented the core messaging experience...',
          imageSrc: '/images/vision-pro-privacy.png',
          tags: ['Swift', 'SwiftUI', 'Core Data']
        },
        {
          title: 'Feature Y',
          description: 'Built a real-time collaboration system...',
          imageSrc: '/images/wwdc-talk.jpg',
          tags: ['UIKit', 'WebSocket', 'Core Animation']
        }
      ]
    },
    {
      company: '',
      role: 'iOS Jailbreak Developer',
      period: '2011 - 2013',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      Icon: Wrench,
      projects: [
        {
          title: 'Feature X',
          description: 'Redesigned and implemented the core messaging experience...',
          imageSrc: '/images/vision-pro-privacy.png',
          tags: ['Swift', 'SwiftUI', 'Core Data']
        },
        {
          title: 'Feature Y',
          description: 'Built a real-time collaboration system...',
          imageSrc: '/images/wwdc-talk.jpg',
          tags: ['UIKit', 'WebSocket', 'Core Animation']
        }
      ]
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-2">Work</h1>
      {experiences.map((experience) => (
        <WorkExperience key={experience.company + experience.role} {...experience} />
      ))}
    </div>
  )
}