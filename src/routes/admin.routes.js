const express = require('express');

const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const {
    dashboard
} = require('../controllers/admin.controller');

router.get(
    '/dashboard',
    verifyToken,
    isAdmin,
    dashboard
);

module.exports = router;