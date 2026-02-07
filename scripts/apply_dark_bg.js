
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source: The transparent version from artifacts
// I will use the path found in the find_by_name step or the one I know exists
const artifactPath = String.raw`c:\Users\diego\.gemini\antigravity\brain\7925f241-6815-4d28-984f-c453974906b5\app_icon_v3_transparent_1769679492622.png`;

// Destinations
const publicIconPath = path.resolve(__dirname, '../public/icon.png');
const assetsLogoPath = path.resolve(__dirname, '../assets/logo.png');
const assetsSplashPath = path.resolve(__dirname, '../assets/splash.png');

// App Theme Color: #0c0e14
const darkColor = { r: 12, g: 14, b: 20, alpha: 1 };

async function applyDarkBackground() {
    try {
        console.log(`Reading transparent source: ${artifactPath}`);

        if (!fs.existsSync(artifactPath)) {
            console.error("Error: Transparent source icon not found.");
            console.error("Please verify the artifact path.");
            process.exit(1);
        }

        const input = sharp(artifactPath);
        const metadata = await input.metadata();

        console.log(`Source dimensions: ${metadata.width}x${metadata.height}`);

        // Create solid dark background
        const background = await sharp({
            create: {
                width: metadata.width,
                height: metadata.height,
                channels: 4,
                background: darkColor
            }
        }).png().toBuffer();

        // Composite: Dark BG + Transparent Icon
        const composite = await sharp(background)
            .composite([{ input: artifactPath, blend: 'over' }])
            .png()
            .toBuffer();

        // Overwrite existing icons
        console.log(`Updating ${publicIconPath}...`);
        await sharp(composite).toFile(publicIconPath);

        console.log(`Updating ${assetsLogoPath}...`);
        await sharp(composite).toFile(assetsLogoPath);

        console.log(`Updating ${assetsSplashPath}...`);
        await sharp(composite).toFile(assetsSplashPath);

        console.log("Success: Background changed to #0c0e14");

    } catch (error) {
        console.error("Error processing icon:", error);
        process.exit(1);
    }
}

applyDarkBackground();
