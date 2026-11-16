function Header({ total, done, sum }) {
  return (
    <header>
      <h1 className="mb-2 text-center font-heading text-4xl font-bold text-brand">
        Bloomé
      </h1>
      <p className="text-center text-stone-500">Замовлення квітів</p>
      <p className="mb-5 text-center text-stone-600">
        Усього замовлень: {total} · Доставлено: {done} · Сума: {sum} грн
      </p>
    </header>
  );
}

export default Header;
