const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { getProducts } = require("../controllers/product");

router.route("/").get(getProducts);

module.exports = router;
