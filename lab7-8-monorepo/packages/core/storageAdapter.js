// Інтерфейс адаптера збереження. Ядро знає тільки про ці два методи.
// Кожна платформа реалізує їх по-своєму.
export class OrderStorageAdapter {
    async load() {
        throw new Error("Метод load() не реалізовано.");
    }

    async save(orders) {
        throw new Error("Метод save() не реалізовано.");
    }
}

// Зберігає замовлення в пам'яті. Потрібен для тестів.
export class MemoryStorageAdapter extends OrderStorageAdapter {
    constructor(initial = []) {
        super();
        this.orders = [...initial];
    }

    async load() {
        return [...this.orders];
    }

    async save(orders) {
        this.orders = [...orders];
    }
}
