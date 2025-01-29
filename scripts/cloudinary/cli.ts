#!/usr/bin/env node
import { processDirectory } from './upload';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function main() {
  const parsedArgv = await yargs(hideBin(process.argv))
    .usage('Usage: $0 <directory> [options]')
    .command('* <directory>', 'Upload images from directory', (yargs) => {
      return yargs.positional('directory', {
        describe: 'Directory containing images to upload',
        type: 'string',
        demandOption: true
      });
    })
    .options({
      'output': {
        alias: 'o',
        describe: 'Output path for the JSON assets file',
        type: 'string',
        default: 'image-assets.json'
      },
      'overwrite': {
        describe: 'Overwrite existing images',
        type: 'boolean',
        default: true
      }
    })
    .example('$0 "./images" -o ./data/image-assets.json --no-overwrite', 'Upload images with specified options')
    .help('h')
    .alias('h', 'help')
    .strict()
    .parseAsync();

  const directory = parsedArgv.directory as string;
  const outputPath = parsedArgv.output as string;
  const overwrite = parsedArgv.overwrite as boolean;
  
  console.log('Directory:', directory);
  console.log('Output path:', outputPath);
  console.log('Overwrite:', overwrite);

  try {
    await processDirectory(directory, outputPath, { 
      overwrite
    });
    console.log('Upload completed successfully');
  } catch (error) {
    console.error('Failed to process images:', error);
    process.exit(1);
  }
}

main().catch(console.error);