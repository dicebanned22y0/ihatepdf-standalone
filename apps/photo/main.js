const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

const APP_TITLE = 'iHatePhoto';
const APP_URL = 'https://dicebanned.art/ihatepdf/photo/';

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  function createWindow() {
    const win = new BrowserWindow({
      width: 1360,
      height: 860,
      minWidth: 720,
      minHeight: 560,
      title: APP_TITLE,
      icon: path.join(__dirname, 'icon.png'),
      backgroundColor: '#1a1a2e',
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });

    const menu = Menu.buildFromTemplate([
      {
        label: APP_TITLE,
        submenu: [
          { label: 'Обновить', accelerator: 'CmdOrCtrl+R', click: () => win.loadURL(APP_URL) },
          { label: 'Открыть в браузере', click: () => shell.openExternal(APP_URL) },
          { type: 'separator' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'quit', label: 'Выход' }
        ]
      }
    ]);
    Menu.setApplicationMenu(menu);

    win.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    win.loadURL(APP_URL);
  }

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}
