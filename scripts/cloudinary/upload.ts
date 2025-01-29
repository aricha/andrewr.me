import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

import { config } from 'dotenv';
config({ path: '.env.local' });

// Typeconfig,  definitions
interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageAsset {
  publicId: string;
  width: number;
  height: number;
}

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

interface UploadOptions {
  overwrite?: boolean;
}

// Configure Cloudinary with type safety
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const;

function getEnvVar(name: string): string {
  config({ path: '.env.local' });
  if (!requiredEnvVars.includes(name as typeof requiredEnvVars[number])) {
    throw new Error(`Invalid environment variable name: ${name}`);
  }
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Configure Cloudinary
function configureCloudinary() {
  cloudinary.config({
    cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
    api_key: getEnvVar('CLOUDINARY_API_KEY'),
    api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
  } satisfies CloudinaryConfig);
}

async function getImageDimensions(filepath: string): Promise<ImageDimensions> {
  const metadata = await sharp(filepath).metadata();
  
  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not get dimensions for image: ${filepath}`);
  }
  
  return {
    width: metadata.width,
    height: metadata.height
  };
}

async function uploadImage(filepath: string, basePath: string, options: UploadOptions = {}): Promise<ImageAsset> {
  try {
    // Get image dimensions before upload
    const dimensions = await getImageDimensions(filepath);
    
    // Calculate the relative path from the base directory
    const relativePath = path.relative(basePath, filepath);
    
    const folder = path.dirname(relativePath);

    console.log('Uploading image:', filepath, 'to folder:', folder);
    
    // Upload to Cloudinary, preserving the folder structure
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(filepath, {
        folder: folder, // Base folder in Cloudinary
        use_filename: true,
        unique_filename: false, // We want to keep our exact folder structure
        overwrite: options.overwrite ?? true, // Default to true if not specified
      }, (error, result) => {
        if (error) reject(error);
        else if (result) resolve(result);
        else reject(new Error('No result from Cloudinary upload'));
      });
    });

    // Return combined metadata
    return {
      publicId: result.public_id,
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch (error) {
    console.error(`Error uploading ${filepath}:`, error);
    throw error;
  }
}

async function processDirectory(directoryPath: string, outputPath: string, options: UploadOptions = {}): Promise<{ [key: string]: ImageAsset }> {
  try {
    configureCloudinary();
    const results: { [key: string]: ImageAsset } = {};
    const imageFileRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
    
    async function processDir(dir: string): Promise<void> {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      console.log('Processing directory:', dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await processDir(fullPath);
        } else if (entry.isFile() && imageFileRegex.test(entry.name)) {
          const result = await uploadImage(fullPath, directoryPath, options);
          results[result.publicId] = result;
        }
      }
    }
    
    await processDir(directoryPath);

    // Write results to a JSON file
    await fs.writeFile(
      outputPath,
      JSON.stringify(results, null, 2)
    );

    console.log(`Processed ${Object.keys(results).length} images. Results saved to ${outputPath}`);
    return results;
  } catch (error) {
    console.error('Error processing directory:', error);
    throw error;
  }
}

// Export types and functions
export type { ImageAsset, ImageDimensions, UploadOptions };
export { uploadImage, processDirectory, configureCloudinary };