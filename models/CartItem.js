const mongoose = require("mongoose");
const Product = require("./Product");

const CartItemSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
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
        default: 0,
    },
});

//Calculate total price of cart item
CartItemSchema.methods.calculateTotal = async function () {
    const product = await Product.findById(this.product);
    this.total = product.price * this.quantity;
    return this.total;
};

//Calculate total price of the cart
CartItemSchema.statics.calculateSubTotal = async function (cartId) {
    const obj = await this.aggregate([
        {
            $match: { cart: cartId },
        },
        {
            $group: {
                _id: "$cart",
                total: { $sum: "$total" },
            },
        },
    ]);
    try {
        await this.model("Cart").findByIdAndUpdate(cartId, {
            subtotal: obj[0].total,
        });
    } catch (err) {
        console.log(err);
    }
};

//Calculate the total price of the cart item
CartItemSchema.pre("save", async function (next) {
    await this.calculateTotal();
    next();
});

//Calculate the total price of the cart item
CartItemSchema.pre("update", async function (next) {
    await this.calculateTotal();
    next();
});

CartItemSchema.post("save", function () {
    this.constructor.calculateSubTotal(this.cart);
});

module.exports = mongoose.model("CartItem", CartItemSchema);
