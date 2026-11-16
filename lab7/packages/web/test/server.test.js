import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer, resolveFilePath } from "../server.js";

test("resolveFilePath: головна сторінка та файли ядра дозволені", () => {
    assert.ok(resolveFilePath("/")?.endsWith("index.html"));
    assert.ok(resolveFilePath("/script.js")?.endsWith("script.js"));
    assert.ok(resolveFilePath("/node_modules/@bloome/core/index.js")?.endsWith("index.js"));
    assert.ok(resolveFilePath("/node_modules/@bloome/core/orderUtils.js")?.endsWith("orderUtils.js"));
});

test("resolveFilePath: вихід за межі теки та серверні файли заборонені", () => {
    assert.equal(resolveFilePath("/server.js"), null);
    assert.equal(resolveFilePath("/package.json"), null);
    assert.equal(resolveFilePath("/test/server.test.js"), null);
    assert.equal(resolveFilePath("/node_modules/@bloome/core/../package.json"), null);
    assert.equal(resolveFilePath("/node_modules/@bloome/core/package.json"), null);
    assert.equal(resolveFilePath("/node_modules/@bloome/core/test/orderUtils.test.js"), null);
});

test("сервер віддає index.html і модуль ядра з правильними типами", async () => {
    const server = createServer();
    await new Promise((resolve) => server.listen(0, resolve));
    const base = `http://localhost:${server.address().port}`;
    try {
        const page = await fetch(base + "/");
        assert.equal(page.status, 200);
        assert.match(page.headers.get("content-type"), /text\/html/);

        const core = await fetch(base + "/node_modules/@bloome/core/index.js");
        assert.equal(core.status, 200);
        assert.match(core.headers.get("content-type"), /text\/javascript/);

        const secret = await fetch(base + "/server.js");
        assert.equal(secret.status, 404);
    } finally {
        server.close();
    }
});
