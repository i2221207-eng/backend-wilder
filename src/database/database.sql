CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    correo VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    password TEXT NOT NULL,
    rol VARCHAR(20) DEFAULT 'cliente',
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    estado BOOLEAN DEFAULT true
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2),
    imagen TEXT,
    tipo VARCHAR(20),
    disponible BOOLEAN DEFAULT true,
    es_menu_dia BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_menu (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    fecha DATE NOT NULL,
    activo BOOLEAN DEFAULT true
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    total DECIMAL(10,2),
    estado VARCHAR(30) DEFAULT 'pendiente',
    direccion TEXT,
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_details (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id),
    cantidad INT NOT NULL,
    precio DECIMAL(10,2),
    subtotal DECIMAL(10,2)
);