import { OrderStorageAdapter } from "@bloome/core";

const STORAGE_KEY = "bloome-orders";

// Веб-адаптер: зберігає замовлення в localStorage у форматі JSON.
// Сховище передається в конструктор, тому його можна підставити в тестах.
export class LocalStorageAdapter extends OrderStorageAdapter {
    constructor(storage = globalThis.localStorage) {
        super();
        this.storage = storage;
    }

    async load() {
        try {
            const saved = this.storage.getItem(STORAGE_KEY);
            if (saved === null) {
                return [];
            }
            const data = JSON.parse(saved);
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    async save(orders) {
        this.storage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }
}
