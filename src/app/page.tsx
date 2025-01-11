import Image from 'next/image'
import Link from 'next/link'
import { LucideIcon, ArrowRight, Laptop, Plane } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className='order-2 md:order-1'>
          <h1 className="text-4xl font-bold mb-4">Hi, I'm Andrew Richardson</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            I'm a software engineer with a passion for building delightful user experiences.
            When I'm not coding, you can find me exploring the world and capturing moments
            through my camera lens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <NavLink href="/work" icon={Laptop}>Work</NavLink>
            <NavLink href="/travel" icon={Plane}>Travel</NavLink>
          </div>
        </div>
        <div className="
        relative aspect-square h-64 md:h-96 rounded-full overflow-hidden 
        border-4 border-white dark:border-gray-800 shadow-lg
        order-1 md:order-2
        ">
        <Image
            src="/images/profile.jpg"
            alt="Andrew Richardson"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}

function NavLink({ 
  href, icon: Icon, children 
}: { 
  href: string, icon: LucideIcon, children: React.ReactNode 
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center px-6 py-3 text-2xl font-bold rounded-md text-gray-700 dark:text-gray-200`}
    >
      <Icon className={`mr-2 h-8 w-8`} />
      {children}
    </Link>
  )
}