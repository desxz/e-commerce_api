const Product = require("../models/product");
const asyncHandler = require("../middleware/async");

exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});
