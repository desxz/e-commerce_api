const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");

//// Application Configurations
const app = express();
const connectDB = require("./config/db");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// API Route shortway
const api = process.env.API_URL;

// Mongoose connection
connectDB();

////Middlewares

// Morgan Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body Parser
app.use(bodyParser.json());

////Routes
const product = require("./routes/product");
const user = require("./routes/user");
const order = require("./routes/order");
const category = require("./routes/category");

// Mounting Routes
app.use(`${api}/products`, product);
app.use(`${api}/users`, user);
app.use(`${api}/orders`, order);
app.use(`${api}/categories`, category);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.yellow.bold);
});
