const express = require('express');

const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const {
    createProduct,
    getProducts,
    getExtras,
    getMenuDay,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

// Public
router.get('/', getProducts);
router.get('/extras', getExtras);
router.get('/menu-day', getMenuDay);

// Admin
router.post(
    '/',
    verifyToken,
    isAdmin,
    createProduct
);

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    updateProduct
);

router.delete(
    '/:id',
    verifyToken,
    isAdmin,
    deleteProduct
);

module.exports = router;