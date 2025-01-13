import Image from 'next/image'

const SHOW_TAGS = false

interface ProjectCardProps {
  title: string
  description: string
  imageSrc: string
  tags?: string[]
}

interface Project {
  title: string
  description: string
  imageSrc: string
  tags?: string[]
}

export type { Project }

export function ProjectCard({ title, description, imageSrc, tags }: ProjectCardProps) {
  return (
    <div className="bg-zinc-950/40 backdrop-blur-md rounded-lg shadow-md overflow-hidden w-full h-full flex flex-col">
      <div className="relative h-32 flex-shrink-0">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-zinc-600 dark:text-zinc-300 flex-grow">{description}</p>
        {SHOW_TAGS && tags && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-sm bg-zinc-100 dark:bg-zinc-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
