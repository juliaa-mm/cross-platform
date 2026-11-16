import { validateOrderData } from "./orderValidation.js";
import { findBouquet } from "./bouquets.js";
import {
    calcStats,
    createOrder,
    filterOrdersByQuery,
    getToday,
    sanitizeOrders,
    sortOrdersByDate,
} from "./orderUtils.js";

export const ERROR_BOUQUET = "Оберіть букет зі списку.";
export const ERROR_NOT_FOUND = "Замовлення не знайдено.";

// Сервіс отримує адаптер ззовні (dependency injection),
// тому однаково працює в браузері, в Electron і в тестах.
export class OrdersService {
    constructor(adapter, getNow = () => new Date()) {
        this.adapter = adapter;
        this.getNow = getNow;
    }

    async loadAll() {
        return sanitizeOrders(await this.adapter.load());
    }

    async list(query) {
        const orders = await this.loadAll();
        const text = typeof query === "string" ? query : "";
        return sortOrdersByDate(filterOrdersByQuery(orders, text));
    }

    async add(data) {
        const now = this.getNow();
        const check = validateOrderData(data, getToday(now));
        if (!check.isValid) {
            return { ok: false, error: check.error };
        }

        const bouquet = findBouquet(data.bouquetId);
        if (!bouquet) {
            return { ok: false, error: ERROR_BOUQUET };
        }

        const orders = await this.loadAll();
        const usedIds = new Set(orders.map((order) => order.id));
        let id = now.getTime();
        while (usedIds.has(id)) {
            id += 1;
        }

        const order = createOrder(
            {
                id,
                bouquet,
                recipient: data.recipient,
                date: data.date,
                card: data.card,
            },
            now
        );
        orders.push(order);
        await this.adapter.save(orders);
        return { ok: true, order };
    }

    async remove(id) {
        const orders = await this.loadAll();
        const index = orders.findIndex((order) => String(order.id) === String(id));
        if (index === -1) {
            return { ok: false, error: ERROR_NOT_FOUND };
        }
        orders.splice(index, 1);
        await this.adapter.save(orders);
        return { ok: true };
    }

    // Позначка «Доставлено».
    async toggleDone(id) {
        const orders = await this.loadAll();
        const order = orders.find((item) => String(item.id) === String(id));
        if (!order) {
            return { ok: false, error: ERROR_NOT_FOUND };
        }
        order.done = !order.done;
        await this.adapter.save(orders);
        return { ok: true, order };
    }

    async stats() {
        return calcStats(await this.loadAll());
    }
}
