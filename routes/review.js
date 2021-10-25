const express = require("express");
const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
} = require("../controllers/review");
const Review = require("../models/Review");
const router = express.Router({ mergeParams: true });
const Product = require("../models/Product");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
    .route("/")
    .get(
        advancedResults(Review, {
            path: "product",
            select: "name price",
        }),
        getReviews
    )
    .post(protect, authorize("user", "admin"), createReview);

router
    .route("/:id")
    .get(getReview)
    .put(protect, authorize("user", "admin"), updateReview)
    .delete(protect, authorize("user", "admin"), deleteReview);

module.exports = router;
