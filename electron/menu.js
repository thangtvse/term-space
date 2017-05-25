const { Menu } = require("electron");

module.exports = win => {
    const template = [
        {
            label: "File",
            submenu: [
                {
                    label: "New terminal",
                    click() {
                        win.webContents.send("new-term");
                    }
                },
                {
                    role: "quit"
                }
            ]
        },
        {
            label: "Edit",
            submenu: [
                {
                    role: "undo"
                },
                {
                    role: "redo"
                },
                {
                    type: "separator"
                },
                {
                    role: "cut"
                },
                {
                    role: "copy"
                },
                {
                    role: "paste"
                },
                {
                    role: "pasteandmatchstyle"
                },
                {
                    role: "delete"
                },
                {
                    role: "selectall"
                }
            ]
        },
        {
            label: "View",
            submenu: [
                {
                    label: "Align horizontally",
                    click() {
                        win.webContents.send("align-horizontal");
                    }
                },
                {
                    role: "reload"
                },
                {
                    role: "forcereload"
                },
                {
                    role: "toggledevtools"
                },
                {
                    type: "separator"
                },
                {
                    role: "resetzoom"
                },
                {
                    role: "zoomin"
                },
                {
                    role: "zoomout"
                },
                {
                    type: "separator"
                },
                {
                    role: "togglefullscreen"
                }
            ]
        },
        {
            role: "window",
            submenu: [
                {
                    role: "minimize"
                },
                {
                    role: "close"
                }
            ]
        },
        {
            role: "help",
            submenu: [
                {
                    label: "Learn More",
                    click() {
                        require("electron").shell.openExternal("https://electron.atom.io");
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};
