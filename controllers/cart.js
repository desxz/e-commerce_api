const Cart = require("../models/Cart");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

//@desc   Get cart items
//@route  GET /api/v1/cart
//@access Private
exports.getCardItems = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        await Cart.create({ user: req.user.id });
    }

    res.status(200).json({
        success: true,
        data: cart,
    });
});

//@desc   Add items to cart
//@route  POST /api/v1/cart
//@access Private
exports.addCardItems = asyncHandler(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user.id });
    const product = await Product.findById(req.body.productId);

    if (!cart) {
        await Cart.create({ user: req.user.id });
    }

    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    if (cart.items.some((item) => item.productId === req.body.productId)) {
        return next(new ErrorResponse("Product already in cart", 400));
    }

    cart.products.push({
        id: preq.body.productId,
        quantity: req.body.quantity,
    });

    await cart.save();

    res.status(201).json({
        success: true,
        data: cart,
    });
});

//@desc   Remove items to cart
//@route  POST /api/v1/cart
//@access Private
exports.removeCardItems = asyncHandler(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user.id });
    const product = await Product.findById(req.body.productId);

    if (!cart) {
        await Cart.create({ user: req.user.id });
    }

    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    if (cart.items.some((item) => item.productId !== req.body.productId)) {
        return next(new ErrorResponse("Product not in cart", 400));
    }

    await cart.save();

    res.status(201).json({
        success: true,
        data: cart,
    });
});
