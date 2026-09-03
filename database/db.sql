CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_histories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES
('Usuario Uno', 'usuario1@example.com'),
('Usuario Dos', 'usuario2@example.com'),
('Usuario Tres', 'usuario3@example.com'),
('Usuario Cuatro', 'usuario4@example.com'),
('Usuario Cinco', 'usuario5@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO orders (user_id, product, amount)
SELECT id, 'Teclado mecánico', 54990 FROM users
WHERE email = 'usuario1@example.com'
  AND NOT EXISTS (SELECT 1 FROM orders WHERE product = 'Teclado mecánico');

INSERT INTO orders (user_id, product, amount)
SELECT id, 'Mouse inalámbrico', 24990 FROM users
WHERE email = 'usuario1@example.com'
  AND NOT EXISTS (SELECT 1 FROM orders WHERE product = 'Mouse inalámbrico');

SELECT id, name, email, created_at FROM users ORDER BY id;
