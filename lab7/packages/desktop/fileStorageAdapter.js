import fs from "node:fs/promises";
import path from "node:path";
import { OrderStorageAdapter } from "@bloome/core";

// Десктопний адаптер: зберігає замовлення у JSON-файлі.
// Модуль не підключає electron, тому його можна тестувати звичайним node --test.
export class FileStorageAdapter extends OrderStorageAdapter {
    constructor(filePath) {
        super();
        this.filePath = filePath;
    }

    async load() {
        try {
            const content = await fs.readFile(this.filePath, "utf-8");
            const data = JSON.parse(content);
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    async save(orders) {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.writeFile(this.filePath, JSON.stringify(orders, null, 2), "utf-8");
    }
}
