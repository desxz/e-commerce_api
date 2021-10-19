//@desc   Get orders
//@route  GET /api/v1/categories
//@access Private
exports.getCategories = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});
