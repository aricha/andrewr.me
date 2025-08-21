// app/api/add-episode/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

interface EpisodeRequest {
  title: string;
  audioUrl: string;
  pubDate: string;
  password: string;
  description?: string;
}

interface Episode {
  title: string;
  audioUrl: string;
  pubDate: string;
  id: number;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const { title, audioUrl, pubDate, password, description }: EpisodeRequest = await request.json();
    
    // Check password
    if (password !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!title || !audioUrl || !pubDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const episode: Episode = {
      title,
      audioUrl,
      pubDate,
      id: Date.now(),
      description: description || title // Use title as fallback if no description
    };

    // Add to Redis store (episodes are stored as a list)
    await redis.lpush('episodes', JSON.stringify(episode));
    
    return NextResponse.json({ success: true, episode });
  } catch (error) {
    console.error('Add episode error:', error);
    return NextResponse.json({ error: 'Failed to add episode' }, { status: 500 });
  }
}