const express = require('express');

const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const {
    setDailyMenu,
    getDailyMenu
} = require('../controllers/menu.controller');

// Público
router.get('/', getDailyMenu);

// Admin
router.post(
    '/',
    verifyToken,
    isAdmin,
    setDailyMenu
);

module.exports = router;