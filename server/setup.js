/**
 * Script d'initialisation de la base de données
 * Crée la base de données et toutes les tables automatiquement
 * Usage: node setup.js
 */
const mysql = require('mysql2');
require('dotenv').config();

// Connexion SANS spécifier de base de données
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
});

const SQL = `
CREATE DATABASE IF NOT EXISTS tshirt_business CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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
  type_tshirt ENUM('vraie coton','polo','160','115') NOT NULL,
  couleur VARCHAR(50) NOT NULL,
  motif_devant VARCHAR(255),
  motif_dos VARCHAR(255),
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  avance DECIMAL(10,2) NOT NULL DEFAULT 0,
  reste DECIMAL(10,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  taille VARCHAR(10) NOT NULL,
  quantite INT NOT NULL DEFAULT 0,
  prix DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
`;

console.log('🔄 Connexion à MySQL...');

connection.connect((err) => {
  if (err) {
    console.error('❌ Connexion échouée:', err.message);
    console.error('👉 Vérifiez DB_USER et DB_PASSWORD dans le fichier .env');
    process.exit(1);
  }

  console.log('✅ Connecté à MySQL !');
  console.log('🔄 Création de la base de données et des tables...');

  // Execute each statement separately
  const statements = SQL.split(';').map(s => s.trim()).filter(s => s.length > 0);
  let done = 0;

  const runNext = (i) => {
    if (i >= statements.length) {
      console.log('');
      console.log('✅ Base de données tshirt_business créée avec succès !');
      console.log('✅ Tables clients, orders, order_items créées !');
      console.log('');
      console.log('🚀 Vous pouvez maintenant lancer le serveur: node server.js');
      connection.end();
      return;
    }
    connection.query(statements[i], (err) => {
      if (err) {
        console.error(`❌ Erreur SQL: ${statements[i].substring(0, 60)}...`);
        console.error(err.message);
      }
      runNext(i + 1);
    });
  };

  runNext(0);
});
