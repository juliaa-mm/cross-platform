import { BOUQUETS, formatOrderDate } from "@bloome/core";

export const ERROR_BAD_DATA = "Некоректні дані.";

function isId(value) {
    return (typeof value === "number" && Number.isFinite(value)) || typeof value === "string";
}

function withDateLabel(order) {
    return { ...order, dateLabel: formatOrderDate(order.date) };
}

// Обробники IPC над OrdersService. Модуль не підключає electron.
// Дані з рендер-процесу не можна вважати надійними, тому типи перевіряються тут.
export function createHandlers(service) {
    return {
        async list(query) {
            const orders = await service.list(typeof query === "string" ? query : "");
            return orders.map(withDateLabel);
        },

        async add(data) {
            if (
                data === null ||
                typeof data !== "object" ||
                typeof data.bouquetId !== "string" ||
                typeof data.recipient !== "string" ||
                typeof data.date !== "string" ||
                (data.card !== undefined && typeof data.card !== "string")
            ) {
                return { ok: false, error: ERROR_BAD_DATA };
            }
            const result = await service.add({
                bouquetId: data.bouquetId,
                recipient: data.recipient,
                date: data.date,
                card: data.card,
            });
            return result.ok ? { ok: true, order: withDateLabel(result.order) } : result;
        },

        async remove(id) {
            if (!isId(id)) {
                return { ok: false, error: ERROR_BAD_DATA };
            }
            return service.remove(id);
        },

        async toggle(id) {
            if (!isId(id)) {
                return { ok: false, error: ERROR_BAD_DATA };
            }
            const result = await service.toggleDone(id);
            return result.ok ? { ok: true, order: withDateLabel(result.order) } : result;
        },

        async stats() {
            return service.stats();
        },

        async bouquets() {
            return BOUQUETS.map((bouquet) => ({ ...bouquet }));
        },
    };
}
