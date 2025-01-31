'use client'

import { ReactNode } from 'react'
import { PageBackground } from '../layout/PageBackground'
import { LucideIcon } from 'lucide-react'
import { ImageAssetKey } from '@/types/image-asset'

interface WorkExperienceProps {
  id: string
  company: string
  role: string
  period: string
  description: string
  Icon: LucideIcon
  backgroundImage: ImageAssetKey
  children?: ReactNode
  lazy?: boolean
}

export function WorkExperience({
  id,
  company,
  role,
  period,
  description,
  Icon,
  backgroundImage,
  children,
  lazy = true,
}: WorkExperienceProps) {
  return (
    <div id={id} className={`text-zinc-100 min-h-screen relative snap-start`}>
      <PageBackground 
        image={backgroundImage} 
        hasBlur={true}
        imageStyle={{ filter: 'brightness(0.8)' }} 
        lazy={lazy}
      />

      {/* Content */}
      <div className="relative z-10 page-max-width-regular min-h-screen flex items-center">
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
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}