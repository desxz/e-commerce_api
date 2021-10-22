const Cart = require("../models/Cart");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Product = require("../models/Product");
const CartItem = require("../models/CartItem");

//@desc   Get cart items
//@route  GET /api/v1/cart
//@access Private
exports.getCartItems = asyncHandler(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user.id }).populate({
        path: "items",
        ref: "CartItem",
        populate: {
            path: "product",
            ref: "Product",
            select: "name price",
        },
    });

    if (!cart) {
        cart = await Cart.create({ user: req.user.id });
    }

    res.status(200).json({
        success: true,
        data: cart,
    });
});

//@desc   Add items to cart
//@route  POST /api/v1/cart/products
//@access Private
exports.addCartItems = asyncHandler(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user.id }).populate({
        path: "items",
        ref: "CartItem",
    });
    const product = await Product.findById(req.body.product);

    if (!cart) {
        cart = await Cart.create({ user: req.user.id });
    }

    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    if (product.countInStock < req.body.quantity) {
        return next(new ErrorResponse("Product is out of stock", 404));
    }

    if (cart.items.length > 0) {
        let item = cart.items.find(
            (item) => item.product.toString() === req.body.product
        );
        console.log(item);

        if (item) {
            item.quantity += req.body.quantity;

            // Check product stock
            if (product.countInStock < item.quantity) {
                return next(new ErrorResponse("Product is out of stock", 404));
            }

            await item.save();
            return res.status(200).json({
                success: true,
                data: cart,
            });
        }
    }

    const cartItem = await CartItem.create({
        product: req.body.product,
        quantity: req.body.quantity,
        cart: cart._id,
    });

    cart.items.push(cartItem._id);
    await cart.save();

    res.status(200).json({
        success: true,
        data: cart,
    });
});

//@desc   Delete products from cart
//@route  DELETE /api/v1/cart/products/:id
//@access Private
exports.deleteCartItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
        path: "items",
        ref: "CartItem",
    });

    const cartItem = cart.items.find(
        (item) => item.product.toString() === req.params.id
    );

    if (!cartItem) {
        return next(new ErrorResponse("Product not in cart", 404));
    }

    cart.items.remove(cartItem._id);
    await CartItem.deleteOne({ _id: cartItem._id });

    await cart.save();

    res.status(200).json({
        success: true,
        data: {},
    });
});

//@desc   Clear cart products
//@route  DELETE /api/v1/cart/products
//@access Private
exports.clearCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
        path: "items",
        ref: "CartItem",
    });

    cart.items.forEach(async (item) => {
        await CartItem.deleteOne({ _id: item._id });
    });

    cart.items = [];
    await cart.save();

    res.status(200).json({
        success: true,
        data: {},
    });
});
