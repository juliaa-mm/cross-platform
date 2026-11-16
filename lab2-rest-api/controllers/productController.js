import Product from "../models/Product.js";

const allowedFields = [
    "name",
    "description",
    "price",
    "flowers",
    "occasion",
    "recipient",
    "color",
    "imageUrl",
    "inStock",
    "isHidden"
];

function pickFields(body) {
    const data = {};
    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            data[field] = body[field];
        }
    }
    return data;
}

function handleError(res, error) {
    if (error.name === "CastError") {
        return res.status(400).json({ message: "Некоректний id товару." });
    }
    if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Помилка сервера.", error: error.message });
}

export async function getProducts(req, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        handleError(res, error);
    }
}

export async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Товар не знайдено." });
        }
        res.json(product);
    } catch (error) {
        handleError(res, error);
    }
}

export async function createProduct(req, res) {
    try {
        const product = await Product.create(pickFields(req.body));
        res.status(201).json(product);
    } catch (error) {
        handleError(res, error);
    }
}

export async function updateProduct(req, res) {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            pickFields(req.body),
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: "Товар не знайдено." });
        }
        res.json(product);
    } catch (error) {
        handleError(res, error);
    }
}

export async function deleteProduct(req, res) {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Товар не знайдено." });
        }
        res.json({ message: "Товар видалено." });
    } catch (error) {
        handleError(res, error);
    }
}