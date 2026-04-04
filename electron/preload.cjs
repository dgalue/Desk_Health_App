const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getStartupStatus: () => ipcRenderer.invoke('get-startup-status'),
    toggleStartup: (enable) => ipcRenderer.send('toggle-startup', enable),
    focusWindow: () => ipcRenderer.send('focus-window'),
    showNotification: (title, body) => ipcRenderer.send('show-notification', title, body),
    saveSoundFile: (filename, base64Data) => ipcRenderer.invoke('save-sound-file', filename, base64Data),
    deleteSoundFile: (filename) => ipcRenderer.invoke('delete-sound-file', filename),
});
