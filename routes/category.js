const express = require("express");

const router = express.Router();
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/category");
const advancedResults = require("../middleware/advancedResults");
const Category = require("../models/category");

router
    .route("/")
    .get(advancedResults(Category), getCategories)
    .post(createCategory);
router
    .route("/:id")
    .get(getCategory)
    .put(updateCategory)
    .delete(deleteCategory);

module.exports = router;
