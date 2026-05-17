const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            correo,
            telefono,
            password
        } = req.body;

        const userExist = await pool.query(
            'SELECT * FROM users WHERE correo = $1',
            [correo]
        );

        if (userExist.rows.length > 0) {
            return res.status(400).json({
                message: 'Correo ya registrado'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            `
            INSERT INTO users
            (nombre, apellido, correo, telefono, password)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
            `,
            [
                nombre,
                apellido,
                correo,
                telefono,
                hashedPassword
            ]
        );

        res.status(201).json({
            message: 'Usuario registrado',
            user: newUser.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Error del servidor'
        });
    }
};

const login = async (req, res) => {
    try {

        const { correo, password } = req.body;

        const user = await pool.query(
            'SELECT * FROM users WHERE correo = $1',
            [correo]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: 'Contraseña incorrecta'
            });
        }

        const token = jwt.sign(
            {
                id: user.rows[0].id,
                rol: user.rows[0].rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.rows[0].id,
                nombre: user.rows[0].nombre,
                correo: user.rows[0].correo,
                rol: user.rows[0].rol
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Error servidor'
        });
    }
};

module.exports = {
    register,
    login
};