const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a title for review"],
        maxlength: [100, "Title cannot be more than 100 characters"],
    },
    text: {
        type: String,
        required: [true, "Please add a description"],
    },
    rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"],
        required: [true, "Please add a rating"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (productId) {
    const obj = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: "$product",
                rating: { $avg: "$rating" },
            },
        },
    ]);
    try {
        await this.model("Product").findByIdAndUpdate(productId, {
            rating: obj[0].rating,
        });
    } catch (err) {
        console.error(err);
    }
};

//Call getAverageCost after save
ReviewSchema.post("save", function () {
    this.constructor.getAverageRating(this.product);
});

//Call getAverageCost before remove
ReviewSchema.pre("remove", function () {
    this.constructor.getAverageRating(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
