const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
let win;

function createWindow () {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js')
		},
		icon: 'src/icon.png'
	})
	//win.fullScreen();
	win.webContents.openDevTools();

	win.loadFile('src/index.html');
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
});

ipcMain.on('message-box', (event, message) => {
	dialog.showMessageBox(win, { message: message });
});
