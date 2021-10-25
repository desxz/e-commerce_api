const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
    },
    icon: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Change lastUpdatedAt to current time
CategorySchema.pre("save", function (next) {
    this.lastUpdatedAt = new Date();
    next();
});

module.exports = mongoose.model("Category", CategorySchema);
