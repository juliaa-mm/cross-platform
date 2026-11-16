const { contextBridge, ipcRenderer } = require("electron");

// Сторінка отримує лише ці функції, а не весь ipcRenderer чи Node.js.
contextBridge.exposeInMainWorld("ordersAPI", {
    list: (query) => ipcRenderer.invoke("orders:list", query),
    add: (data) => ipcRenderer.invoke("orders:add", data),
    remove: (id) => ipcRenderer.invoke("orders:remove", id),
    toggle: (id) => ipcRenderer.invoke("orders:toggle", id),
    stats: () => ipcRenderer.invoke("orders:stats"),
    bouquets: () => ipcRenderer.invoke("orders:bouquets"),
});
