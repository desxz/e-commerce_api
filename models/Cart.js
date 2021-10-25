const mongoose = require("mongoose");
const CartItem = require("./CartItem");
const Product = require("./Product");

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "User is required"],
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
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

// lastUpdated is updated every time an item is added or removed
CartSchema.pre("save", function (next) {
    this.lastUpdated = Date.now();
    next();
});

//Calculate subtotal of cart before save
CartSchema.pre("save", async function (next) {
    const cart = this;
    let subtotal = 0;
    for (let i = 0; i < cart.items.length; i++) {
        const item = await CartItem.findById(cart.items[i]);
        const product = await Product.findById(item.product);
        subtotal += product.price * item.quantity;
    }
    cart.subtotal = subtotal;
    next();
});

module.exports = mongoose.model("Cart", CartSchema);
