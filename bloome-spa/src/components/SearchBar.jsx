function SearchBar({ query, onChange }) {
  return (
    <input
      type="search"
      className="mb-4 w-full rounded-lg border border-brand/40 bg-white px-4 py-3 text-base focus:border-brand focus:outline-none"
      placeholder="Пошук за отримувачем або букетом"
      aria-label="Пошук замовлень"
      value={query}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default SearchBar;
