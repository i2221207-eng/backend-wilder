const pool = require('../config/db');

// Crear producto
const createProduct = async (req, res) => {

    try {

        const {
            category_id,
            nombre,
            descripcion,
            precio,
            imagen,
            tipo,
            es_menu_dia
        } = req.body;

        const newProduct = await pool.query(
            `
            INSERT INTO products
            (
                category_id,
                nombre,
                descripcion,
                precio,
                imagen,
                tipo,
                es_menu_dia
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
            `,
            [
                category_id,
                nombre,
                descripcion,
                precio,
                imagen,
                tipo,
                es_menu_dia
            ]
        );

        res.status(201).json({
            message: 'Producto creado',
            product: newProduct.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Error al crear producto'
        });
    }
};

// Ver todos los productos
const getProducts = async (req, res) => {

    try {

        const products = await pool.query(`
            SELECT
                products.*,
                categories.nombre AS categoria
            FROM products
            INNER JOIN categories
            ON products.category_id = categories.id
            ORDER BY products.id DESC
        `);

        res.json(products.rows);

    } catch (error) {

        res.status(500).json({
            message: 'Error servidor'
        });
    }
};

// Ver extras
const getExtras = async (req, res) => {

    try {

        const extras = await pool.query(`
            SELECT *
            FROM products
            WHERE tipo = 'extra'
        `);

        res.json(extras.rows);

    } catch (error) {

        res.status(500).json({
            message: 'Error servidor'
        });
    }
};

// Ver menu del día
const getMenuDay = async (req, res) => {

    try {

        const menu = await pool.query(`
            SELECT *
            FROM products
            WHERE es_menu_dia = true
        `);

        res.json(menu.rows);

    } catch (error) {

        res.status(500).json({
            message: 'Error servidor'
        });
    }
};
// Editar producto
const updateProduct = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            category_id,
            nombre,
            descripcion,
            precio,
            imagen,
            tipo,
            es_menu_dia,
            disponible
        } = req.body;

        const updatedProduct = await pool.query(
            `
            UPDATE products
            SET
                category_id = $1,
                nombre = $2,
                descripcion = $3,
                precio = $4,
                imagen = $5,
                tipo = $6,
                es_menu_dia = $7,
                disponible = $8
            WHERE id = $9
            RETURNING *
            `,
            [
                category_id,
                nombre,
                descripcion,
                precio,
                imagen,
                tipo,
                es_menu_dia,
                disponible,
                id
            ]
        );

        res.json({
            message: 'Producto actualizado',
            product: updatedProduct.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Error al actualizar'
        });
    }
};
//Eliminar producto
const deleteProduct = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            'DELETE FROM products WHERE id = $1',
            [id]
        );

        res.json({
            message: 'Producto eliminado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Error al eliminar'
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getExtras,
    getMenuDay,
    updateProduct,
    deleteProduct
};