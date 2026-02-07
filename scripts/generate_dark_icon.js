
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const artifactPath = String.raw`c:\Users\diego\.gemini\antigravity\brain\7925f241-6815-4d28-984f-c453974906b5\app_icon_v3_transparent_1769679492622.png`;
const publicIconPath = path.resolve(__dirname, '../public/icon.png');
const assetsLogoPath = path.resolve(__dirname, '../assets/logo.png');
const assetsSplashPath = path.resolve(__dirname, '../assets/splash.png');

const darkColor = { r: 12, g: 14, b: 20, alpha: 1 }; // #0c0e14

async function generateDarkIcon() {
    try {
        console.log(`Reading transparent icon from: ${artifactPath}`);
        
        if (!fs.existsSync(artifactPath)) {
            console.error("Artifact file not found!");
            process.exit(1);
        }

        // Create dark background image
        // We need to know the dimensions of the input first
        const input = sharp(artifactPath);
        const metadata = await input.metadata();
        
        console.log(`Input dimensions: ${metadata.width}x${metadata.height}`);

        // Create a solid background
        const background = await sharp({
            create: {
                width: metadata.width,
                height: metadata.height,
                channels: 4,
                background: darkColor
            }
        }).png().toBuffer();

        // Composite the transparent icon over the background
        const composite = await sharp(background)
            .composite([{ input: artifactPath, blend: 'over' }])
            .png()
            .toBuffer();

        // Save to public/icon.png
        console.log(`Saving to ${publicIconPath}...`);
        await sharp(composite).toFile(publicIconPath);

        // Save to assets/logo.png (for Capacitor)
        console.log(`Saving to ${assetsLogoPath}...`);
        await sharp(composite).toFile(assetsLogoPath);
        
        // Save to assets/splash.png (might want different sizing, but this works for consistency)
        console.log(`Saving to ${assetsSplashPath}...`);
        await sharp(composite).toFile(assetsSplashPath);

        console.log("Success! Icon updated with dark background.");

    } catch (error) {
        console.error("Error generating icon:", error);
        process.exit(1);
    }
}

generateDarkIcon();
