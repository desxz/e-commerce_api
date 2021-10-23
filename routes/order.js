const express = require("express");
const {
    getOrder,
    getOrders,
    getMyOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrdersByUser,
} = require("../controllers/order");

const Order = require("../models/Order");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router
    .route("/")
    .get(
        authorize("admin"),
        advancedResults(Order, {
            path: "user",
            select: "name email",
        }),
        getOrders
    )
    .post(authorize("admin"), createOrder);

router
    .route("/me")
    .get(
        advancedResults(Order, "products"),
        authorize("admin", "user"),
        getMyOrders
    )
    .post(authorize("admin", "user"), createOrder);

router
    .route("me/:id")
    .get(getOrder)
    .put(authorize("admin"), updateOrder)
    .delete(authorize("admin"), deleteOrder);

router.route("/user/:id").get(authorize("admin"), getOrdersByUser);

module.exports = router;
