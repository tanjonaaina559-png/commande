const db = require('../config/db');

class Order {
  static async create(clientId, typeTshirt, couleur, motifDevant, motifDos, total, avance, reste, date) {
    const [result] = await db.execute(
      'INSERT INTO orders (client_id, type_tshirt, couleur, motif_devant, motif_dos, total, avance, reste, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [clientId, typeTshirt, couleur, motifDevant, motifDos, total, avance, reste, date]
    );
    return result.insertId;
  }

  static async addItem(orderId, taille, quantite, prix, total) {
    await db.execute(
      'INSERT INTO order_items (order_id, taille, quantite, prix, total) VALUES (?, ?, ?, ?, ?)',
      [orderId, taille, quantite, prix, total]
    );
  }

  static async findAll() {
    const [rows] = await db.execute(`
      SELECT o.*, c.nom as client_name 
      FROM orders o 
      LEFT JOIN clients c ON o.client_id = c.id 
      ORDER BY o.date DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [order] = await db.execute(`
      SELECT o.*, c.nom as client_name, c.telephone as client_phone
      FROM orders o 
      LEFT JOIN clients c ON o.client_id = c.id 
      WHERE o.id = ?
    `, [id]);
    
    if (order.length === 0) return null;

    const [items] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [id]);
    return { ...order[0], items };
  }

  static async delete(id) {
    await db.execute('DELETE FROM orders WHERE id = ?', [id]);
  }

  static async getStats() {
    const [orderCount] = await db.execute('SELECT COUNT(*) as count FROM orders');
    const [totalSales] = await db.execute('SELECT SUM(total) as sum FROM orders');
    const [totalRemaining] = await db.execute('SELECT SUM(reste) as sum FROM orders');
    
    return {
      orderCount: orderCount[0].count,
      totalSales: totalSales[0].sum || 0,
      totalRemaining: totalRemaining[0].sum || 0
    };
  }
}

module.exports = Order;
