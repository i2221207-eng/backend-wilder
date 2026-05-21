const isAdmin = (
    req,
    res,
    next
) => {

    console.log(
        'ROL USER:',
        req.user
    );

    if (
        req.user.rol !==
        'admin'
    ) {

        return res.status(403)
            .json({
                message:
                    'Acceso denegado'
            });
    }

    next();
};

module.exports =
    isAdmin;
