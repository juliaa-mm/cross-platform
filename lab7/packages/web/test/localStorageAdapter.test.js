import { test } from "node:test";
import assert from "node:assert/strict";
import { OrdersService } from "@bloome/core";
import { LocalStorageAdapter } from "../localStorageAdapter.js";

// Підставний об'єкт замість браузерного localStorage (у Node.js його немає).
function fakeStorage(initial = {}) {
    const data = { ...initial };
    return {
        data,
        getItem: (key) => (key in data ? data[key] : null),
        setItem: (key, value) => {
            data[key] = String(value);
        },
    };
}

test("load повертає порожній масив, якщо сховище порожнє", async () => {
    const adapter = new LocalStorageAdapter(fakeStorage());
    assert.deepEqual(await adapter.load(), []);
});

test("save записує JSON, а load читає його назад", async () => {
    const storage = fakeStorage();
    const adapter = new LocalStorageAdapter(storage);
    const orders = [{ id: 1, recipient: "Олена" }];
    await adapter.save(orders);
    assert.equal(storage.data["bloome-orders"], JSON.stringify(orders));
    assert.deepEqual(await adapter.load(), orders);
});

test("load повертає [] для пошкодженого JSON та для не-масиву", async () => {
    const broken = new LocalStorageAdapter(fakeStorage({ "bloome-orders": "{не json" }));
    assert.deepEqual(await broken.load(), []);
    const notArray = new LocalStorageAdapter(fakeStorage({ "bloome-orders": '{"a":1}' }));
    assert.deepEqual(await notArray.load(), []);
});

test("адаптер працює зі спільним OrdersService", async () => {
    const now = new Date(2026, 10, 15, 12, 0, 0);
    const service = new OrdersService(new LocalStorageAdapter(fakeStorage()), () => now);
    const added = await service.add({
        bouquetId: "velvet",
        recipient: "Олена",
        date: "2026-12-01",
    });
    assert.equal(added.ok, true);
    const list = await service.list();
    assert.equal(list.length, 1);
    assert.equal(list[0].price, 890);
});
