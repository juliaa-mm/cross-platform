import { test } from "node:test";
import assert from "node:assert/strict";
import { OrdersService, MemoryStorageAdapter, OrderStorageAdapter } from "../index.js";

const NOW = new Date(2026, 10, 15, 12, 0, 0);
const FUTURE = "2026-12-01";

function makeService(initial = []) {
    const adapter = new MemoryStorageAdapter(initial);
    return { adapter, service: new OrdersService(adapter, () => NOW) };
}

const validData = { bouquetId: "morning", recipient: "Олена", date: FUTURE, card: "Привіт" };

test("add зберігає замовлення в адаптері", async () => {
    const { adapter, service } = makeService();
    const result = await service.add(validData);
    assert.equal(result.ok, true);
    assert.equal(result.order.recipient, "Олена");
    assert.equal((await adapter.load()).length, 1);
});

test("add не зберігає некоректні дані й повертає повідомлення про помилку", async () => {
    const { adapter, service } = makeService();
    const result = await service.add({ ...validData, recipient: "   " });
    assert.equal(result.ok, false);
    assert.equal(typeof result.error, "string");
    assert.equal((await adapter.load()).length, 0);
});

test("add відхиляє дату в минулому", async () => {
    const { service } = makeService();
    const result = await service.add({ ...validData, date: "2026-11-14" });
    assert.equal(result.ok, false);
});

test("add відхиляє невідомий букет", async () => {
    const { service } = makeService();
    const result = await service.add({ ...validData, bouquetId: "unknown" });
    assert.equal(result.ok, false);
});

test("add видає унікальні id навіть за однакового часу", async () => {
    const { service } = makeService();
    const first = await service.add(validData);
    const second = await service.add(validData);
    assert.notEqual(first.order.id, second.order.id);
});

test("remove видаляє замовлення за id", async () => {
    const { adapter, service } = makeService();
    const { order } = await service.add(validData);
    const result = await service.remove(order.id);
    assert.equal(result.ok, true);
    assert.equal((await adapter.load()).length, 0);
});

test("remove повідомляє, якщо замовлення немає", async () => {
    const { service } = makeService();
    const result = await service.remove(999);
    assert.equal(result.ok, false);
    assert.equal(typeof result.error, "string");
});

test("toggleDone змінює позначку «Доставлено» туди й назад", async () => {
    const { service } = makeService();
    const { order } = await service.add(validData);
    assert.equal((await service.toggleDone(order.id)).order.done, true);
    assert.equal((await service.toggleDone(order.id)).order.done, false);
    assert.equal((await service.toggleDone(12345)).ok, false);
});

test("list повертає замовлення від найближчої дати й підтримує пошук", async () => {
    const { service } = makeService();
    await service.add({ ...validData, recipient: "Олена", date: "2026-12-20" });
    await service.add({ ...validData, recipient: "Максим", date: "2026-12-01" });
    const all = await service.list();
    assert.deepEqual(all.map((o) => o.recipient), ["Максим", "Олена"]);
    const found = await service.list("олен");
    assert.equal(found.length, 1);
    assert.equal(found[0].recipient, "Олена");
});

test("list ігнорує пошкоджені записи в сховищі", async () => {
    const good = {
        id: 1, bouquetName: "«Пудрова мрія»", price: 1050,
        recipient: "Олена", date: FUTURE, card: "", done: false,
    };
    const { service } = makeService([good, null, { id: "bad" }]);
    assert.equal((await service.list()).length, 1);
});

test("stats рахує кількість, доставлені та суму", async () => {
    const { service } = makeService();
    const first = await service.add(validData);
    await service.add({ ...validData, bouquetId: "velvet" });
    await service.toggleDone(first.order.id);
    assert.deepEqual(await service.stats(), { total: 2, done: 1, sum: 1340 });
});

test("базовий адаптер кидає помилку, поки методи не реалізовано", async () => {
    const adapter = new OrderStorageAdapter();
    await assert.rejects(() => adapter.load());
    await assert.rejects(() => adapter.save([]));
});
