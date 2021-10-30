const Product = require("../models/Product");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Category = require("../models/Category");
const path = require("path");

//@desc   Get all products
//@route  GET /api/v1/products
//@route  GET /api/v1/categories/:categoryId/products
//@access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    if (req.params.categoryId) {
        const products = await Product.find({
            category: req.params.categoryId,
        }).populate({
            path: "category",
            select: "name",
        });

        if (!products || products.length === 0) {
            return next(
                new ErrorResponse(
                    `No products found for category ${req.params.categoryId}`,
                    404
                )
            );
        }
        return res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

//@desc   Get single products
//@route  GET /api/v1/products/:id
//@access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate({
        path: "category",
        select: "name",
    });

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
//@route  POST /api/v1/categories/:categoryId/products
//@access Public
exports.createProduct = asyncHandler(async (req, res, next) => {
    req.body.category = req.params.categoryId;
    req.body.seller = req.user.id;

    const category = await Category.findById(req.params.categoryId);

    if (!category) {
        return next(
            new ErrorResponse(
                `Category not found with id of ${req.params.categoryId}`,
                404
            )
        );
    }

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

//@desc   Upload photo for product
//@route  PUT /api/v1/products/:id/images
//@access Private
exports.uploadProductImage = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(
            new ErrorResponse(
                `Product not found with id of ${req.params.id}`,
                404
            )
        );
    }

    if (
        product.seller.toString() !== req.user.id ||
        req.user.role !== "admin"
    ) {
        return next(
            new ErrorResponse(
                `You are not authorized to update this product`,
                401
            )
        );
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    file.name = `photo_${product._id}_${product.images.length}${
        path.parse(file.name).ext
    }`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        product.images.push(file.name);

        await product.save();

        if (product.images.length === 1) {
            product.coverImage = file.name;
        }

        await product.save();

        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
});

//@desc   Change product coverImage
//@route  PUT /api/v1/products/:id/images/cover
//@access Private
exports.updateProductCoverImage = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(
            new ErrorResponse(
                `Product not found with id of ${req.params.id}`,
                404
            )
        );
    }

    if (
        product.seller.toString() !== req.user.id ||
        req.user.role !== "admin"
    ) {
        return next(
            new ErrorResponse(
                `You are not authorized to update this product`,
                401
            )
        );
    }

    product.coverImage = req.body.coverImage;

    await product.save();

    res.status(200).json({
        success: true,
        data: product.coverImage,
    });
});
