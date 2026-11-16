import { useEffect, useState } from "react";
import Header from "./components/Header";
import OrderForm from "./components/OrderForm";
import SearchBar from "./components/SearchBar";
import OrderList from "./components/OrderList";
import { BOUQUETS } from "./data/bouquets";

const STORAGE_KEY = "bloome-orders";

function loadOrders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// сьогоднішня дата у форматі РРРР-ММ-ДД (за місцевим часом)
function getToday() {
  return new Date().toLocaleDateString("sv-SE");
}

function App() {
  const [orders, setOrders] = useState(loadOrders);
  const [message, setMessage] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  function addOrder({ bouquetId, recipient, date, card }) {
    const recipientText = recipient.trim();

    if (recipientText === "") {
      setMessage({ text: "Вкажіть ім'я отримувача.", type: "error" });
      return false;
    }
    if (date === "") {
      setMessage({ text: "Оберіть дату доставки.", type: "error" });
      return false;
    }
    if (date < getToday()) {
      setMessage({
        text: "Дата доставки не може бути в минулому.",
        type: "error",
      });
      return false;
    }

    const bouquet = BOUQUETS.find((item) => item.id === bouquetId);
    const newOrder = {
      id: Date.now(),
      bouquetName: bouquet.name,
      price: bouquet.price,
      recipient: recipientText,
      date,
      card: card.trim(),
      done: false,
    };

    setOrders([...orders, newOrder]);
    setMessage({ text: "Замовлення додано.", type: "success" });
    return true;
  }

  function toggleOrder(id) {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, done: !order.done } : order,
      ),
    );
  }

  function deleteOrder(id) {
    setOrders(orders.filter((order) => order.id !== id));
    setMessage({ text: "Замовлення видалено.", type: "success" });
  }

  const doneCount = orders.filter((order) => order.done).length;
  const sum = orders.reduce((total, order) => total + order.price, 0);

  // відфільтрований список обчислюється під час відображення
  const search = query.trim().toLowerCase();
  const visibleOrders = orders.filter((order) =>
    (order.recipient + " " + order.bouquetName).toLowerCase().includes(search),
  );

  return (
    <div className="min-h-screen bg-blush px-4 py-8 text-ink">
      <main className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-lg">
        <Header total={orders.length} done={doneCount} sum={sum} />
        <OrderForm onAdd={addOrder} />

        {message && (
          <p
            className={`mb-4 font-bold ${
              message.type === "error" ? "text-rose-600" : "text-emerald-700"
            }`}
          >
            {message.text}
          </p>
        )}

        <SearchBar query={query} onChange={setQuery} />
        <OrderList
          orders={visibleOrders}
          isFiltered={search !== ""}
          onToggle={toggleOrder}
          onDelete={deleteOrder}
        />
      </main>
    </div>
  );
}

export default App;
