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

        if (
            !nombre ||
            !correo ||
            !telefono ||
            !password
        ) {
            return res.status(400).json({
                message:
                    'Completa todos los campos obligatorios'
            });
        }

        const userExist = await pool.query(
            'SELECT * FROM users WHERE correo = $1',
            [correo]
        );

        if (userExist.rows.length > 0) {
            return res.status(400).json({
                message:
                    'Correo ya registrado'
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const newUser =
            await pool.query(
                `
                INSERT INTO users
                (
                    nombre,
                    apellido,
                    correo,
                    telefono,
                    password,
                    rol
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )
                RETURNING *
                `,
                [
                    nombre,
                    apellido,
                    correo,
                    telefono,
                    hashedPassword,
                    'cliente'
                ]
            );

        res.status(201).json({
            message:
                'Usuario registrado correctamente',

            user: {
                id:
                    newUser.rows[0].id,

                nombre:
                    newUser.rows[0].nombre,

                apellido:
                    newUser.rows[0].apellido,

                correo:
                    newUser.rows[0].correo,

                telefono:
                    newUser.rows[0].telefono,

                rol:
                    newUser.rows[0].rol
            }
        });

    } catch (error) {

        console.log(
            'ERROR REGISTER:',
            error
        );

        res.status(500).json({
            message:
                'Error del servidor'
        });
    }
};

const login = async (req, res) => {
    try {

        const {
            correo,
            password
        } = req.body;

        if (
            !correo ||
            !password
        ) {
            return res.status(400).json({
                message:
                    'Correo y contraseña son obligatorios'
            });
        }

        const user =
            await pool.query(
                'SELECT * FROM users WHERE correo = $1',
                [correo]
            );

        if (
            user.rows.length === 0
        ) {
            return res.status(404).json({
                message:
                    'Usuario no encontrado'
            });
        }

        const userData =
            user.rows[0];

        const validPassword =
            await bcrypt.compare(
                password,
                userData.password
            );

        if (
            !validPassword
        ) {
            return res.status(401).json({
                message:
                    'Contraseña incorrecta'
            });
        }

        const token =
            jwt.sign(
                {
                    id:
                        userData.id,

                    rol:
                        userData.rol ??
                        'cliente'
                },

                process.env
                    .JWT_SECRET,

                {
                    expiresIn:
                        '7d'
                }
            );

        res.status(200).json({
            message:
                'Login exitoso',

            token,

            user: {
                id:
                    userData.id,

                nombre:
                    userData.nombre,

                apellido:
                    userData.apellido,

                correo:
                    userData.correo,

                telefono:
                    userData.telefono,

                rol:
                    userData.rol ??
                    'cliente'
            }
        });

    } catch (error) {

        console.log(
            'ERROR LOGIN:',
            error
        );

        res.status(500).json({
            message:
                'Error del servidor'
        });
    }
};

module.exports = {
    register,
    login
};
