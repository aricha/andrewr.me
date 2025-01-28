// This file is processed at build time to ensure environment variables are properly injected

export const env = {
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
} as const;

// Validate required environment variables at build time
if (!env.GOOGLE_MAPS_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable');
} 