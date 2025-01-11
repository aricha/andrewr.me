import { Smartphone, Laptop, Server } from 'lucide-react'
import { WorkExperience } from '@/components/work/WorkExperience'

export default function Work() {
  const experiences = [
    {
      company: 'Current Company',
      role: 'Senior Software Engineer',
      period: '2021 - Present',
      description: 'Led the development of several key features in the company\'s flagship iOS app...',
      Icon: Smartphone,
      projects: [
        {
          title: 'Feature X',
          description: 'Redesigned and implemented the core messaging experience...',
          imageSrc: '/images/project1.jpg',
          tags: ['Swift', 'SwiftUI', 'Core Data']
        },
        {
          title: 'Feature Y',
          description: 'Built a real-time collaboration system...',
          imageSrc: '/images/project2.jpg',
          tags: ['UIKit', 'WebSocket', 'Core Animation']
        }
      ]
    },
    // Add more experiences here
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Work Experience</h1>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {experiences.map((experience) => (
          <WorkExperience key={experience.company} {...experience} />
        ))}
      </div>
    </div>
  )
}