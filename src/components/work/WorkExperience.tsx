import { LucideIcon } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import Image from 'next/image'

interface Project {
  title: string
  description: string
  imageSrc: string
  tags?: string[]
}

type SVGIcon = React.FC<React.SVGProps<SVGSVGElement>>

interface WorkExperienceProps {
  company: string
  role: string
  period: string
  description: string
  Icon: LucideIcon | SVGIcon
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
    <div className="py-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-12 h-12 flex items-center justify-center">
          <Icon className="w-8 h-8 stroke-zinc-900 dark:stroke-zinc-100" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">{role}</h2>
          <h3 className="text-xl text-zinc-600 dark:text-zinc-300 mb-1">{company}</h3>
          <p className="text-sm text-zinc-500 mb-4">{period}</p>
          <p className="text-zinc-600 dark:text-zinc-300 mb-4 max-w-2xl">{description}</p>
          
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