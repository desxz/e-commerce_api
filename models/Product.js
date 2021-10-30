const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        richDescription: {
            type: String,
            default: "",
        },
        coverImage: {
            type: String,
            default: "",
        },
        images: [
            {
                type: String,
                default: "",
            },
        ],
        brand: {
            type: String,
            required: [true, "Brand is required"],
        },
        price: {
            type: Number,
            default: 0,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        countInStock: {
            type: Number,
            required: [true, "Count in stock is required"],
            min: 0,
            max: 999,
        },
        rating: {
            type: Number,
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating can not be more than 5"],
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.model("Product", ProductSchema);
