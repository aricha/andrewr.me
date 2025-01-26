#!/usr/bin/env node
import { processDirectory } from './upload';

function printUsage() {
  console.log(`
Usage: cloudinary-upload <directory> [options]

Arguments:
  directory               Directory containing images to upload

Options:
  -o, --output <path>    Output path for the JSON assets file (default: "image-assets.json")
  -h, --help             Show this help message

Example:
  cloudinary-upload ./images -o ./data/image-assets.json
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('-h') || args.includes('--help')) {
    printUsage();
    process.exit(0);
  }

  const directory = args[0];
  if (!directory) {
    console.error('Error: Directory path is required');
    printUsage();
    process.exit(1);
  }

  // Parse output path
  let outputPath = 'image-assets.json';
  const outputIndex = args.findIndex(arg => arg === '-o' || arg === '--output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    outputPath = args[outputIndex + 1];
  }

  try {
    await processDirectory(directory, outputPath);
  } catch (error) {
    console.error('Failed to process images:', error);
    process.exit(1);
  }
}

main();