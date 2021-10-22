const mongoose = require("mongoose");
const CartItem = require("./CartItem");

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "CartItem",
        },
    ],
    subtotal: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Cart", CartSchema);
