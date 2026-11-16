import { test } from "node:test";
import assert from "node:assert/strict";
import {
    createOrder,
    formatOrderDate,
    getToday,
    sortOrdersByDate,
    filterOrdersByQuery,
    sanitizeOrders,
    calcStats,
    BOUQUETS,
} from "../index.js";

const NOW = new Date(2026, 10, 15, 12, 0, 0);

function makeOrder(id, date, recipient = "Олена") {
    return {
        id,
        bouquetName: "«Ранкова обіцянка»",
        price: 450,
        recipient,
        date,
        card: "",
        done: false,
    };
}

test("createOrder обрізає пробіли та зберігає дату створення", () => {
    const order = createOrder(
        { id: 1, bouquet: BOUQUETS[0], recipient: "  Олена  ", date: "2026-12-01", card: "  Привіт  " },
        NOW
    );
    assert.equal(order.recipient, "Олена");
    assert.equal(order.card, "Привіт");
    assert.equal(order.bouquetName, BOUQUETS[0].name);
    assert.equal(order.price, BOUQUETS[0].price);
    assert.equal(order.done, false);
    assert.equal(order.createdAt, NOW.toISOString());
});

test("getToday повертає дату у форматі РРРР-ММ-ДД", () => {
    assert.equal(getToday(NOW), "2026-11-15");
    assert.equal(getToday(new Date(2026, 0, 5)), "2026-01-05");
});

test("formatOrderDate форматує дату як дд.мм.рррр", () => {
    assert.equal(formatOrderDate("2026-12-01"), "01.12.2026");
});

test("formatOrderDate повертає порожній рядок для некоректної дати", () => {
    assert.equal(formatOrderDate("не дата"), "");
    assert.equal(formatOrderDate("2026-13-40"), "");
    assert.equal(formatOrderDate(undefined), "");
});

test("sortOrdersByDate ставить найближчі дати першими й не змінює вихідний масив", () => {
    const orders = [makeOrder(1, "2026-12-20"), makeOrder(2, "2026-11-20"), makeOrder(3, "2026-12-01")];
    const sorted = sortOrdersByDate(orders);
    assert.deepEqual(sorted.map((o) => o.id), [2, 3, 1]);
    assert.deepEqual(orders.map((o) => o.id), [1, 2, 3]);
});

test("sortOrdersByDate для однакової дати ставить новіші замовлення першими", () => {
    const orders = [makeOrder(1, "2026-12-01"), makeOrder(2, "2026-12-01")];
    assert.deepEqual(sortOrdersByDate(orders).map((o) => o.id), [2, 1]);
});

test("filterOrdersByQuery шукає без урахування регістру; порожній запит повертає все", () => {
    const orders = [makeOrder(1, "2026-12-01", "Олена"), makeOrder(2, "2026-12-02", "Максим")];
    assert.deepEqual(filterOrdersByQuery(orders, "ОЛЕ").map((o) => o.id), [1]);
    assert.equal(filterOrdersByQuery(orders, "").length, 2);
    assert.equal(filterOrdersByQuery(orders, "немає такого").length, 0);
});

test("sanitizeOrders відкидає некоректні записи", () => {
    const good = makeOrder(1, "2026-12-01");
    const result = sanitizeOrders([good, null, 5, { id: "x" }, { ...good, date: "bad" }]);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
    assert.deepEqual(sanitizeOrders("не масив"), []);
});

test("calcStats рахує кількість, доставлені та суму", () => {
    const orders = [makeOrder(1, "2026-12-01"), { ...makeOrder(2, "2026-12-02"), done: true, price: 890 }];
    assert.deepEqual(calcStats(orders), { total: 2, done: 1, sum: 1340 });
    assert.deepEqual(calcStats([]), { total: 0, done: 0, sum: 0 });
});
