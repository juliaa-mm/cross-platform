import { getToday, isValidIsoDate } from "./orderUtils.js";

export const MAX_RECIPIENT_LENGTH = 50;
export const MAX_CARD_LENGTH = 200;

export const ERROR_RECIPIENT_EMPTY = "Вкажіть ім'я отримувача.";
export const ERROR_RECIPIENT_TOO_LONG = `Ім'я отримувача не повинно перевищувати ${MAX_RECIPIENT_LENGTH} символів.`;
export const ERROR_DATE_EMPTY = "Оберіть дату доставки.";
export const ERROR_DATE_INVALID = "Дата доставки вказана некоректно.";
export const ERROR_DATE_PAST = "Дата доставки не може бути в минулому.";
export const ERROR_CARD_INVALID = "Текст листівки має бути рядком.";
export const ERROR_CARD_TOO_LONG = `Текст листівки не повинен перевищувати ${MAX_CARD_LENGTH} символів.`;

function fail(error) {
    return { isValid: false, error };
}

// Перевіряє дані нового замовлення. Повертає { isValid, error }.
// Довжина вимірюється після видалення зайвих пробілів.
export function validateOrderData(data, today = getToday()) {
    const { recipient, date, card } = data || {};

    if (typeof recipient !== "string" || recipient.trim() === "") {
        return fail(ERROR_RECIPIENT_EMPTY);
    }
    if (recipient.trim().length > MAX_RECIPIENT_LENGTH) {
        return fail(ERROR_RECIPIENT_TOO_LONG);
    }
    if (typeof date !== "string" || date === "") {
        return fail(ERROR_DATE_EMPTY);
    }
    if (!isValidIsoDate(date)) {
        return fail(ERROR_DATE_INVALID);
    }
    if (date < today) {
        return fail(ERROR_DATE_PAST);
    }
    if (card !== undefined && card !== null) {
        if (typeof card !== "string") {
            return fail(ERROR_CARD_INVALID);
        }
        if (card.trim().length > MAX_CARD_LENGTH) {
            return fail(ERROR_CARD_TOO_LONG);
        }
    }
    return { isValid: true, error: "" };
}
