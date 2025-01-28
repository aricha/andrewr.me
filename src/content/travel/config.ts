// The order of slugs determines the display order of stories
export const storyOrder = [
  'vietnam',
  'cave-camping',
  'acatenango',
  'sailing-colombia',
  'camino'
] as const;

// Type helper to ensure we don't have typos in slugs
export type StorySlug = typeof storyOrder[number];

// Using explicit dynamic imports that Next.js can statically analyze
export const storyImports = {
  'vietnam': () => import('./vietnam.mdx'),
  'cave-camping': () => import('./cave-camping.mdx'),
  'acatenango': () => import('./acatenango.mdx'),
  'sailing-colombia': () => import('./sailing-colombia.mdx'),
  'camino': () => import('./camino.mdx'),
} as const;

// Using explicit imports instead of template literals (`./${slug}.mdx`)
// allows Next.js to properly code-split each MDX file into separate chunks,
// ensuring users only download the stories they actually read
export const getStoryContent = async (slug: StorySlug) => {
  // Dynamically import based on slug
  switch (slug) {
    case 'vietnam':
      return (await import('./vietnam.mdx')).default;
    case 'cave-camping':
      return (await import('./cave-camping.mdx')).default;
    case 'acatenango':
      return (await import('./acatenango.mdx')).default;
    case 'sailing-colombia':
      return (await import('./sailing-colombia.mdx')).default;
    case 'camino':
      return (await import('./camino.mdx')).default;
  }
}; 