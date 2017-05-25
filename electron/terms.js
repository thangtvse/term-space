const { ipcMain } = require("electron");
const pty = require("node-pty");
const _ = require("lodash");
module.exports = win => {
    const shells = {};

    ipcMain.on("create-term", (event, { token, shellOptions }) => {
        const shell = pty.spawn(
      process.platform === "win32" ? "cmd.exe" : "bash",
      [],
      _.assign(
          {
              cwd: process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]
          },
        shellOptions
      )
    );
        shells[shell.pid] = shell;

        win.webContents.send("term-id", {
            token,
            termId: shell.pid
        });

        shell.on("data", data => {
            win.webContents.send("shell-data", {
                termId: shell.pid,
                data
            });
        });
    });

    ipcMain.on("term-input", (event, { shellId, data }) => {
        const shell = shells[shellId];
        shell.write(data);
    });

    ipcMain.on("term-close", (event, shellId) => {
        let shell = shells[shellId];
        shell.kill();
        shell = null;
        delete shells[shellId];
    });

    ipcMain.on("term-resize", (event, { shellId, cols, rows }) => {
        let shell = shells[shellId];
        shell.resize(cols, rows);
    });
};
