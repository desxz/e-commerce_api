const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const advancedResults = require("../middleware/advancedResults");
const { getProducts } = require("../controllers/product");

router.route("/").get(advancedResults(Product), getProducts);

module.exports = router;
