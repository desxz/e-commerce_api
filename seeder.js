const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Load models
const Category = require("./models/Category");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const User = require("./models/User");
const Order = require("./models/Order");
const CartItem = require("./models/CartItem");

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

// const bootcamps = JSON.parse(
//     fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
// );

// const courses = JSON.parse(
//     fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
// );

//Import into DB
const importData = async () => {
    try {
        console.log("Data Imported...".green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

//Delete data
const deleteData = async () => {
    try {
        await Category.deleteMany();
        await Product.deleteMany();
        await Cart.deleteMany();
        await User.deleteMany();
        await CartItem.deleteMany();
        //await Order.deleteMany();
        console.log("Data Destroyed...".red.inverse.white.bold);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}
