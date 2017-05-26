const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

const config = require("./config/electron");

let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600
    });

    require("./electron/menu")(win);

    if (config.mode === "production") {
        win.loadURL(
      url.format({
          pathname: path.join(__dirname, "build", "index.html"),
          protocol: "file:",
          slashes: true
      })
    );
    } else {
        win.loadURL(config.reactDevHost);
        win.webContents.openDevTools();
    }

    require("./electron/terms")(win);

    win.on("closed", () => {
        win = null;
    });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("active", () => {
    if (win === null) {
        createWindow();
    }
});
