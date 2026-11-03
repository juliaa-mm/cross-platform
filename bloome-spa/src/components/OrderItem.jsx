function formatDate(date) {
  return date.split("-").reverse().join(".");
}

function OrderItem({ order, onToggle, onDelete }) {
  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-xl p-4 max-sm:flex-col max-sm:items-start ${
        order.done ? "bg-emerald-100" : "bg-petal"
      }`}
    >
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1.5 accent-brand"
          checked={order.done}
          onChange={() => onToggle(order.id)}
        />
        <span className={order.done ? "text-slate-500 line-through" : "text-ink"}>
          <span className="block font-semibold">
            {order.bouquetName} · {order.price} грн
          </span>
          <span className="block text-sm">Отримувач: {order.recipient}</span>
          <span className="block text-sm">
            Дата доставки: {formatDate(order.date)}
          </span>
          {order.card && (
            <span className="block text-sm">Листівка: {order.card}</span>
          )}
        </span>
      </label>

      <button
        type="button"
        className="cursor-pointer rounded-lg bg-rose-500 px-3.5 py-2 text-white hover:bg-rose-700 max-sm:w-full"
        onClick={() => onDelete(order.id)}
      >
        Видалити
      </button>
    </li>
  );
}

export default OrderItem;
