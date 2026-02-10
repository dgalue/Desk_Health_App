
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Disable cache
sharp.cache(false);

const artifactPath = String.raw`c:\Users\diego\.gemini\antigravity\brain\7925f241-6815-4d28-984f-c453974906b5\app_icon_v3_transparent_1769679492622.png`;
const tempFgPath = path.resolve(__dirname, 'temp_fg.png');
const tempBgPath = path.resolve(__dirname, 'temp_bg.png');
const publicIconPath = path.resolve(__dirname, '../public/icon.png');
const assetsLogoPath = path.resolve(__dirname, '../assets/logo.png');

async function createCircularIcon() {
    try {
        console.log("Starting...");

        const size = 1024;
        const scaleFactor = 1.25; // 25% larger to really fill it
        const newWidth = Math.round(size * scaleFactor);
        const offset = Math.floor((newWidth - size) / 2);

        // 1. Resize FG -> Extract Center 1024x1024 -> Save
        console.log(`Resizing FG to ${newWidth}px and cropping center...`);
        await sharp(artifactPath)
            .resize({ width: newWidth })
            .extract({ left: offset, top: offset, width: size, height: size })
            .png()
            .toFile(tempFgPath);

        // 2. Create BG and save
        console.log("Creating BG...");
        const radius = size / 2;
        const circleSvg = `<svg width="${size}" height="${size}"><circle cx="${radius}" cy="${radius}" r="${radius}" fill="#0c0e14"/></svg>`;

        await sharp(Buffer.from(circleSvg))
            .png()
            .toFile(tempBgPath);

        // 3. Composite
        console.log("Compositing...");
        await sharp(tempBgPath)
            .composite([{
                input: tempFgPath,
                blend: 'over',
                gravity: 'center'
            }])
            .png()
            .toFile(publicIconPath);

        console.log(`Saved ${publicIconPath}`);

        // Copy to assets
        fs.copyFileSync(publicIconPath, assetsLogoPath);

        // Clean up
        if (fs.existsSync(tempFgPath)) fs.unlinkSync(tempFgPath);
        if (fs.existsSync(tempBgPath)) fs.unlinkSync(tempBgPath);

        console.log("Success: Icon Scaled Up & Circular.");

    } catch (e) {
        console.error("FAILED:", e);
    }
}

createCircularIcon();
