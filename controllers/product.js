const Product = require("../models/product");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

//@desc   Get all products
//@route  GET /api/v1/products
//@access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc   Get single products
//@route  GET /api/v1/products/:id
//@access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(
            new ErrorResponse(
                `Product not found with id of ${req.params.id}`,
                404
            )
        );
    }
    res.status(200).json({
        success: true,
        data: product,
    });
});

//@desc   Create product
//@route  POST /api/v1/products
//@access Public
exports.createProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        data: product,
    });
});

//@desc   Update product
//@route  PUT /api/v1/products/:id
//@access Public
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(
            new ErrorResponse(
                `Product not found with id of ${req.params.id}`,
                404
            )
        );
    }
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).json({
        success: true,
        data: updatedProduct,
    });
});

//@desc   Delete product
//@route  DELETE /api/v1/products/:id
//@access Public
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(
            new ErrorResponse(
                `Product not found with id of ${req.params.id}`,
                404
            )
        );
    }

    await product.delete();

    res.status(200).json({
        success: true,
        data: {},
    });
});
