const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            total: {
                type: Number,
                required: true,
                default: 0,
            },
        },
    ],

    subtotal: {
        type: Number,
        default: 0,
    },
});

//Calculate total price of the cart
CartSchema.methods.calculateTotal = function () {
    let total = 0;
    this.products.forEach((product) => {
        total += product.price * product.quantity;
    });
    this.total = total;
};

module.exports = mongoose.model("Cart", CartSchema);
