const fs = require('fs');
const toIco = require('to-ico');

console.log('Reading public/icon.png...');
const file = fs.readFileSync('public/icon.png');

toIco([file], {
    resize: true,
    sizes: [256, 128, 64, 48, 32, 16] // Standard Windows sizes
}).then(buf => {
    fs.writeFileSync('public/icon.ico', buf);
    console.log('Success: public/icon.ico created!');
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
