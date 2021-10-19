const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    total: {
        type: Number,
        required: true,
    },
});

//Calculate the total price of the cart item
CartItemSchema.methods.calculateTotal = function () {
    return this.product.price * this.quantity;
};

exports.model = mongoose.model("CartItem", CartItemSchema);
