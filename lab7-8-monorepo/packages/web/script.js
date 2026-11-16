import { OrdersService, BOUQUETS, formatOrderDate } from "@bloome/core";
import { LocalStorageAdapter } from "./localStorageAdapter.js";

// Інтерфейс узято з ЛР 1.2. Власних перевірок тут немає:
// правила, пошук і сортування беруться зі спільного ядра.
const service = new OrdersService(new LocalStorageAdapter());

const catalogList = document.getElementById("catalogList");
const bouquetSelect = document.getElementById("bouquetSelect");
const recipientInput = document.getElementById("recipientInput");
const dateInput = document.getElementById("dateInput");
const cardInput = document.getElementById("cardInput");
const addOrderButton = document.getElementById("addOrderButton");
const searchInput = document.getElementById("searchInput");
const ordersList = document.getElementById("ordersList");
const message = document.getElementById("message");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");
const sumValue = document.getElementById("sumValue");
const catalogDots = document.getElementById("catalogDots");
const catalogPrev = document.getElementById("catalogPrev");
const catalogNext = document.getElementById("catalogNext");

const PAGE_SIZE = 6;

function showMessage(text, type) {
    message.textContent = text;
    message.className = "message message--" + type;
}

function createBouquetCard(bouquet) {
    const card = document.createElement("article");
    card.className = "bouquet";

    const photo = document.createElement("img");
    photo.className = "bouquet__photo";
    photo.src = bouquet.image;
    photo.alt = "Букет " + bouquet.name;

    const body = document.createElement("div");
    body.className = "bouquet__body";

    const badge = document.createElement("div");
    badge.className = "bouquet__badge";
    badge.textContent = bouquet.flowers;

    const name = document.createElement("h3");
    name.textContent = bouquet.name;

    const price = document.createElement("p");
    price.className = "bouquet__price";
    price.textContent = bouquet.price + " грн";

    body.appendChild(badge);
    body.appendChild(name);
    body.appendChild(price);
    card.appendChild(photo);
    card.appendChild(body);

    return card;
}

// Каталог розбито на сторінки по 6 букетів, їх можна гортати вправо.
function renderCatalog() {
    for (let start = 0; start < BOUQUETS.length; start += PAGE_SIZE) {
        const page = document.createElement("div");
        page.className = "catalog catalog-page";
        BOUQUETS.slice(start, start + PAGE_SIZE).forEach(function (bouquet) {
            page.appendChild(createBouquetCard(bouquet));
        });
        catalogList.appendChild(page);

        const dot = document.createElement("button");
        dot.className = "catalog-dot";
        dot.setAttribute("aria-label", "Сторінка каталогу " + (start / PAGE_SIZE + 1));
        dot.addEventListener("click", function () {
            showCatalogPage(start / PAGE_SIZE);
        });
        catalogDots.appendChild(dot);
    }

    BOUQUETS.forEach(function (bouquet) {
        const option = document.createElement("option");
        option.value = bouquet.id;
        option.textContent = bouquet.name + " — " + bouquet.price + " грн";
        bouquetSelect.appendChild(option);
    });
}

function getCatalogPage() {
    return Math.round(catalogList.scrollLeft / catalogList.clientWidth);
}

function showCatalogPage(index) {
    catalogList.scrollTo({ left: index * catalogList.clientWidth });
}

function updateCatalogControls() {
    const current = getCatalogPage();
    const dots = catalogDots.children;
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle("catalog-dot--active", i === current);
    }
    catalogPrev.disabled = current === 0;
    catalogNext.disabled = current === dots.length - 1;
}

function createOrderElement(order) {
    const orderItem = document.createElement("li");
    orderItem.className = "order-item" + (order.done ? " order-item--done" : "");

    const label = document.createElement("label");
    label.className = "order-item__label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = order.done;
    checkbox.addEventListener("change", async function () {
        await service.toggleDone(order.id);
        await renderOrders();
    });

    const textWrapper = document.createElement("div");

    const bouquetSpan = document.createElement("span");
    bouquetSpan.className = "order-item__text";
    bouquetSpan.textContent = order.bouquetName + " — " + order.price + " грн";
    textWrapper.appendChild(bouquetSpan);

    const lines = [
        "Отримувач: " + order.recipient,
        "Дата доставки: " + formatOrderDate(order.date),
    ];
    if (order.card !== "") {
        lines.push("Листівка: " + order.card);
    }
    lines.forEach(function (line) {
        const infoSpan = document.createElement("span");
        infoSpan.className = "order-item__recipient";
        infoSpan.textContent = line;
        textWrapper.appendChild(infoSpan);
    });

    label.appendChild(checkbox);
    label.appendChild(textWrapper);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Видалити";
    deleteButton.addEventListener("click", async function () {
        await service.remove(order.id);
        showMessage("Замовлення видалено.", "error");
        await renderOrders();
    });

    orderItem.appendChild(label);
    orderItem.appendChild(deleteButton);

    return orderItem;
}

async function renderOrders() {
    const orders = await service.list(searchInput.value);
    ordersList.innerHTML = "";

    if (orders.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent =
            searchInput.value.trim() !== ""
                ? "За вашим запитом нічого не знайдено."
                : "Кошик порожній. Додайте перше замовлення!";
        ordersList.appendChild(empty);
    } else {
        orders.forEach(function (order) {
            ordersList.appendChild(createOrderElement(order));
        });
    }

    const stats = await service.stats();
    totalCount.textContent = stats.total;
    doneCount.textContent = stats.done;
    sumValue.textContent = stats.sum;
}

async function addOrder() {
    const result = await service.add({
        bouquetId: bouquetSelect.value,
        recipient: recipientInput.value,
        date: dateInput.value,
        card: cardInput.value,
    });

    // Текст помилки приходить з ядра.
    if (!result.ok) {
        showMessage(result.error, "error");
        return;
    }

    recipientInput.value = "";
    dateInput.value = "";
    cardInput.value = "";
    recipientInput.focus();

    showMessage("Замовлення додано до кошика.", "success");
    await renderOrders();
}

addOrderButton.addEventListener("click", addOrder);

[recipientInput, cardInput].forEach(function (input) {
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addOrder();
        }
    });
});

searchInput.addEventListener("input", renderOrders);

catalogPrev.addEventListener("click", function () {
    showCatalogPage(getCatalogPage() - 1);
});
catalogNext.addEventListener("click", function () {
    showCatalogPage(getCatalogPage() + 1);
});
catalogList.addEventListener("scroll", updateCatalogControls);
window.addEventListener("resize", updateCatalogControls);

renderCatalog();
updateCatalogControls();
renderOrders();
