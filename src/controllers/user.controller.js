const pool =
require('../config/db');

// perfil usuario
const getProfile =
async (req, res) => {

    try {

        const userId =
        req.user.id;

        const user =
        await pool.query(
            `
            SELECT
                id,
                nombre,
                apellido,
                correo,
                telefono,
                rol
            FROM users
            WHERE id = $1
            `,
            [userId]
        );

        res.json(
            user.rows[0]
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message:
            'Error servidor'
        });
    }
};

module.exports = {
    getProfile
};