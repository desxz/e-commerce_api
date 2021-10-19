const express = require("express");
const ErrorResponse = require("../utils/errorResponse");

const router = express.Router({ mergeParams: true });

const Product = require("../models/Product");
const advancedResults = require("../middleware/advancedResults");
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/product");

const { protect, authorize } = require("../middleware/auth");

router
    .route("/")
    .get(
        advancedResults(Product, {
            path: "category",
            select: "name",
        }),
        getProducts
    )
    .post(protect, authorize("seller", "admin"), createProduct);

router
    .route("/:id")
    .get(getProduct)
    .put(protect, authorize("seller", "admin"), updateProduct)
    .delete(protect, authorize("seller", "admin"), deleteProduct);

module.exports = router;
