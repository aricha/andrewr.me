// app/api/upload-audio/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  console.log('Upload API called');
  
  try {
    console.log('Parsing form data...');
    const formData = await request.formData();
    
    const password = formData.get('password') as string;
    const file = formData.get('file') as File;

    console.log('File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    });

    // Check password
    if (password !== process.env.ADMIN_SECRET) {
      console.log('Password check failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!file) {
      console.log('No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Uploading to Vercel Blob...');
    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true, // Generate unique filename to avoid conflicts
    });

    console.log('Upload successful:', blob.url);
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}