const advancedResults = require("../middleware/advancedResults");
const asyncHandler = require("../middleware/async");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { clearCart } = require("./cart");

//@desc   Get my orders
//@route  GET /api/v1/orders/me
//@access Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
    });
});

//@desc   Get orders
//@route  GET /api/v1/orders
//@access Private
exports.getOrders = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc   Get single order
//@route  GET /api/v1/orders/me/:id
//@access Private
exports.getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate({
        path: "products.product",
        model: "Product",
    });
    if (!order) {
        return next(
            new ErrorResponse(
                `Order not found with id of ${req.params.id}`,
                404
            )
        );
    }
    res.status(200).json({
        success: true,
        data: order,
    });
});

//@desc   Create order
//@route  POST /api/v1/orders/me
//@access Private
exports.createOrder = asyncHandler(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user.id });
    const order = await Order.create({
        user: req.user.id,
        orderItems: cart.items,
        orderTotal: cart.subTotal,
        orderStatus: req.body.orderStatus,
        orderDate: req.body.orderDate,
        orderAddress: req.body.orderAddress,
        orderCity: req.body.orderCity,
        orderState: req.body.orderState,
        orderZip: req.body.orderZip,
        orderCountry: req.body.orderCountry,
        orderPhone: req.body.orderPhone,
        orderEmail: req.body.orderEmail,
        orderPayment: req.body.orderPayment,
        orderShipping: req.body.orderShipping,
        orderTracking: req.body.orderTracking,
        orderNotes: req.body.orderNotes,
    });

    res.status(201).json({
        success: true,
        data: order,
    });
});

//@desc   Update order
//@route  PUT /api/v1/orders/:id
//@access Private
exports.updateOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!order) {
        return next(
            new ErrorResponse(
                `Order not found with id of ${req.params.id}`,
                404
            )
        );
    }
    res.status(200).json({
        success: true,
        data: order,
    });
});

//@desc   Delete order
//@route  DELETE /api/v1/orders/:id
//@access Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(
            new ErrorResponse(
                `Order not found with id of ${req.params.id}`,
                404
            )
        );
    }
    order.remove();
    res.status(200).json({
        success: true,
        data: {},
    });
});

//@desc   Get all orders for a user
//@route  GET /api/v1/orders/user/:id
//@access Private
exports.getOrdersByUser = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({
        user: req.params.id,
    });

    if (!orders) {
        return next(
            new ErrorResponse(
                `No orders found for user with id of ${req.params.userId}`,
                404
            )
        );
    }
    res.status(200).json({
        success: true,
        data: orders,
    });
});

//@desc   Get all orders
//@route  GET /api/v1/orders/all
