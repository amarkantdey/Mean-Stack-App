const { Product } = require("../models/product");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");

const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error("Invalid Image Type");
        if (isValid) uploadError = null;
        cb(uploadError, "public/uploads");
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(" ").join("-");
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

var uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(",") };
    }

    const productList = await Product.find(filter);

    if (!productList) {
        res.status(501).json({ success: false });
    }
    res.status(200).send(productList);
});

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
        res.status(501).json({ success: false });
    }
    res.status(200).send(product);
});

router.put(`/:id`, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("Invalid Product Id");
    }

    const category = await Category.findById(req.body.category);
    if (!category)
        return res.status(500).send("The category cannot be created");

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send("Invalid Product");

    const file = req.file;
    let imagePath;
    if (file) {
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
        imagePath = `${basePath}${fileName}`;
    } else {
        imagePath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    );

    if (!updatedProduct)
        return res.status(404).send("The category cannot be updated");

    res.send(updatedProduct);
});

router.post(`/`, uploadOptions.single("image"), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category)
        return res.status(500).send("The category cannot be created");

    const file = req.file;
    if (!file) return res.status(400).send("No Image in the request");

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product) return res.status(500).send("The category cannot be created");

    res.send(product);
});

router.delete(`/:id`, (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(404).send("Invalid Product Id ");
    }

    Product.findByIdAndRemove(req.params.id)
        .then((product) => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: "the category is deleted",
                });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: "category not found" });
            }
        })
        .catch((err) => {
            return res.status(400).json({ success: false, message: err });
        });
});

router.get("/get/count", async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
        res.status(500).json({ success: false });
    }
    res.status(200).send({ orderCount: productCount });
});

router.put(
    "/gallery-images/:id",
    uploadOptions.array("images", 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send("Invalid Product Id");
        }

        const files = req.files;
        let imagesPath = [];
        const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;

        if (files) {
            files.map((file) => {
                imagesPath.push(`${basePath}${file.fileName}`);
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                image: imagesPath,
            },
            { new: true }
        );
    }
);

module.exports = router;
