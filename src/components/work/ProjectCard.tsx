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
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden w-full">
      <div className="relative h-32">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-zinc-600 dark:text-zinc-300">{description}</p>
        {SHOW_TAGS && tags && (
          <div className="flex flex-wrap gap-2">
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
