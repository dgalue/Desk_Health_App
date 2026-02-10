
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source: Transparent Heart
const artifactPath = String.raw`c:\Users\diego\.gemini\antigravity\brain\7925f241-6815-4d28-984f-c453974906b5\app_icon_v3_transparent_1769679492622.png`;

// Destinations
const publicIconPath = path.resolve(__dirname, '../public/icon.png');
const assetsLogoPath = path.resolve(__dirname, '../assets/logo.png');
const assetsSplashPath = path.resolve(__dirname, '../assets/splash.png');

// App Theme Color: #0c0e14
const darkColor = { r: 12, g: 14, b: 20, alpha: 1 };

async function createCircularIcon() {
    try {
        console.log(`Processing ${artifactPath}...`);

        if (!fs.existsSync(artifactPath)) {
            console.error("Artifact not found.");
            process.exit(1);
        }

        const input = sharp(artifactPath);
        const metadata = await input.metadata();
        const size = metadata.width;
        const radius = size / 2;

        // 1. Create a Circle Mask (SVG)
        const circleSvg = Buffer.from(
            `<svg width="${size}" height="${size}"><circle cx="${radius}" cy="${radius}" r="${radius}" fill="#0c0e14"/></svg>`
        );

        // 2. Create the Dark Circle Base
        const darkCircle = await sharp(circleSvg).png().toBuffer();

        // 3. Composite Heart ON TOP of Dark Circle
        // We might need to resize the heart slightly if it touches edges, 
        // but the transparent source likely has padding.
        // Let's just overlay it.
        const composite = await sharp(darkCircle)
            .composite([{ input: artifactPath, blend: 'over' }])
            .png()
            .toBuffer();

        // 4. Save
        console.log(`Saving circular icon to ${publicIconPath}...`);
        await sharp(composite).toFile(publicIconPath);
        await sharp(composite).toFile(assetsLogoPath);

        // For splash, maybe keep the square? or same circle? 
        // User said "indigo square circular", implying the app icon.
        // Splash usually fills screen. A solid circle in middle of splash is fine.
        await sharp(composite).toFile(assetsSplashPath);

        console.log("Success: Icon is now Circular.");

    } catch (error) {
        console.error("Error:", error);
    }
}

createCircularIcon();
