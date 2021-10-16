const express = require("express");
const ErrorResponse = require("../utils/errorResponse");

const router = express.Router();

const Product = require("../models/product");
const advancedResults = require("../middleware/advancedResults");
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/product");

router
    .route("/")
    .get(advancedResults(Product), getProducts)
    .post(createProduct);
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;
