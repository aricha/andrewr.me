'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { ProjectCard, Project } from './ProjectCard'
import './ProjectScroller.css'

interface ProjectScrollerProps {
  projects: Project[]
}

export function ProjectScroller({ projects }: ProjectScrollerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftMask, setShowLeftMask] = useState(false);
  const [showRightMask, setShowRightMask] = useState(true);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    setShowLeftMask(scrollLeft > 0);
    setShowRightMask(scrollLeft < scrollWidth - clientWidth);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative">
        <div 
          className={`absolute inset-y-0 left-0 -mx-1 -my-1 w-10 scroller-mask-left z-10 transition-opacity duration-300 ${
            showLeftMask ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ left: 0 }}
        />
        <div 
          className={`absolute inset-y-0 right-0 -my-1 w-10 scroller-mask-right z-10 transition-opacity duration-300 ${
            showRightMask ? 'opacity-100' : 'opacity-0'
          }`}
        />
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto relative"
      >
        <div className="flex flex-none gap-4 pb-4">
          {projects.map((project) => (
            <div className="snap-start shrink-0 w-[280px]" key={project.title}>
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 