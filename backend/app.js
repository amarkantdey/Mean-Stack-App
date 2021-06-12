const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const categoryRouter = require("./routers/categories");
const productRouter = require("./routers/products");
const userRouter = require("./routers/users");
const orderRouter = require("./routers/orders");
const authenticateJWT = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

require("dotenv/config");
const api = process.env.API_URL;

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT());
app.use(errorHandler);

//Routes
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/product`, productRouter);
app.use(`${api}/user`, userRouter);
app.use(`${api}/order`, orderRouter);

mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "eshop-db",
    })
    .then(() => {
        console.log("Database is connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log("Server is running");
});
