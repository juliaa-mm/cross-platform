// Чисті функції для роботи із замовленнями.
// Тут немає DOM, localStorage чи файлів.

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// Сьогоднішня дата у форматі РРРР-ММ-ДД (за місцевим часом).
export function getToday(now = new Date()) {
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

// Перевіряє, що рядок є справжньою датою у форматі РРРР-ММ-ДД.
export function isValidIsoDate(value) {
    if (typeof value !== "string") {
        return false;
    }
    const match = DATE_PATTERN.exec(value);
    if (!match) {
        return false;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

// РРРР-ММ-ДД -> ДД.ММ.РРРР. Для некоректної дати повертає порожній рядок.
export function formatOrderDate(value) {
    if (!isValidIsoDate(value)) {
        return "";
    }
    return value.split("-").reverse().join(".");
}

// Створює об'єкт замовлення. Назву й ціну букета записуємо в момент створення.
export function createOrder({ id, bouquet, recipient, date, card }, now = new Date()) {
    return {
        id,
        bouquetName: bouquet.name,
        price: bouquet.price,
        recipient: recipient.trim(),
        date,
        card: (card || "").trim(),
        done: false,
        createdAt: now.toISOString(),
    };
}

// Спочатку найближчі дати доставки. Вихідний масив не змінюється.
export function sortOrdersByDate(orders) {
    return [...orders].sort((a, b) => {
        if (a.date !== b.date) {
            return a.date < b.date ? -1 : 1;
        }
        return b.id - a.id;
    });
}

// Пошук за отримувачем, букетом і листівкою без урахування регістру.
export function filterOrdersByQuery(orders, query) {
    const text = typeof query === "string" ? query.trim().toLowerCase() : "";
    if (text === "") {
        return [...orders];
    }
    return orders.filter((order) =>
        `${order.recipient} ${order.bouquetName} ${order.card}`
            .toLowerCase()
            .includes(text)
    );
}

function isStoredOrder(item) {
    return (
        item !== null &&
        typeof item === "object" &&
        Number.isFinite(item.id) &&
        typeof item.bouquetName === "string" &&
        Number.isFinite(item.price) &&
        typeof item.recipient === "string" &&
        isValidIsoDate(item.date) &&
        typeof item.done === "boolean"
    );
}

// Відкидає некоректні записи зі сховища.
export function sanitizeOrders(data) {
    if (!Array.isArray(data)) {
        return [];
    }
    return data.filter(isStoredOrder).map((order) => ({
        ...order,
        card: typeof order.card === "string" ? order.card : "",
    }));
}

// Лічильники для шапки: усього, доставлено, сума.
export function calcStats(orders) {
    return {
        total: orders.length,
        done: orders.filter((order) => order.done).length,
        sum: orders.reduce((total, order) => total + order.price, 0),
    };
}
