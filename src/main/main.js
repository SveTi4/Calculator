const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow = null;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 360,
        height: 656,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    });

    await mainWindow.loadFile(path.join(__dirname, '../../src/renderer/index.html'));
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
}); 