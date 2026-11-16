import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OrdersService } from "@bloome/core";
import { FileStorageAdapter } from "./fileStorageAdapter.js";
import { createHandlers } from "./ipcHandlers.js";

// У модулях ES немає __dirname, теку файлу беремо з import.meta.url.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WINDOW_TITLE = "Bloomé Desktop: замовлення";

function createWindow() {
    const win = new BrowserWindow({
        width: 1100,
        height: 760,
        minWidth: 800,
        minHeight: 600,
        title: WINDOW_TITLE,
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // Заголовок вікна береться з main.js, а не з тега title сторінки.
    win.on("page-title-updated", (event) => event.preventDefault());
    win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.whenReady().then(() => {
    const filePath = path.join(app.getPath("userData"), "orders.json");
    const service = new OrdersService(new FileStorageAdapter(filePath));
    const handlers = createHandlers(service);

    ipcMain.handle("orders:list", (event, query) => handlers.list(query));
    ipcMain.handle("orders:add", (event, data) => handlers.add(data));
    ipcMain.handle("orders:remove", (event, id) => handlers.remove(id));
    ipcMain.handle("orders:toggle", (event, id) => handlers.toggle(id));
    ipcMain.handle("orders:stats", () => handlers.stats());
    ipcMain.handle("orders:bouquets", () => handlers.bouquets());

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
