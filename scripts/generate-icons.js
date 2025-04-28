import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the icons directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes required by the manifest
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Path to the SVG icon
const svgPath = path.join(iconsDir, 'icon.svg');

// Generate PNG icons for each size
async function generateIcons() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Generate icons for each size
    for (const size of iconSizes) {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated icon: ${outputPath}`);
    }
    
    // Generate apple-touch-icon (180x180)
    const appleIconPath = path.join(iconsDir, 'apple-touch-icon.png');
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(appleIconPath);
    
    console.log(`Generated Apple touch icon: ${appleIconPath}`);
    
    // Generate new-chat icon (192x192)
    const newChatIconPath = path.join(iconsDir, 'new-chat.png');
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(newChatIconPath);
    
    console.log(`Generated new chat icon: ${newChatIconPath}`);
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 