import { useState } from "react";
import { BOUQUETS } from "../data/bouquets";

const fieldClass =
  "w-full rounded-lg border border-brand/40 bg-white px-4 py-3 text-base focus:border-brand focus:outline-none";

function OrderForm({ onAdd }) {
  const [bouquetId, setBouquetId] = useState(BOUQUETS[0].id);
  const [recipient, setRecipient] = useState("");
  const [date, setDate] = useState("");
  const [card, setCard] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const added = onAdd({ bouquetId, recipient, date, card });
    if (added) {
      setRecipient("");
      setDate("");
      setCard("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="bouquet" className="mb-1 block text-sm text-stone-500">
          Букет
        </label>
        <select
          id="bouquet"
          className={fieldClass}
          value={bouquetId}
          onChange={(event) => setBouquetId(event.target.value)}
        >
          {BOUQUETS.map((bouquet) => (
            <option key={bouquet.id} value={bouquet.id}>
              {bouquet.name} - {bouquet.price} грн
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="mb-1 block text-sm text-stone-500">
          Дата доставки
        </label>
        <input
          id="date"
          type="date"
          className={fieldClass}
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="recipient" className="mb-1 block text-sm text-stone-500">
          Ім'я отримувача
        </label>
        <input
          id="recipient"
          type="text"
          className={fieldClass}
          placeholder="Наприклад, Олена"
          aria-label="Ім'я отримувача"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="card" className="mb-1 block text-sm text-stone-500">
          Текст листівки (необов'язково)
        </label>
        <input
          id="card"
          type="text"
          className={fieldClass}
          placeholder="З днем народження!"
          value={card}
          onChange={(event) => setCard(event.target.value)}
        />
      </div>

      <button
        type="submit"
        className="cursor-pointer rounded-lg bg-brand px-5 py-3 text-base text-white hover:bg-brand-dark sm:col-span-2"
      >
        Додати замовлення
      </button>
    </form>
  );
}

export default OrderForm;
