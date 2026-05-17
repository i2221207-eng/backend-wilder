const pool = require('../config/db');

// Crear pedido
const createOrder = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            direccion,
            telefono,
            productos
        } = req.body;

        let total = 0;

        // calcular total
        for (const item of productos) {

            const product = await pool.query(
                'SELECT * FROM products WHERE id = $1',
                [item.product_id]
            );

            const precio =
                parseFloat(product.rows[0].precio);

            total += precio * item.cantidad;
        }

        // crear orden
        const order = await pool.query(
            `
            INSERT INTO orders
            (
                user_id,
                total,
                direccion,
                telefono
            )
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [
                userId,
                total,
                direccion,
                telefono
            ]
        );

        const orderId = order.rows[0].id;

        // detalle orden
        for (const item of productos) {

            const product = await pool.query(
                'SELECT * FROM products WHERE id = $1',
                [item.product_id]
            );

            const precio =
                parseFloat(product.rows[0].precio);

            const subtotal =
                precio * item.cantidad;

            await pool.query(
                `
                INSERT INTO order_details
                (
                    order_id,
                    product_id,
                    cantidad,
                    precio,
                    subtotal
                )
                VALUES ($1,$2,$3,$4,$5)
                `,
                [
                    orderId,
                    item.product_id,
                    item.cantidad,
                    precio,
                    subtotal
                ]
            );
        }

        res.status(201).json({
            message: 'Pedido creado',
            order_id: orderId,
            total
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Error al crear pedido'
        });
    }
};

// Ver pedidos admin
const getOrders = async (req, res) => {

    try {

        const orders = await pool.query(`
            SELECT
                orders.*,
                users.nombre
            FROM orders
            INNER JOIN users
            ON orders.user_id = users.id
            ORDER BY orders.id DESC
        `);

        res.json(orders.rows);

    } catch (error) {

        res.status(500).json({
            message: 'Error servidor'
        });
    }
};

// Cambiar estado
const updateOrderStatus = async (req, res) => {

    try {

        const { id } = req.params;
        const { estado } = req.body;

        const order = await pool.query(
            `
            UPDATE orders
            SET estado = $1
            WHERE id = $2
            RETURNING *
            `,
            [estado, id]
        );

        res.json({
            message: 'Estado actualizado',
            order: order.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            message: 'Error servidor'
        });
    }
};
//ver hisotrial de pedidos
const getMyOrders =
async (req, res) => {

    try {

        const userId =
        req.user.id;

        const orders =
        await pool.query(
            `
            SELECT *
            FROM orders
            WHERE user_id = $1
            ORDER BY id DESC
            `,
            [userId]
        );

        res.json(
            orders.rows
        );

    } catch (error) {

        res.status(500).json({
            message:
            'Error servidor'
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
    getMyOrders
};