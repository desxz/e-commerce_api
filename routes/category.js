const express = require("express");
const ErrorResponse = require("../utils/errorResponse");

const router = express.Router({ mergeParams: true });
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/category");
const advancedResults = require("../middleware/advancedResults");
const Category = require("../models/category");

const productRouter = require("./product");

router.use("/:categoryId/products", productRouter);

router
    .route("/")
    .get(advancedResults(Category, "products"), getCategories)
    .post(createCategory);
router
    .route("/:id")
    .get(getCategory)
    .put(updateCategory)
    .delete(deleteCategory);

module.exports = router;
