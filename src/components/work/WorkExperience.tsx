import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface WorkExperienceProps {
  company: string
  role: string
  period: string
  description: string
  Icon: LucideIcon
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
  backgroundImage,
  className,
  customContent,
}: WorkExperienceProps) {
  return (
    <div className={`text-zinc-100 ${className} overflow-hidden`}>
      {/* Background image with blur */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0.8)',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-lg bg-neutral-500/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="pt-8 w-full mt-[var(--navbar-height)]">
          <div className="">
            <div className="w-fit mx-auto">
              <div className="w-fit flex items-center gap-6 mb-4">
                <div className="p-3 bg-zinc-800/40 backdrop-blur-md rounded-xl aspect-square h-[4rem] flex-shrink-0 flex items-center justify-center text-zinc-100">
                  <Icon className="w-full h-full" />
                </div>
                <div className="">
                  <h2 className="text-2xl text-zinc-200 font-bold">{role}</h2>
                  <h3 className="text-xl text-zinc-200 mb-[1px]">{company}</h3>
                  <p className="text-sm text-zinc-300">{period}</p>
                </div>
              </div>
              <p className="text-zinc-200 text-lg max-w-prose">{description}</p>
            </div>
          </div>
          <div className='pt-4 sm:pt-8 pb-4'>
            {customContent}
          </div>
        </div>
      </div>
    </div>
  )
}