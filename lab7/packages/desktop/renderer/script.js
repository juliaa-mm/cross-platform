// Рендер-процес не має доступу до Node.js.
// Усі дії виконуються через window.ordersAPI (preload.cjs), правил перевірки тут немає.
const api = window.ordersAPI;
const ADDED_TEXT = "Замовлення додано та збережено у файл.";

const navButtons = document.querySelectorAll(".nav-btn");
const tabs = document.querySelectorAll(".tab");
const ordersBadge = document.getElementById("ordersBadge");
const popularList = document.getElementById("popularList");
const catalogList = document.getElementById("catalogList");
const bouquetChips = document.getElementById("bouquetChips");
const recipientInput = document.getElementById("recipientInput");
const dateInput = document.getElementById("dateInput");
const cardInput = document.getElementById("cardInput");
const addOrderButton = document.getElementById("addOrderButton");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");
const ordersList = document.getElementById("ordersList");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");
const sumValue = document.getElementById("sumValue");

let bouquets = [];
let selectedBouquetId = "";

function showTab(name) {
    tabs.forEach((tab) => {
        tab.classList.toggle("hidden", tab.id !== "tab-" + name);
    });
    navButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === name);
    });
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = "message message--" + type;
}

function orderBouquet(id) {
    selectedBouquetId = id;
    renderChips();
    showTab("orders");
}

function createBouquetCard(bouquet) {
    const card = document.createElement("article");
    card.className = "bouquet";

    const photo = document.createElement("img");
    photo.className = "bouquet__photo";
    photo.src = bouquet.image;
    photo.alt = bouquet.name;

    const body = document.createElement("div");
    body.className = "bouquet__body";

    const badge = document.createElement("span");
    badge.className = "bouquet__badge";
    badge.textContent = bouquet.flowers;

    const name = document.createElement("h4");
    name.className = "bouquet__name";
    name.textContent = bouquet.name;

    const price = document.createElement("p");
    price.className = "bouquet__price";
    price.textContent = bouquet.price + " грн";

    const button = document.createElement("button");
    button.className = "pill pill--filled";
    button.textContent = "Замовити";
    button.addEventListener("click", () => orderBouquet(bouquet.id));

    body.append(badge, name, price, button);
    card.append(photo, body);
    return card;
}

function renderBouquets() {
    bouquets.forEach((bouquet, index) => {
        if (index < 5) {
            popularList.appendChild(createBouquetCard(bouquet));
        }
        catalogList.appendChild(createBouquetCard(bouquet));
    });
}

function renderChips() {
    bouquetChips.innerHTML = "";
    bouquets.forEach((bouquet) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip" + (bouquet.id === selectedBouquetId ? " chip--selected" : "");

        const name = document.createElement("span");
        name.textContent = bouquet.name;
        const price = document.createElement("strong");
        price.textContent = bouquet.price + " грн";

        chip.append(name, price);
        chip.addEventListener("click", () => {
            selectedBouquetId = bouquet.id;
            renderChips();
        });
        bouquetChips.appendChild(chip);
    });
}

function createOrderElement(order) {
    const item = document.createElement("li");
    item.className = "order-item" + (order.done ? " order-item--done" : "");

    const label = document.createElement("label");
    label.className = "order-item__label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = order.done;
    checkbox.addEventListener("change", async () => {
        await api.toggle(order.id);
        await renderOrders();
    });

    const text = document.createElement("span");
    text.className = "order-item__text";

    const lines = [
        order.bouquetName + " · " + order.price + " грн",
        "Отримувач: " + order.recipient,
        "Дата доставки: " + order.dateLabel,
    ];
    if (order.card !== "") {
        lines.push("Листівка: " + order.card);
    }
    lines.forEach((line, index) => {
        const row = document.createElement("span");
        row.className = index === 0 ? "order-item__title" : "order-item__info";
        row.textContent = line;
        text.appendChild(row);
    });

    label.append(checkbox, text);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Видалити";
    deleteButton.addEventListener("click", async () => {
        await api.remove(order.id);
        showMessage("Замовлення видалено.", "error");
        await renderOrders();
    });

    item.append(label, deleteButton);
    return item;
}

async function renderOrders() {
    const orders = await api.list(searchInput.value);
    ordersList.innerHTML = "";

    if (orders.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent =
            searchInput.value.trim() !== ""
                ? "За вашим запитом нічого не знайдено."
                : "Замовлень поки немає. Додайте перше!";
        ordersList.appendChild(empty);
    } else {
        orders.forEach((order) => ordersList.appendChild(createOrderElement(order)));
    }

    const stats = await api.stats();
    totalCount.textContent = stats.total;
    doneCount.textContent = stats.done;
    sumValue.textContent = stats.sum;
    ordersBadge.textContent = stats.total;
    ordersBadge.classList.toggle("hidden", stats.total === 0);
}

async function addOrder() {
    const result = await api.add({
        bouquetId: selectedBouquetId,
        recipient: recipientInput.value,
        date: dateInput.value,
        card: cardInput.value,
    });

    if (!result.ok) {
        showMessage(result.error, "error");
        return;
    }

    recipientInput.value = "";
    dateInput.value = "";
    cardInput.value = "";
    showMessage(ADDED_TEXT, "success");
    await renderOrders();
}

navButtons.forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.tab));
});
document.getElementById("goCatalog").addEventListener("click", () => showTab("catalog"));
document.getElementById("goOrders").addEventListener("click", () => showTab("orders"));
addOrderButton.addEventListener("click", addOrder);
[recipientInput, cardInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addOrder();
        }
    });
});
searchInput.addEventListener("input", renderOrders);

async function init() {
    bouquets = await api.bouquets();
    selectedBouquetId = bouquets[0].id;
    renderBouquets();
    renderChips();
    await renderOrders();
}

init();
