#!/usr/bin/env node
import { processDirectory } from './upload';
import parseArgs from 'yargs-parser';

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

  // Convert positional argument to string
  const [directory] = parsed._.map(arg => String(arg));
  const outputPath = parsed.output || 'image-assets.json';

  if (!directory) {
    console.error('Error: Directory path is required');
    printUsage();
    process.exit(1);
  }

  try {
    await processDirectory(directory, outputPath);
  } catch (error) {
    console.error('Failed to process images:', error);
    process.exit(1);
  }
}

main().catch(console.error);