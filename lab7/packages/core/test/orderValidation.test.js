import { test } from "node:test";
import assert from "node:assert/strict";
import {
    validateOrderData,
    MAX_RECIPIENT_LENGTH,
    MAX_CARD_LENGTH,
    ERROR_RECIPIENT_EMPTY,
    ERROR_DATE_EMPTY,
    ERROR_DATE_PAST,
} from "../index.js";

const TODAY = "2026-11-15";
const FUTURE = "2026-12-01";

test("коректні дані проходять перевірку", () => {
    const result = validateOrderData(
        { recipient: "Олена", date: FUTURE, card: "З днем народження!" },
        TODAY
    );
    assert.equal(result.isValid, true);
    assert.equal(result.error, "");
});

test("порожнє ім'я і самі пробіли не проходять перевірку", () => {
    assert.deepEqual(validateOrderData({ recipient: "", date: FUTURE }, TODAY), {
        isValid: false,
        error: ERROR_RECIPIENT_EMPTY,
    });
    assert.equal(validateOrderData({ recipient: "   ", date: FUTURE }, TODAY).isValid, false);
});

test("ім'я не рядок не проходить перевірку", () => {
    assert.equal(validateOrderData({ recipient: 123, date: FUTURE }, TODAY).isValid, false);
    assert.equal(validateOrderData(null, TODAY).isValid, false);
});

test("межа довжини імені: рівно MAX_RECIPIENT_LENGTH допустимо, на один більше ні", () => {
    const ok = "а".repeat(MAX_RECIPIENT_LENGTH);
    const tooLong = "а".repeat(MAX_RECIPIENT_LENGTH + 1);
    assert.equal(validateOrderData({ recipient: ok, date: FUTURE }, TODAY).isValid, true);
    assert.equal(validateOrderData({ recipient: tooLong, date: FUTURE }, TODAY).isValid, false);
});

test("межа довжини листівки: рівно MAX_CARD_LENGTH допустимо, на один більше ні", () => {
    const ok = "б".repeat(MAX_CARD_LENGTH);
    const tooLong = "б".repeat(MAX_CARD_LENGTH + 1);
    assert.equal(validateOrderData({ recipient: "Олена", date: FUTURE, card: ok }, TODAY).isValid, true);
    assert.equal(validateOrderData({ recipient: "Олена", date: FUTURE, card: tooLong }, TODAY).isValid, false);
});

test("листівка необов'язкова, але не може бути не рядком", () => {
    assert.equal(validateOrderData({ recipient: "Олена", date: FUTURE }, TODAY).isValid, true);
    assert.equal(validateOrderData({ recipient: "Олена", date: FUTURE, card: 5 }, TODAY).isValid, false);
});

test("порожня або неіснуюча дата не проходить перевірку", () => {
    assert.equal(validateOrderData({ recipient: "Олена", date: "" }, TODAY).error, ERROR_DATE_EMPTY);
    assert.equal(validateOrderData({ recipient: "Олена", date: "2026-02-30" }, TODAY).isValid, false);
    assert.equal(validateOrderData({ recipient: "Олена", date: "15.12.2026" }, TODAY).isValid, false);
});

test("дата в минулому не проходить, а сьогоднішня проходить", () => {
    const past = validateOrderData({ recipient: "Олена", date: "2026-11-14" }, TODAY);
    assert.equal(past.isValid, false);
    assert.equal(past.error, ERROR_DATE_PAST);
    assert.equal(validateOrderData({ recipient: "Олена", date: TODAY }, TODAY).isValid, true);
});
