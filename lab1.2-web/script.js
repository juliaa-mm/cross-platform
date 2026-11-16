const bouquetSelect = document.getElementById("bouquetSelect");
const recipientInput = document.getElementById("recipientInput");
const addOrderButton = document.getElementById("addOrderButton");
const ordersList = document.getElementById("ordersList");
const message = document.getElementById("message");

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}

function createOrderElement(bouquetText, recipientText) {
    const orderItem = document.createElement("li");
    orderItem.className = "order-item";

    const textWrapper = document.createElement("div");

    const bouquetSpan = document.createElement("span");
    bouquetSpan.className = "order-item__text";
    bouquetSpan.textContent = bouquetText;

    const recipientSpan = document.createElement("span");
    recipientSpan.className = "order-item__recipient";
    recipientSpan.textContent = "Отримувач: " + recipientText;

    textWrapper.appendChild(bouquetSpan);
    textWrapper.appendChild(recipientSpan);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Видалити";

    deleteButton.addEventListener("click", function () {
        orderItem.remove();
        showMessage("Замовлення видалено.", "#A6574E");
    });

    orderItem.appendChild(textWrapper);
    orderItem.appendChild(deleteButton);

    return orderItem;
}

function addOrder() {
    const recipientText = recipientInput.value.trim();

    if (recipientText === "") {
        showMessage("Будь ласка, вкажіть ім'я отримувача.", "#A6574E");
        return;
    }

    const bouquetText = bouquetSelect.value;
    const orderElement = createOrderElement(bouquetText, recipientText);
    ordersList.appendChild(orderElement);

    recipientInput.value = "";
    recipientInput.focus();

    showMessage("Замовлення додано до кошика.", "#6B7A4F");
}

addOrderButton.addEventListener("click", addOrder);

recipientInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addOrder();
    }
});