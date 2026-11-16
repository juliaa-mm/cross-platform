import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { OrdersService } from "@bloome/core";
import { FileStorageAdapter } from "../fileStorageAdapter.js";

async function makeTempFile() {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "bloome-"));
    return { dir, filePath: path.join(dir, "data", "orders.json") };
}

test("load повертає [], якщо файлу немає", async () => {
    const { dir, filePath } = await makeTempFile();
    try {
        assert.deepEqual(await new FileStorageAdapter(filePath).load(), []);
    } finally {
        await fs.rm(dir, { recursive: true, force: true });
    }
});

test("save створює теку та файл, load читає дані назад", async () => {
    const { dir, filePath } = await makeTempFile();
    try {
        const adapter = new FileStorageAdapter(filePath);
        const orders = [{ id: 1, recipient: "Олена" }];
        await adapter.save(orders);
        const raw = JSON.parse(await fs.readFile(filePath, "utf-8"));
        assert.deepEqual(raw, orders);
        assert.deepEqual(await adapter.load(), orders);
    } finally {
        await fs.rm(dir, { recursive: true, force: true });
    }
});

test("load повертає [] для пошкодженого файлу", async () => {
    const { dir, filePath } = await makeTempFile();
    try {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, "{не json", "utf-8");
        assert.deepEqual(await new FileStorageAdapter(filePath).load(), []);
    } finally {
        await fs.rm(dir, { recursive: true, force: true });
    }
});

test("адаптер працює зі спільним OrdersService", async () => {
    const { dir, filePath } = await makeTempFile();
    try {
        const now = new Date(2026, 10, 15, 12, 0, 0);
        const service = new OrdersService(new FileStorageAdapter(filePath), () => now);
        const added = await service.add({
            bouquetId: "powder",
            recipient: "Олена",
            date: "2026-12-01",
        });
        assert.equal(added.ok, true);
        const again = new OrdersService(new FileStorageAdapter(filePath), () => now);
        assert.equal((await again.list()).length, 1);
    } finally {
        await fs.rm(dir, { recursive: true, force: true });
    }
});
