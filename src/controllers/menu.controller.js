const pool = require('../config/db');

// Crear menú del día
const setDailyMenu = async (req, res) => {

    try {

        const { products } = req.body;

        const today = new Date()
            .toISOString()
            .split('T')[0];

        // Eliminar menú anterior
        await pool.query(
            'DELETE FROM daily_menu WHERE fecha = $1',
            [today]
        );

        // Insertar nuevo menú
        for (const productId of products) {

            await pool.query(
                `
                INSERT INTO daily_menu
                (product_id, fecha)
                VALUES ($1, $2)
                `,
                [productId, today]
            );
        }

        res.json({
            message: 'Menu del día actualizado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Error servidor'
        });
    }
};

// Obtener menú del día
const getDailyMenu = async (req, res) => {

    try {

        const today = new Date()
            .toISOString()
            .split('T')[0];

        const menu = await pool.query(
            `
            SELECT
                daily_menu.id,
                products.nombre,
                products.descripcion,
                products.precio,
                products.imagen
            FROM daily_menu
            INNER JOIN products
            ON daily_menu.product_id = products.id
            WHERE daily_menu.fecha = $1
            `,
            [today]
        );

        res.json(menu.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Error servidor'
        });
    }
};

module.exports = {
    setDailyMenu,
    getDailyMenu
};