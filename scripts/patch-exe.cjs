const rcedit = require('rcedit');
const path = require('path');

async function patch() {
    const exePath = path.resolve(__dirname, '../release/win-unpacked/Desk Health.exe');
    const iconPath = path.resolve(__dirname, '../public/icon.ico');

    console.log('Patching icon for:', exePath);
    console.log('Using icon:', iconPath);

    try {
        await rcedit(exePath, {
            icon: iconPath
        });
        console.log('Successfully patched executable icon!');
    } catch (error) {
        console.error('Failed to patch icon:', error);
        process.exit(1);
    }
}

patch();
