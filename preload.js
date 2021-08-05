const { contextBridge, ipcRenderer } = require('electron');
//let mainWin = require('./main');

contextBridge.exposeInMainWorld('electron', {
    messageBox: (message) => ipcRenderer.send('message-box', message)
});