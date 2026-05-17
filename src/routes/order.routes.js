const express = require('express');

const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const {
    createOrder,
    getOrders,
    updateOrderStatus,
    getMyOrders
} = require('../controllers/order.controller');

// Cliente
router.post(
    '/',
    verifyToken,
    createOrder
);

router.get(
    '/my-orders',
    verifyToken,
    getMyOrders
);

// Admin
router.get(
    '/',
    verifyToken,
    isAdmin,
    getOrders
);

router.put(
    '/:id/status',
    verifyToken,
    isAdmin,
    updateOrderStatus
);



module.exports = router;