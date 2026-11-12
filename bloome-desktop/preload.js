const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ordersAPI", {
    loadOrders: () => ipcRenderer.invoke("orders:load"),
    saveOrders: (orders) => ipcRenderer.invoke("orders:save", orders),
});
