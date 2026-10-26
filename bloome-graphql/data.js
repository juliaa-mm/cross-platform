// Тимчасове сховище в оперативній пам'яті.
// Після перезапуску сервера дані зникають.
export const users = [];
export const products = [];

let userCounter = 1;
let productCounter = 1;

export function getNextUserId() {
    return String(userCounter++);
}

export function getNextProductId() {
    return String(productCounter++);
}
