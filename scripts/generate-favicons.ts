import sharp from 'sharp';
import { promises as fs } from 'fs';

async function generateFavicons() {
  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile('public/icon.svg');
    
    // Generate PNGs of different sizes
    const sizes = [16, 32, 180];
    
    await Promise.all(sizes.map(async (size) => {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(`public/favicon-${size}x${size}.png`);
      
      console.log(`✓ Generated ${size}x${size} PNG`);
    }));

    // For ICO file, we need to generate all sizes and combine them
    const icoBuffers = await Promise.all([16, 32, 48].map(size => 
      sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toBuffer()
    ));

    // Write the favicon.ico using the PNG buffers
    // Note: May want to use a package like 'ico-endec' here for true ICO format
    // For now, we'll just use the 32x32 version as favicon.ico
    await fs.writeFile('public/favicon.ico', icoBuffers[1]);
    console.log('✓ Generated ICO file');

    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();