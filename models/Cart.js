const mongoose = require("mongoose");
const CartItem = require("./CartItem");

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false,
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

//Calculate the subtotal of the cart
CartSchema.pre("save", async function (next) {
    const cart = this;
    let subtotal = 0;
    for (let i = 0; i < cart.items.length; i++) {
        const cartItem = await CartItem.findById(cart.items[i]);
        subtotal += cartItem.total;
    }
    cart.subtotal = subtotal;
    next();
});

module.exports = mongoose.model("Cart", CartSchema);
