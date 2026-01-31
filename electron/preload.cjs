const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Add exposed native functions here if needed
    // e.g. minimizeToTray: () => ipcRenderer.send('minimize-to-tray')
    getStartupStatus: () => ipcRenderer.invoke('get-startup-status'),
    toggleStartup: (enable) => ipcRenderer.send('toggle-startup', enable),
    focusWindow: () => ipcRenderer.send('focus-window'),
    showNotification: (title, body) => ipcRenderer.send('show-notification', title, body)
});
