CREATE DATABASE IF NOT EXISTS tshirt_business;
USE tshirt_business;

CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    type_tshirt ENUM('vraie coton', 'polo', '160', '115') NOT NULL,
    couleur VARCHAR(50) NOT NULL,
    motif_devant VARCHAR(255),
    motif_dos VARCHAR(255),
    total DECIMAL(10, 2) NOT NULL,
    avance DECIMAL(10, 2) DEFAULT 0,
    reste DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    taille VARCHAR(10) NOT NULL,
    quantite INT NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
