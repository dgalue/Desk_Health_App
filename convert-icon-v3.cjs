const fs = require('fs');
const toIco = require('to-ico');
const sharp = require('sharp');

console.log('Cleaning icon with Sharp...');

sharp('public/icon.png')
    .resize(256, 256)
    .png()
    .toBuffer()
    .then(buffer => {
        console.log('Sharp cleaned the buffer. Converting to ICO...');
        return toIco([buffer], {
            resize: true,
            sizes: [256, 128, 64, 48, 32, 16]
        });
    })
    .then(buf => {
        fs.writeFileSync('public/icon.ico', buf);
        console.log('Success: public/icon.ico created!');
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
