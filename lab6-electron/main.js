const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

function getOrdersFilePath() {
    return path.join(app.getPath("userData"), "orders.json");
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1100,
        height: 760,
        minWidth: 800,
        minHeight: 600,
        title: "Bloomé Desktop: замовлення",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.on("page-title-updated", (event) => {
        event.preventDefault();
    });

    win.loadFile(path.join(__dirname, "renderer", "index.html"));
}
ipcMain.handle("orders:load", () => {
    try {
        const filePath = getOrdersFilePath();
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Помилка читання файлу:", error.message);
        return [];
    }
});

ipcMain.handle("orders:save", (event, orders) => {
    fs.writeFileSync(
        getOrdersFilePath(),
        JSON.stringify(orders, null, 2),
        "utf-8"
    );
    return true;
});

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
