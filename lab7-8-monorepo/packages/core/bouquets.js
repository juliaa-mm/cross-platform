// Каталог букетів (дані, без залежності від платформи). Однаковий для всіх клієнтів.
export const BOUQUETS = [
    { id: "morning", name: "«Ранкова обіцянка»", flowers: "Тюльпани", price: 450, image: "https://i.pinimg.com/736x/83/49/17/83491754ec84777b04b2ae711f165264.jpg" },
    { id: "velvet", name: "«Оксамитовий вечір»", flowers: "Троянди", price: 890, image: "https://i.pinimg.com/1200x/5f/d3/1e/5fd31ede61a822f34676600342eb5011.jpg" },
    { id: "powder", name: "«Пудрова мрія»", flowers: "Півонії", price: 1050, image: "https://i.pinimg.com/736x/fa/a9/04/faa9047c5b91df074ebc552a74d455d5.jpg" },
    { id: "summer", name: "«Літній ранок»", flowers: "Ромашки", price: 380, image: "https://i.pinimg.com/736x/46/d3/3d/46d33da6f28f755a16420f57bfb79660.jpg" },
    { id: "lavender", name: "«Лавандовий сон»", flowers: "Лаванда та еустома", price: 720, image: "https://i.pinimg.com/736x/31/8a/8f/318a8fca558bf345ebf6d38c75020c62.jpg" },
    { id: "sunrise", name: "«Ніжний світанок»", flowers: "Гортензії", price: 640, image: "https://i.pinimg.com/1200x/99/27/15/992715a0706e3a81b64eade296626e0a.jpg" },
    { id: "sunny", name: "«Сонячний настрій»", flowers: "Соняшники", price: 520, image: "https://i.pinimg.com/1200x/f6/ef/df/f6efdfa219cdab0b66c6530633a2619f.jpg" },
    { id: "cloud", name: "«Біла хмаринка»", flowers: "Білі троянди", price: 950, image: "https://i.pinimg.com/1200x/59/5e/26/595e26df6c21b9d5bd535b96c21ed0ed.jpg" },
    { id: "spring", name: "«Весняна свіжість»", flowers: "Нарциси", price: 410, image: "https://i.pinimg.com/736x/b3/6c/c9/b36cc961ffc3a1c66299839395ec7796.jpg" },
    { id: "pastel", name: "«Лілії»", flowers: "Лілії", price: 780, image: "https://i.pinimg.com/736x/32/58/21/3258211a9396deabd98ca8d3a00291c0.jpg" },
];

export function findBouquet(id) {
    return BOUQUETS.find((bouquet) => bouquet.id === id) || null;
}
