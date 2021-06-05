const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const categoryRouter = require("./routers/categories");
const productRouter = require("./routers/products");

require("dotenv/config");
const api = process.env.API_URL;

app.use(`${api}/category`, categoryRouter);
app.use(`${api}/product`, productRouter);

//middleware
app.use(express.json());
app.use(morgan("tiny"));

// app.get(`${api}/products`, (req, res) => {
//     const product = {
//         id: 1,
//         name: "Hair Dryer",
//         images: "some_url",
//     };
//     res.send(product);
// });

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
