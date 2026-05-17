const dashboard = async (req, res) => {

    res.json({
        message: 'Bienvenido administrador',
        admin: req.user
    });
};

module.exports = {
    dashboard
};