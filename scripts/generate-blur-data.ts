import fs from 'fs/promises';
import path from 'path';
import { getPlaiceholder } from 'plaiceholder';
import parseArgs from 'yargs-parser';

interface BlurData {
  [imagePath: string]: {
    blurDataURL: string;
    size: {
      width: number;
      height: number;
    };
  };
}

function printUsage() {
  console.log(`
Usage: tsx scripts/generate-blur-data.ts <base-dir> <directory...> [options]

Generates blur placeholder data for Next.js Image components by scanning directories for images.

Requirements:
  - Node.js
  - tsx (already included in devDependencies)

Arguments:
  base-dir       Base directory for all input paths
  directory      One or more directories to scan for images (relative to base-dir)
                 Example: images public/assets

Options:
  -o, --output   Path where the JSON file will be saved
                 Default: ./blur-data.json
  -h, --help     Show this help message

Examples:
  # Generate blur data for images in src/images, save to default location
  tsx scripts/generate-blur-data.ts src images

  # Generate blur data with custom output path
  tsx scripts/generate-blur-data.ts src images -o ./src/assets/blur-data.json

  # Generate blur data for multiple directories
  tsx scripts/generate-blur-data.ts src images public/assets -o ./blur-data.json

  # Using the npm script (recommended)
  npm run generate-blur -- src images
  npm run generate-blur -- src images -o ./src/assets/blur-data.json

Supported image formats: .jpg, .jpeg, .png, .gif, .webp

The output JSON will contain:
  - Base64 encoded blur placeholder images
  - Image dimensions
  - Relative paths as keys (relative to base-dir)

This data can be imported and used with Next.js Image component's blurDataURL prop.
`);
}

async function findImages(baseDir: string, directories: string[]): Promise<string[]> {
  const imageFiles: string[] = [];
  const imageRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
  const baseDirAbs = path.resolve(baseDir);
  
  async function scanDir(relativeDir: string) {
    const fullDir = path.join(baseDirAbs, relativeDir);
    const entries = await fs.readdir(fullDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const relativePath = path.join(relativeDir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDir(relativePath);
      } else if (entry.isFile() && imageRegex.test(entry.name)) {
        imageFiles.push(relativePath);
      }
    }
  }
  
  for (const dir of directories) {
    await scanDir(dir);
  }
  
  return imageFiles;
}

async function generateBlurData(baseDir: string, imagePaths: string[], outputPath: string): Promise<void> {
  const blurData: BlurData = {};
  const baseDirAbs = path.resolve(baseDir);
  
  for (const relativePath of imagePaths) {
    try {
      // Read the image file
      const fullPath = path.join(baseDirAbs, relativePath);
      const imageBuffer = await fs.readFile(fullPath);
      
      // Generate blur data
      const { base64: blurDataURL, metadata } = await getPlaiceholder(imageBuffer, { size: 10 });
      
      // Store relative path as key (without extension)
      const pathWithoutExt = relativePath.replace(/\.[^/.]+$/, '');
      blurData[pathWithoutExt] = {
        blurDataURL,
        size: {
          width: metadata.width,
          height: metadata.height
        }
      };
      
      console.log(`Generated blur data for ${relativePath}`);
    } catch (error) {
      console.error(`Error processing ${relativePath}:`, error);
    }
  }
  
  // Write results to file (using absolute output path)
  await fs.writeFile(
    outputPath,
    JSON.stringify(blurData, null, 2)
  );
  
  console.log(`\nBlur data generated for ${Object.keys(blurData).length} images`);
  console.log(`Results saved to ${outputPath}`);
}

// CLI interface
async function main() {
  const parsed = parseArgs(process.argv.slice(2), {
    string: ['output'],
    boolean: ['help'],
    alias: {
      output: ['o'],
      help: ['h']
    },
    configuration: {
      'strip-aliased': true,
      'strip-dashed': true
    }
  });

  if (parsed.help) {
    printUsage();
    process.exit(0);
  }

  // Convert positional arguments to strings
  const [baseDir, ...searchDirs] = parsed._.map(arg => String(arg));

  const outputPath = parsed.output || './blur-data.json';

  if (!baseDir) {
    console.error('Error: Please provide a base directory\n');
    printUsage();
    process.exit(1);
  }

  if (searchDirs.length === 0) {
    console.error('Error: Please provide at least one directory to search for images\n');
    printUsage();
    process.exit(1);
  }

  // Validate base directory exists
  try {
    const stats = await fs.stat(baseDir);
    if (!stats.isDirectory()) {
      console.error(`Error: Base directory '${baseDir}' is not a directory`);
      process.exit(1);
    }
  } catch {
    console.error(`Error: Base directory '${baseDir}' does not exist`);
    process.exit(1);
  }

  // Validate search directories exist
  const baseDirAbs = path.resolve(baseDir);
  for (const dir of searchDirs) {
    try {
      const fullPath = path.join(baseDirAbs, dir);
      const stats = await fs.stat(fullPath);
      if (!stats.isDirectory()) {
        console.error(`Error: '${dir}' is not a directory`);
        process.exit(1);
      }
    } catch {
      console.error(`Error: Directory '${dir}' does not exist`);
      process.exit(1);
    }
  }

  console.log('Base directory:', baseDir);
  console.log('Output path:', outputPath);
  console.log('Searching in:', searchDirs.map(dir => path.join(baseDir, dir)));

  const imagePaths = await findImages(baseDir, searchDirs);
  console.log(`Found ${imagePaths.length} images`);

  if (imagePaths.length === 0) {
    console.log('No images found in the specified directories');
    process.exit(0);
  }

  await generateBlurData(baseDir, imagePaths, outputPath);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { generateBlurData, findImages }; 
