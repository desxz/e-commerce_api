const Category = require("../models/Category");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

//@desc Get all categories
//@route GET /api/v1/categories
//@access Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc Get single category
//@route GET /api/v1/categories/:id
//@access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(
            new ErrorResponse(
                `Category not found with id of ${req.params.id}`,
                404
            )
        );
    }
    res.status(200).json({
        success: true,
        data: category,
    });
});

//@desc   Create category
//@route  POST /api/v1/categories
//@access Public
exports.createCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.create(req.body);
    res.status(201).json({
        success: true,
        data: category,
    });
});

//@desc   Update category
//@route  PUT /api/v1/categories/:id
//@access Public
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(
            new ErrorResponse(
                `Category not found with id of ${req.params.id}`,
                404
            )
        );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).json({
        success: true,
        data: updatedCategory,
    });
});

//@desc   Delete category
//@route  DELETE /api/v1/categories/:id
//@access Public
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(
            new ErrorResponse(
                `Category not found with id of ${req.params.id}`,
                404
            )
        );
    }

    await category.delete();

    res.status(200).json({
        success: true,
        data: {},
    });
});
