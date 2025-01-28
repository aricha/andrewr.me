import { StorySlug } from '@/content/travel/config';

export interface TravelStory {
  title: string;
  image: string;
  photos?: string[];
  description?: string;
  prominent?: boolean;
  slug: StorySlug;
}

export interface TravelStoryMeta {
  title: string;
  image: string;
  photos?: string[];
  description?: string;
  prominent?: boolean;
} 