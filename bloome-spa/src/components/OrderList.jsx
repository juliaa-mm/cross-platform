import OrderItem from "./OrderItem";

function OrderList({ orders, isFiltered, onToggle, onDelete }) {
  if (orders.length === 0) {
    return (
      <p className="text-center text-slate-500">
        {isFiltered
          ? "За вашим запитом нічого не знайдено."
          : "Замовлень поки немає. Додайте перше!"}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <OrderItem
          key={order.id}
          order={order}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default OrderList;
