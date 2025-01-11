import { LucideIcon } from 'lucide-react'
import { ProjectCard } from './ProjectCard'

interface Project {
  title: string
  description: string
  imageSrc: string
  tags?: string[]
}

interface WorkExperienceProps {
  company: string
  role: string
  period: string
  description: string
  Icon: LucideIcon
  projects: Project[]
}

export function WorkExperience({
  company,
  role,
  period,
  description,
  Icon,
  projects,
}: WorkExperienceProps) {
  return (
    <div className="py-12 border-b border-gray-200 dark:border-gray-800 last:border-0">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Icon size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">{company}</h2>
          <h3 className="text-xl text-gray-600 dark:text-gray-300 mb-1">{role}</h3>
          <p className="text-sm text-gray-500 mb-4">{period}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">{description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}