'use client'
import { Github, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center space-x-6">
          <a
            href="https://github.com/aricha"
            className="text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <Github size={24} />
          </a>
          <a
            href="https://linkedin.com/in/aricha"
            className="text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://instagram.com/andrewgoesto"
            className="text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <Instagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  )
}