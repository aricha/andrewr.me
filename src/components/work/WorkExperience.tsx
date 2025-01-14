import { LucideIcon } from 'lucide-react'
import { ProjectScroller } from './ProjectScroller'
import { Project } from './ProjectCard'
import { ReactNode } from 'react'

interface WorkExperienceProps {
  company: string
  role: string
  period: string
  description: string
  Icon: LucideIcon
  projects: Project[]
  backgroundImage: string
  className?: string
  customContent?: ReactNode
}

export function WorkExperience({
  company,
  role,
  period,
  description,
  Icon,
  projects,
  backgroundImage,
  className,
  customContent,
}: WorkExperienceProps) {
  return (
    <div className={`text-zinc-100 ${className}`}>
      {/* Background image with blur */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8)',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-lg bg-neutral-500/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="py-8 w-full mt-[var(--navbar-height)]">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-zinc-800/40 backdrop-blur-md rounded-lg w-12 h-12 flex-shrink-0 flex items-center justify-center text-zinc-100">
              <Icon className="w-8 h-8" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl text-zinc-200 font-bold mb-1">{role}</h2>
              <h3 className="text-xl text-zinc-200 mb-1">{company}</h3>
              <p className="text-sm text-zinc-300 mb-4">{period}</p>
              <p className="text-zinc-200 max-w-2xl">{description}</p>
              
              {projects.length > 0 && (
                <div className="mt-4">
                  <ProjectScroller projects={projects} />
                </div>
              )}
            </div>
          </div>
            {customContent}
        </div>
      </div>
    </div>
  )
}