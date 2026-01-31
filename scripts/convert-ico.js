const pngToIco = require('png-to-ico');
const fs = require('fs');

pngToIco('public/icon.png')
    .then(buf => {
        fs.writeFileSync('public/icon.ico', buf);
        console.log('ICO created successfully');
    })
    .catch(err => {
        console.error('Error:', err);
    });
