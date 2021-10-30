const express = require("express");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

//--------------Environment Configurations-------------\\
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const app = express();

// Define PORT
const PORT = process.env.PORT || 5000;

// Load env variables
dotenv.config({ path: "./config/config.env" });

// API Route shortway
const api = process.env.API_URL;

// Mongoose connection
connectDB();

// Cookie Parser
app.use(
    cookieParser(process.env.COOKIE_SECRET, {
        httpOnly: true,
        secure: true,
    })
);

//--------------MiddleWares-------------\\

// Morgan Logger
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(fileUpload());

// Body Parser
app.use(bodyParser.json());

//--------------Security-------------\\

//Rate Limiter
const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

//Mongo sanitize
app.use(mongoSanitize());

// Helmet
app.use(helmet());

// XSS
app.use(xss());

// CORS
app.use(cors());

//--------------Routes-------------\\

//Define Routes
const product = require("./routes/Product");
const user = require("./routes/User");
const order = require("./routes/Order");
const category = require("./routes/Category");
const auth = require("./routes/Auth");
const cart = require("./routes/Cart");
const review = require("./routes/Review");

// Mounting Routes
app.use(`${api}/products`, product);
app.use(`${api}/users`, user);
app.use(`${api}/orders`, order);
app.use(`${api}/categories`, category);
app.use(`${api}/auth`, auth);
app.use(`${api}/cart`, cart);
app.use(`${api}/reviews`, review);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.yellow.bold);
});

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(() => process.exit(1));
});
