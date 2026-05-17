const express =
    require('express');

const router =
    express.Router();

const upload =
    require(
        '../middlewares/upload.middleware'
    );

const verifyToken =
    require(
        '../middlewares/auth.middleware'
    );

const isAdmin =
    require(
        '../middlewares/admin.middleware'
    );

const {
    uploadImage
} = require(
    '../controllers/upload.controller'
);

router.post(
    '/',
    verifyToken,
    isAdmin,
    upload.single('image'),
    uploadImage
);

module.exports = router;