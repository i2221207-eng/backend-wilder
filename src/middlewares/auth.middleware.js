const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;

        console.log(
            'AUTH HEADER:',
            authHeader
        );

        if (!authHeader) {

            return res.status(401).json({
                message:
                    'Token requerido'
            });
        }

        const token =
            authHeader.split(' ')[1];

        console.log(
            'TOKEN RECIBIDO:',
            token
        );

        const verified =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        console.log(
            'JWT VERIFY:',
            verified
        );

        req.user =
            verified;

        next();

    } catch (error) {

        console.log(
            'JWT ERROR:',
            error.message
        );

        return res.status(401).json({
            message:
                'Token inválido'
        });
    }
};

module.exports =
    verifyToken;
