import { LucideIcon } from 'lucide-react'
import { ProjectScroller } from './ProjectScroller'
import { Project } from './ProjectCard'

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
    <div className="py-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-12 h-12 flex-shrink-0 flex items-center justify-center">
          <Icon className="w-8 h-8 stroke-zinc-900 dark:stroke-zinc-100" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold mb-1">{role}</h2>
          <h3 className="text-xl text-zinc-600 dark:text-zinc-300 mb-1">{company}</h3>
          <p className="text-sm text-zinc-500 mb-4">{period}</p>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl">{description}</p>
          
          {projects.length > 0 && (
            <div className="mt-4">
              <ProjectScroller projects={projects} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}