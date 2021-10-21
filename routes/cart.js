const express = require("express");
const ErrorResponse = require("../utils/errorResponse");

const router = express.Router({ mergeParams: true });
const {
    getCartItems,
    addCartItems,
    deleteCartItem,
    clearCart,
} = require("../controllers/cart");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
    .route("/products")
    .post(protect, addCartItems)
    .delete(protect, clearCart)
    .get(protect, getCartItems);
router.route("/products/:id").delete(protect, deleteCartItem);

module.exports = router;
