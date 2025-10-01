const Product = require('../models/productModel');

// Create/Insert product
exports.addProduct = async (req, res) => {
try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
} catch (err) {
    res.status(400).json({ error: err.message });
}
};

// Get all products
exports.getAll = async (req, res) => {
try {
    const products = await Product.find({});
    res.json(products);
} catch (err) {
    res.status(500).json({ error: err.message });
}
};

// Get products by category
exports.getByCategory = async (req, res) => {
try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
} catch (err) {
    res.status(500).json({ error: err.message });
}
};

// Get products by variant color
exports.getByColor = async (req, res) => {
try {
    const products = await Product.find({ 'variants.color': req.params.color });
    res.json(products);
} catch (err) {
    res.status(500).json({ error: err.message });
}
};
