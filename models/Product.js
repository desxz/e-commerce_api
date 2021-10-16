const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    images: {
        type: Array,
        default: [],
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 999,
    },
    rating: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Product", ProductSchema);
