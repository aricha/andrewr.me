// app/api/podcast.xml/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

interface Episode {
  title: string;
  audioUrl: string;
  pubDate: string;
  id: number;
  description: string;
}

export async function GET(request: NextRequest) {
  // Check for secret token for privacy
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (token !== process.env.RSS_SECRET) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    // Get all episodes from Redis
    const episodeData = await redis.lrange('episodes', 0, -1);
    const episodes: Episode[] = (episodeData as (string | Episode)[])
      .map(ep => {
        // Handle both JSON strings and objects
        if (typeof ep === 'string') {
          return JSON.parse(ep);
        }
        return ep; // Already an object
      })
      .filter(ep => new Date(ep.pubDate) <= new Date()) // Only show published episodes
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()); // Newest first

    const host = request.headers.get('host') || 'localhost';
    const rss = generateRSS(episodes, host);
    
    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}

function generateRSS(episodes: Episode[], host: string): string {
  const podcastTitle = process.env.PODCAST_TITLE || 'My Private Podcast';
  const podcastDescription = process.env.PODCAST_DESCRIPTION || 'Casual voice memos';
  const podcastImage = process.env.PODCAST_IMAGE_URL || '';
  const siteUrl = `https://${host}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(podcastTitle)}</title>
    <description>${escapeXml(podcastDescription)}</description>
    <itunes:summary>${escapeXml(podcastDescription)}</itunes:summary>
    <itunes:subtitle>${escapeXml(podcastDescription)}</itunes:subtitle>
    <link>${siteUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${episodes[0] ? new Date(episodes[0].pubDate).toUTCString() : new Date().toUTCString()}</pubDate>
    <itunes:author>${escapeXml(process.env.PODCAST_AUTHOR || 'Anonymous')}</itunes:author>
    <itunes:category text="Personal Journals"/>
    <itunes:explicit>no</itunes:explicit>${podcastImage ? `
    <itunes:image href="${podcastImage}"/>
    <image>
      <url>${podcastImage}</url>
      <title>${escapeXml(podcastTitle)}</title>
      <link>${siteUrl}</link>
    </image>` : ''}
    ${episodes.map(episode => {
      // Determine MIME type based on file extension
      const audioUrl = episode.audioUrl;
      const extension = audioUrl.split('.').pop()?.toLowerCase();
      let mimeType = 'audio/mpeg'; // default
      
      switch (extension) {
        case 'm4a':
        case 'aac':
          mimeType = 'audio/mp4';
          break;
        case 'mp3':
          mimeType = 'audio/mpeg';
          break;
        case 'wav':
          mimeType = 'audio/wav';
          break;
        case 'ogg':
          mimeType = 'audio/ogg';
          break;
      }
      
      return `
    <item>
      <title>${escapeXml(episode.title)}</title>
      <description>${escapeXml(episode.description)}</description>
      <itunes:summary>${escapeXml(episode.description)}</itunes:summary>
      <itunes:subtitle>${escapeXml(episode.description.length > 100 ? episode.description.substring(0, 97) + '...' : episode.description)}</itunes:subtitle>
      <content:encoded><![CDATA[${episode.description}]]></content:encoded>
      <link>${siteUrl}</link>
      <guid isPermaLink="false">${episode.id}</guid>
      <pubDate>${new Date(episode.pubDate).toUTCString()}</pubDate>
      <enclosure url="${episode.audioUrl}" type="${mimeType}" length="0"/>
      <itunes:duration>00:00:00</itunes:duration>
    </item>`;
    }).join('')}
  </channel>
</rss>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}