const { app, BrowserWindow, ipcMain } = require('electron');

let win; 
var userScores = [];
var lastScore = 0;
var userName = null;

// In main process.
ipcMain.on('action-send', (event, arg) => {
    console.log(arg) // prints "ping"
    if (arg == "start") {
        relodWindow("scr/game/game.html");
    } else {
        win.close();
    }
});

ipcMain.on('gameover-action', (event, score) => {
    console.log("new score:" + score);
    showScoreSite(score);
});

ipcMain.on('set-username', (event, arg) => {
    console.log("new username:" + arg);
    userName = arg;
});

app.on('ready', createWindow);

// Zamknij, gdy wszystkie okna są zamknięte.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
})  

app.openDevTools = function() {
    if (win) {
        win.webContents.openDevTools();
    }
};
app.getUserName = function() {
    console.log("username:" + userName);
    return userName;
};

app.getUserScores = function() {
    return userScores;
};

app.getLastScore = function() {
    return lastScore;
};

function createWindow() {
    win = new BrowserWindow({width: 1400, height: 1000});
    win.loadFile('scr/menu/menu.html');
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

function relodWindow(filePath) {
    if (win) {
        win.loadFile(filePath);
    }
}

function showScoreSite(newScore) {
    lastScore = newScore;
    userScores.push({
        score: lastScore,
        userName: userName
    });
    userScores = userScores.sort((x1, x2) => x2.score - x1.score );
    relodWindow("scr/endscreen/endscreen.html");
}
