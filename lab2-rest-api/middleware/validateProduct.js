export function validateProduct(req, res, next) {
    const { name, description, price } = req.body || {};

    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ message: "Поле name обов'язкове і не може бути порожнім." });
    }

    if (typeof description !== "string" || description.trim() === "") {
        return res.status(400).json({ message: "Поле description обов'язкове і не може бути порожнім." });
    }

    if (price === undefined || price === null || price === "" || isNaN(Number(price)) || Number(price) < 0) {
        return res.status(400).json({ message: "Поле price обов'язкове і має бути числом не менше 0." });
    }

    next();
}