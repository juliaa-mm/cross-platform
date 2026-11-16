import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        flowers: { type: String, trim: true, default: "" },
        occasion: { type: String, trim: true, default: "" },
        recipient: { type: String, trim: true, default: "" },
        color: { type: String, trim: true, default: "" },
        imageUrl: { type: String, trim: true, default: "" },
        inStock: { type: Boolean, default: true },
        isHidden: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;