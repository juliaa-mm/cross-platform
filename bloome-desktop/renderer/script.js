const BOUQUETS = [
    {
        id: "morning",
        name: "«Ранкова обіцянка»",
        flowers: "Тюльпани",
        price: 450,
        image: "https://i.pinimg.com/736x/83/49/17/83491754ec84777b04b2ae711f165264.jpg",
    },
    {
        id: "velvet",
        name: "«Оксамитовий вечір»",
        flowers: "Троянди",
        price: 890,
        image: "https://i.pinimg.com/1200x/5f/d3/1e/5fd31ede61a822f34676600342eb5011.jpg",
    },
    {
        id: "powder",
        name: "«Пудрова мрія»",
        flowers: "Півонії",
        price: 1050,
        image: "https://i.pinimg.com/736x/fa/a9/04/faa9047c5b91df074ebc552a74d455d5.jpg",
    },
    {
        id: "summer",
        name: "«Літній ранок»",
        flowers: "Ромашки",
        price: 380,
        image: "https://i.pinimg.com/736x/46/d3/3d/46d33da6f28f755a16420f57bfb79660.jpg",
    },
    {
        id: "lavender",
        name: "«Лавандовий сон»",
        flowers: "Лаванда та еустома",
        price: 720,
        image: "https://i.pinimg.com/736x/31/8a/8f/318a8fca558bf345ebf6d38c75020c62.jpg",
    },
    {
        id: "sunrise",
        name: "«Ніжний світанок»",
        flowers: "Гортензії",
        price: 640,
        image: "https://i.pinimg.com/1200x/99/27/15/992715a0706e3a81b64eade296626e0a.jpg",
    },
    {
        id: "sunny",
        name: "«Сонячний настрій»",
        flowers: "Соняшники",
        price: 520,
        image: "https://i.pinimg.com/1200x/f6/ef/df/f6efdfa219cdab0b66c6530633a2619f.jpg",
    },
    {
        id: "cloud",
        name: "«Біла хмаринка»",
        flowers: "Білі троянди",
        price: 950,
        image: "https://i.pinimg.com/1200x/59/5e/26/595e26df6c21b9d5bd535b96c21ed0ed.jpg",
    },
    {
        id: "spring",
        name: "«Весняна свіжість»",
        flowers: "Нарциси",
        price: 410,
        image: "https://i.pinimg.com/736x/b3/6c/c9/b36cc961ffc3a1c66299839395ec7796.jpg",
    },
    {
        id: "pastel",
        name: "«Лілії»",
        flowers: "Лілії",
        price: 780,
        image: "https://i.pinimg.com/736x/32/58/21/3258211a9396deabd98ca8d3a00291c0.jpg",
    },
];

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
const message = document.getElementById("message");
const ordersList = document.getElementById("ordersList");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");
const sumValue = document.getElementById("sumValue");

let orders = [];
let selectedBouquetId = BOUQUETS[0].id;

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

function getToday() {
    return new Date().toLocaleDateString("sv-SE");
}

function formatDate(date) {
    return date.split("-").reverse().join(".");
}

function updateStats() {
    totalCount.textContent = orders.length;
    doneCount.textContent = orders.filter((order) => order.done).length;
    sumValue.textContent = orders.reduce((total, order) => total + order.price, 0);
    ordersBadge.textContent = orders.length;
    ordersBadge.classList.toggle("hidden", orders.length === 0);
}

async function saveOrders() {
    await window.ordersAPI.saveOrders(orders);
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

    body.appendChild(badge);
    body.appendChild(name);
    body.appendChild(price);
    body.appendChild(button);
    card.appendChild(photo);
    card.appendChild(body);

    return card;
}

function renderBouquets() {
    BOUQUETS.forEach((bouquet, index) => {
        if (index < 5) {
            popularList.appendChild(createBouquetCard(bouquet));
        }
        catalogList.appendChild(createBouquetCard(bouquet));
    });
}

