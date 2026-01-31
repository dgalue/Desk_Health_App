const sharp = require('sharp');
const toIco = require('to-ico');
const fs = require('fs');

async function convertToIco() {
    try {
        // Create resized versions for ICO
        const sizes = [16, 32, 48, 256];
        const buffers = await Promise.all(
            sizes.map(size =>
                sharp('public/icon.png')
                    .resize(size, size)
                    .png()
                    .toBuffer()
            )
        );

        // Convert to ICO
        const icoBuffer = await toIco(buffers);
        fs.writeFileSync('public/icon.ico', icoBuffer);
        console.log('ICO created successfully with sizes:', sizes.join(', '));

        // Also create tray icon
        await sharp('public/icon.png')
            .resize(32, 32)
            .png()
            .toFile('public/tray-icon.png');
        console.log('Tray icon created');

    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

convertToIco();
