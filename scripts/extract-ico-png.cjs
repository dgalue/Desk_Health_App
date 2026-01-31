const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Read the ICO file and extract the 256x256 BMP data
const icoPath = path.join(__dirname, '..', 'public', 'icon.ico');
const pngPath = path.join(__dirname, '..', 'public', 'sidebar-icon.png');
const trayPath = path.join(__dirname, '..', 'public', 'tray-icon.png');

const ico = fs.readFileSync(icoPath);

const numImages = ico.readUInt16LE(4);
console.log('Number of images in ICO:', numImages);

// Find the 256x256 image
let targetOffset = 0;
let targetSize = 0;

for (let i = 0; i < numImages; i++) {
    const dirEntry = 6 + (i * 16);
    const width = ico.readUInt8(dirEntry) || 256;
    const size = ico.readUInt32LE(dirEntry + 8);
    const offset = ico.readUInt32LE(dirEntry + 12);

    console.log(`Image ${i}: ${width}x${width}, size: ${size}`);

    if (width === 256) {
        targetOffset = offset;
        targetSize = size;
    }
}

// Extract the raw BMP data
const bmpData = ico.slice(targetOffset, targetOffset + targetSize);
console.log('First 4 bytes:', bmpData[0], bmpData[1], bmpData[2], bmpData[3]);

// BMP in ICO has no file header, just BITMAPINFOHEADER
// The data starts with the DIB header
const headerSize = bmpData.readUInt32LE(0);
const width = bmpData.readInt32LE(4);
const height = bmpData.readInt32LE(8); // Height is doubled in ICO (includes mask)
const bpp = bmpData.readUInt16LE(14);
const compression = bmpData.readUInt32LE(16);

console.log(`Header size: ${headerSize}, Width: ${width}, Height: ${height}, BPP: ${bpp}, Compression: ${compression}`);

// For 32bpp BGRA BMP data:
const realHeight = Math.abs(height) / 2; // Divide by 2 because ICO doubles height for XOR+AND mask
const pixelDataOffset = headerSize;
const rowSize = width * 4; // 32bpp = 4 bytes per pixel

// Create raw RGBA buffer (BMP stores rows bottom-up and as BGRA)
const rgba = Buffer.alloc(width * realHeight * 4);

for (let y = 0; y < realHeight; y++) {
    for (let x = 0; x < width; x++) {
        // BMP is bottom-up, so flip Y
        const srcIdx = pixelDataOffset + ((realHeight - 1 - y) * rowSize) + (x * 4);
        const dstIdx = (y * width + x) * 4;

        // BGRA to RGBA
        rgba[dstIdx + 0] = bmpData[srcIdx + 2]; // R
        rgba[dstIdx + 1] = bmpData[srcIdx + 1]; // G
        rgba[dstIdx + 2] = bmpData[srcIdx + 0]; // B
        rgba[dstIdx + 3] = bmpData[srcIdx + 3]; // A
    }
}

// Use sharp to create PNG from raw RGBA data
sharp(rgba, {
    raw: {
        width: width,
        height: realHeight,
        channels: 4
    }
})
    .png()
    .toFile(pngPath)
    .then(() => {
        console.log('Sidebar icon created:', pngPath);
        // Also create a smaller tray icon
        return sharp(pngPath).resize(32, 32).png().toFile(trayPath);
    })
    .then(() => {
        console.log('Tray icon created:', trayPath);
    })
    .catch(err => {
        console.error('Error:', err);
    });
