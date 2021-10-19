const express = require("express");
const ErrorResponse = require("../utils/errorResponse");

const router = express.Router({ mergeParams: true });
const { getCardItems } = require("../controllers/cart");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, getCardItems);

module.exports = router;
