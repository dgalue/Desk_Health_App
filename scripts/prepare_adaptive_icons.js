
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source: Transparent Heart (found previously)
// NOTE: I am using the path from the previous step's knowledge
const artifactPath = String.raw`c:\Users\diego\.gemini\antigravity\brain\7925f241-6815-4d28-984f-c453974906b5\app_icon_v3_transparent_1769679492622.png`;

// Destinations for @capacitor/assets
// See: https://github.com/ionic-team/capacitor-assets
const assetsDir = path.resolve(__dirname, '../assets');
const iconForegroundPath = path.resolve(assetsDir, 'icon-foreground.png');
const iconBackgroundPath = path.resolve(assetsDir, 'icon-background.png');
const logoPath = path.resolve(assetsDir, 'logo.png'); // Keep legacy composite

// App Theme Color: #0c0e14
const darkColor = { r: 12, g: 14, b: 20, alpha: 1 };

async function prepareAdaptiveIcons() {
    try {
        console.log(`Checking source: ${artifactPath}`);
        if (!fs.existsSync(artifactPath)) {
            console.error("Source artifact missing!");
            process.exit(1);
        }

        const input = sharp(artifactPath);
        const metadata = await input.metadata();
        console.log(`Dimensions: ${metadata.width}x${metadata.height}`);

        // 1. Create PRECISE Foreground
        // To avoid "smaller" look, the heart should assume it fills the safe zone.
        // Android foregrounds are 108x108dp, safe zone is inner 66dp.
        // If our heart text/graphic touches the edge of 1024x1024, it might get clipped.
        // But usually "smaller" means the tool scaled the whole box down.
        // We will copy the transparent source DIRECTLY to icon-foreground.png
        // (Assuming the artifact has reasonable padding).
        console.log(`Creating ${iconForegroundPath}...`);
        await input.clone().toFile(iconForegroundPath);

        // 2. Create Solid Background
        console.log(`Creating ${iconBackgroundPath}...`);
        await sharp({
            create: {
                width: metadata.width,
                height: metadata.height,
                channels: 4,
                background: darkColor
            }
        }).png().toFile(iconBackgroundPath);

        // 3. Ensure Logo is Composite (for legacy/web)
        // We already did this in the previous step, but let's re-verify/ensure.
        // A composite is needed for fallback.
        console.log(`Ensuring ${logoPath} is composite...`);
        // (We can skip this if we know it's good, but safe to regenerate)
        const backgroundBuffer = await sharp({
            create: {
                width: metadata.width,
                height: metadata.height,
                channels: 4,
                background: darkColor
            }
        }).png().toBuffer();

        await sharp(backgroundBuffer)
            .composite([{ input: artifactPath, blend: 'over' }])
            .toFile(logoPath);

        console.log("Assets prepared for Adaptive Icon generation.");

    } catch (error) {
        console.error("Error:", error);
    }
}

prepareAdaptiveIcons();
