'use client'

import type { MDXComponents } from 'mdx/types'
import { ImageGallery } from '@/components/mdx/ImageGallery'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ImageGallery,
  }
}