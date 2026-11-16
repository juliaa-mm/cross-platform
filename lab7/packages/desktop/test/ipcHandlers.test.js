import { test } from "node:test";
import assert from "node:assert/strict";
import { OrdersService, MemoryStorageAdapter } from "@bloome/core";
import { createHandlers } from "../ipcHandlers.js";

const NOW = new Date(2026, 10, 15, 12, 0, 0);

function makeHandlers() {
    const service = new OrdersService(new MemoryStorageAdapter(), () => NOW);
    return createHandlers(service);
}

const validData = { bouquetId: "morning", recipient: "Олена", date: "2026-12-01", card: "Привіт" };

test("add додає замовлення й повертає поле dateLabel", async () => {
    const handlers = makeHandlers();
    const result = await handlers.add(validData);
    assert.equal(result.ok, true);
    assert.equal(result.order.dateLabel, "01.12.2026");
    assert.equal((await handlers.list("")).length, 1);
});

test("add відхиляє некоректні типи даних", async () => {
    const handlers = makeHandlers();
    assert.equal((await handlers.add(null)).ok, false);
    assert.equal((await handlers.add({ ...validData, recipient: 123 })).ok, false);
    assert.equal((await handlers.add({ ...validData, card: 5 })).ok, false);
    assert.equal((await handlers.list("")).length, 0);
});

test("add повертає помилку ядра для порожнього імені", async () => {
    const handlers = makeHandlers();
    const result = await handlers.add({ ...validData, recipient: "  " });
    assert.equal(result.ok, false);
    assert.equal(typeof result.error, "string");
});

test("list ігнорує запит неправильного типу, а рядковий запит фільтрує", async () => {
    const handlers = makeHandlers();
    await handlers.add(validData);
    await handlers.add({ ...validData, recipient: "Максим" });
    assert.equal((await handlers.list(123)).length, 2);
    const found = await handlers.list("макс");
    assert.equal(found.length, 1);
    assert.equal(found[0].recipient, "Максим");
});

test("remove приймає id як число або рядок", async () => {
    const handlers = makeHandlers();
    const first = await handlers.add(validData);
    const second = await handlers.add(validData);
    assert.equal((await handlers.remove(first.order.id)).ok, true);
    assert.equal((await handlers.remove(String(second.order.id))).ok, true);
    assert.equal((await handlers.remove({})).ok, false);
    assert.equal((await handlers.list("")).length, 0);
});

test("toggle змінює позначку «Доставлено», а stats рахує суму", async () => {
    const handlers = makeHandlers();
    const added = await handlers.add(validData);
    const toggled = await handlers.toggle(added.order.id);
    assert.equal(toggled.order.done, true);
    assert.deepEqual(await handlers.stats(), { total: 1, done: 1, sum: 450 });
    assert.equal((await handlers.toggle("abc")).ok, false);
});

test("bouquets повертає каталог з ядра", async () => {
    const bouquets = await makeHandlers().bouquets();
    assert.equal(bouquets.length, 10);
    assert.equal(bouquets[0].id, "morning");
});
