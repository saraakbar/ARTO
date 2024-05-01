const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController'); 
const {auth} = require('../middleware/auth');

router.get('/products', auth,ProductController.getProducts);
router.get('/categories', auth,ProductController.getCategories);

module.exports = router;