function renderChips() {
    bouquetChips.innerHTML = "";

    BOUQUETS.forEach((bouquet) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip" + (bouquet.id === selectedBouquetId ? " chip--selected" : "");

        const name = document.createElement("span");
        name.textContent = bouquet.name;

        const price = document.createElement("strong");
        price.textContent = bouquet.price + " грн";

        chip.appendChild(name);
        chip.appendChild(price);
        chip.addEventListener("click", () => {
            selectedBouquetId = bouquet.id;
            renderChips();
        });

        bouquetChips.appendChild(chip);
    });
}

function renderOrders() {
    ordersList.innerHTML = "";

    if (orders.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "Замовлень поки немає. Додайте перше!";
        ordersList.appendChild(empty);
        updateStats();
        return;
    }

    orders.forEach((order) => {
        const item = document.createElement("li");
        item.className = "order-item" + (order.done ? " order-item--done" : "");

        const label = document.createElement("label");
        label.className = "order-item__label";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = order.done;
        checkbox.addEventListener("change", async () => {
            orders = orders.map((current) =>
                current.id === order.id ? { ...current, done: !current.done } : current
            );
            renderOrders();
            await saveOrders();
        });

        const text = document.createElement("span");
        text.className = "order-item__text";

        const title = document.createElement("span");
        title.className = "order-item__title";
        title.textContent = order.bouquetName + " · " + order.price + " грн";

        const recipient = document.createElement("span");
        recipient.className = "order-item__info";
        recipient.textContent = "Отримувач: " + order.recipient;

        const date = document.createElement("span");
        date.className = "order-item__info";
        date.textContent = "Дата доставки: " + formatDate(order.date);

        text.appendChild(title);
        text.appendChild(recipient);
        text.appendChild(date);

        if (order.card !== "") {
            const card = document.createElement("span");
            card.className = "order-item__info";
            card.textContent = "Листівка: " + order.card;
            text.appendChild(card);
        }

        label.appendChild(checkbox);
        label.appendChild(text);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Видалити";
        deleteButton.addEventListener("click", async () => {
            orders = orders.filter((current) => current.id !== order.id);
            renderOrders();
            showMessage("Замовлення видалено.", "error");
            await saveOrders();
        });

        item.appendChild(label);
        item.appendChild(deleteButton);
        ordersList.appendChild(item);
    });

    updateStats();
}

async function addOrder() {
    const recipientText = recipientInput.value.trim();
    const dateText = dateInput.value;

    if (recipientText === "") {
        showMessage("Вкажіть ім'я отримувача.", "error");
        return;
    }

    if (dateText === "") {
        showMessage("Оберіть дату доставки.", "error");
        return;
    }

    if (dateText < getToday()) {
        showMessage("Дата доставки не може бути в минулому.", "error");
        return;
    }

    const bouquet = BOUQUETS.find((item) => item.id === selectedBouquetId);

    const newOrder = {
        id: Date.now(),
        bouquetName: bouquet.name,
        price: bouquet.price,
        recipient: recipientText,
        date: dateText,
        card: cardInput.value.trim(),
        done: false,
    };

    orders.push(newOrder);

    recipientInput.value = "";
    dateInput.value = "";
    cardInput.value = "";

    renderOrders();
    await saveOrders();
    showMessage("Замовлення додано та збережено у файл.", "success");
}

navButtons.forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.tab));
});

document.getElementById("goCatalog").addEventListener("click", () => showTab("catalog"));
document.getElementById("goOrders").addEventListener("click", () => showTab("orders"));

addOrderButton.addEventListener("click", addOrder);

recipientInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addOrder();
    }
});

cardInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addOrder();
    }
});

renderBouquets();
renderChips();

document.addEventListener("DOMContentLoaded", async () => {
    orders = await window.ordersAPI.loadOrders();
    renderOrders();
});
