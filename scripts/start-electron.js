const { app, BrowserWindow } = require("electron");

let mainWindow = null;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        height: 1024,
        width: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    mainWindow.webContents.openDevTools({ mode: "detach" });
    mainWindow.loadURL("http://localhost");
});