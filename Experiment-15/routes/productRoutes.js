const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.post('/products', controller.addProduct);
router.get('/products', controller.getAll);
router.get('/products/category/:category', controller.getByCategory);
router.get('/products/by-color/:color', controller.getByColor);

module.exports = router;
