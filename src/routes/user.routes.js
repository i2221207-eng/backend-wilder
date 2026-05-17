const express =
require('express');

const router =
express.Router();

const verifyToken =
require(
'../middlewares/auth.middleware'
);

const {
    getProfile
} = require(
'../controllers/user.controller'
);

router.get(
    '/profile',
    verifyToken,
    getProfile
);

module.exports = router;