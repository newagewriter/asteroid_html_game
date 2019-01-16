const { app, BrowserWindow } = require('electron');

let win; 

app.on('ready', () => {
    win = new BrowserWindow({width: 800, height: 1000});
    win.loadFile('g2.html');

    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
});

// Zamknij, gdy wszystkie okna są zamknięte.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

app.openDevTools = function() {
    if (win) {
        win.webContents.openDevTools();
    }
};
