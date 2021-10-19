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
const { protect, authorize } = require("../middleware/auth");
const Category = require("../models/Category");

const productRouter = require("./product");

router.use("/:categoryId/products", productRouter);

router
    .route("/")
    .get(advancedResults(Category, "products"), getCategories)
    .post(protect, authorize("admin"), createCategory);
router
    .route("/:id")
    .get(getCategory)
    .put(protect, authorize("admin"), updateCategory)
    .delete(protect, authorize("admin"), deleteCategory);

module.exports = router;
