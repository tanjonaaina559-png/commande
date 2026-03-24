const Order = require('../models/orderModel');
const Client = require('../models/clientModel');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { 
      client_id, nom_client, telephone_client, 
      type_tshirt, couleur, motif_devant, motif_dos, 
      total, avance, reste, date, items 
    } = req.body;

    let finalClientId = client_id;

    // If client_id is not provided, create a new client
    if (!finalClientId && nom_client) {
      finalClientId = await Client.create(nom_client, telephone_client);
    }

    const orderId = await Order.create(
      finalClientId, type_tshirt, couleur, motif_devant, motif_dos, 
      total, avance, reste, date
    );

    // Add items
    for (const item of items) {
      if (item.quantite > 0) {
        await Order.addItem(orderId, item.taille, item.quantite, item.prix, item.total);
      }
    }

    res.status(201).json({ id: orderId, message: 'Order created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.delete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Order.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
