const fs = require('fs');
const pngToIco = require('png-to-ico');

console.log('Converting icon...');
pngToIco('public/icon.png')
    .then(buf => {
        fs.writeFileSync('public/icon.ico', buf);
        console.log('Successfully created public/icon.ico');
    })
    .catch(err => {
        console.error('Error converting icon:', err);
        process.exit(1);
    });
