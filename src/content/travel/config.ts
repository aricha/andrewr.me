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