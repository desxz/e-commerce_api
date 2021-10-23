const mongoose = require("mongoose");
const Cart = require("./Cart");
const CartItem = require("./CartItem");

OrderScheme = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    orderItems: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "CartItem",
        },
    ],
    orderTime: {
        type: Date,
        default: Date.now,
    },
    orderStatus: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending",
    },
    orderTotal: {
        type: Number,
    },
    orderAddress: {
        type: String,
        required: [true, "Order must have address"],
    },
    orderCity: {
        type: String,
        required: [true, "Order must have city"],
    },
    orderState: {
        type: String,
        required: [true, "Order must have state"],
    },
    orderZip: {
        type: Number,
        required: [true, "Order must have zip"],
    },
    orderCountry: {
        type: String,
        required: [true, "Order must have country"],
    },
    orderPhone: {
        type: Number,
        required: [true, "Order must have phone"],
        match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    orderEmail: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Email must be valid",
        ],
        required: [true, "Order must have email"],
    },
    orderPayment: {
        type: String,
        enum: ["paypal", "credit card", "cash"],
        required: [true, "Order must have payment"],
    },
    orderShipping: {
        type: String,
        enum: ["ground", "priority", "express"],
        required: [true, "Order must have shipping"],
    },
    orderTracking: {
        type: String,
        default: "",
    },
    orderNotes: {
        type: String,
        default: "",
    },
});

// Clear out the cart after order is placed
OrderScheme.pre("save", async function (next) {
    const cart = await Cart.findOne({ user: this.user });
    cart.items.forEach(async (item) => {
        cart.items.remove(item._id);
        await CartItem.findByIdAndDelete(item._id);
    });
    await cart.save();
    next();
});

module.exports = mongoose.model("Order", OrderScheme);
