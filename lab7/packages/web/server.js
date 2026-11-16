import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webDir = path.dirname(fileURLToPath(import.meta.url));
// Теку пакета ядра знаходимо за його іменем (через символьне посилання workspaces).
const coreDir = path.dirname(fileURLToPath(import.meta.resolve("@bloome/core")));

const WEB_FILES = new Set(["index.html", "script.js", "style.css", "localStorageAdapter.js"]);
const CORE_PREFIX = "/node_modules/@bloome/core/";
const CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
};

// Повертає шлях до файлу на диску або null, якщо файл віддавати не можна.
export function resolveFilePath(urlPath) {
    let pathname;
    try {
        pathname = decodeURIComponent(String(urlPath).split("?")[0]);
    } catch {
        return null;
    }
    if (pathname === "/") {
        pathname = "/index.html";
    }
    if (pathname.includes("..") || pathname.includes("\\")) {
        return null;
    }
    if (pathname.startsWith(CORE_PREFIX)) {
        const name = pathname.slice(CORE_PREFIX.length);
        return /^[A-Za-z]+\.js$/.test(name) ? path.join(coreDir, name) : null;
    }
    const name = pathname.slice(1);
    return WEB_FILES.has(name) ? path.join(webDir, name) : null;
}

export function createServer() {
    return http.createServer(async (req, res) => {
        const filePath = req.method === "GET" ? resolveFilePath(req.url) : null;
        if (!filePath) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Не знайдено");
            return;
        }
        try {
            const content = await fs.readFile(filePath);
            const type = CONTENT_TYPES[path.extname(filePath)] || "application/octet-stream";
            res.writeHead(200, { "Content-Type": type });
            res.end(content);
        } catch {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Не знайдено");
        }
    });
}

// Запускаємо сервер, лише якщо файл виконується напряму (а не імпортується в тестах).
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const port = process.env.PORT || 3000;
    createServer().listen(port, () => {
        console.log(`Веб-клієнт Bloomé запущено: http://localhost:${port}`);
    });
}
