const { Product } = require("../models/product");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

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
    const category = await Category.findById(req.body.category);
    if (!category)
        return res.status(500).send("The category cannot be created");

    const product = await Product.findByIdAndUpdate(
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

    if (!product) return res.status(404).send("The category cannot be updated");

    res.send(product);
});

router.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category)
        return res.status(500).send("The category cannot be created");

    let product = new Product({
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

module.exports = router;
