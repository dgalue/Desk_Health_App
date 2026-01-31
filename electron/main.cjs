const { app, BrowserWindow, Tray, Menu, nativeImage, shell, Notification } = require('electron');
const path = require('path');

let mainWindow;
let tray;

// Helper to get correct path in both dev and production
function getAssetPath(...paths) {
    if (app.isPackaged) {
        return path.join(process.resourcesPath, ...paths);
    }
    return path.join(__dirname, '..', ...paths);
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 790,
        minWidth: 800,
        minHeight: 790,
        icon: getAssetPath('public', 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        },
        autoHideMenuBar: true,
        show: false // Don't show until ready
    });

    // Load the app
    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    } else {
        const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
        mainWindow.loadURL(startUrl);
    }

    // Show window when ready, unless starting hidden
    mainWindow.once('ready-to-show', () => {
        const startHidden = process.argv.includes('--hidden') || process.argv.includes('--minimized');
        if (!startHidden) {
            mainWindow.show();
        }
    });

    // Minimize to tray logic
    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    // Open external links in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

function createTray() {
    // Use PNG for tray icon (ICO was causing rendering issues)
    const iconPath = getAssetPath('public', 'tray-icon.png');
    let trayIcon;

    try {
        trayIcon = nativeImage.createFromPath(iconPath);
        // Resize if needed for proper tray display
        if (!trayIcon.isEmpty()) {
            trayIcon = trayIcon.resize({ width: 16, height: 16 });
        }
    } catch (e) {
        console.error('Failed to load tray icon:', e);
        trayIcon = nativeImage.createEmpty();
    }

    tray = new Tray(trayIcon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open Desk Health',
            click: () => mainWindow.show()
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Desk Health');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });

    app.whenReady().then(() => {
        // Set app user model ID for Windows notifications to show correct name
        if (process.platform === 'win32') {
            app.setAppUserModelId('Desk Health');
        }

        // Check if app was started with --hidden flag (for auto-start)
        const startHidden = process.argv.includes('--hidden') || process.argv.includes('--minimized');

        createWindow();
        createTray();

        // If started hidden, don't show the window (stay in tray)
        if (!startHidden) {
            mainWindow.show();
        }

        // FIX: Ensure startup settings utilize --hidden if enabled (fixes missing arg on updates)
        const loginSettings = app.getLoginItemSettings();
        if (loginSettings.openAtLogin) {
            app.setLoginItemSettings({
                openAtLogin: true,
                path: app.getPath('exe'),
                args: ['--hidden']
            });
        }

        // IPC Handlers for Startup
        const { ipcMain } = require('electron');

        ipcMain.handle('get-startup-status', () => {
            const settings = app.getLoginItemSettings({ args: ['--hidden'] });
            return settings.openAtLogin;
        });

        ipcMain.on('toggle-startup', (event, enable) => {
            app.setLoginItemSettings({
                openAtLogin: enable,
                path: app.getPath('exe'),
                args: ['--hidden'] // Start minimized to tray
            });
        });

        // Focus and bring window to front
        ipcMain.on('focus-window', () => {
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.show();
                mainWindow.focus();
            }
        });

        // Show native notification with proper app name and icon
        ipcMain.on('show-notification', (event, title, body) => {
            const iconPath = getAssetPath('public', 'icon.ico');
            const notification = new Notification({
                title: title,
                body: body,
                icon: iconPath
            });
            notification.show();
        });

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
