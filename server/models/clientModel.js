const db = require('../config/db');

class Client {
  static async create(nom, telephone) {
    const [result] = await db.execute(
      'INSERT INTO clients (nom, telephone) VALUES (?, ?)',
      [nom, telephone]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM clients ORDER BY nom ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [id]);
    return rows[0];
  }

  static async getOrders(clientId) {
    const [rows] = await db.execute(
      'SELECT * FROM orders WHERE client_id = ? ORDER BY date DESC',
      [clientId]
    );
    return rows;
  }
}

module.exports = Client;
