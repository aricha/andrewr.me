import fs from 'fs';
import path from 'path';
import { TravelStory, TravelStoryMeta } from '@/types/travel';
import matter from 'gray-matter';
import { storyOrder } from '@/content/travel/config';

const TRAVEL_PATH = path.join(process.cwd(), 'src/content/travel');

export async function getTravelStories(): Promise<TravelStory[]> {
  // First, get all stories into a map for easy lookup
  const files = fs.readdirSync(TRAVEL_PATH);
  const storiesMap = new Map(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        const filePath = path.join(TRAVEL_PATH, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const slug = file.replace(/\.mdx$/, '');
        const { data: frontmatter } = matter(content);

        return [
          slug,
          {
            ...(frontmatter as TravelStoryMeta),
            slug
          }
        ];
      })
  );

  // Then return stories in the configured order
  return storyOrder
    .map(slug => storiesMap.get(slug))
    .filter((story): story is TravelStory => story !== undefined);
}